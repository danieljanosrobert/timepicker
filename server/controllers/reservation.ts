import { NextFunction, Response } from 'express';
import { constants } from 'http2';
import appConstants from '../utils/constants';
import { sendMail } from '../email/emailService';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';
import { Reservation, ReservationDocument } from '../models/Reservations';
import * as _ from 'lodash';
import dateUtil from '../utils/dateUtil';
import { Leave } from '../models/Leaves';
import { AdminUser } from '../models/AdminUsers';
import path from 'path';
import Pusher from 'pusher';

const apiUrl = process.env.API_URL || 'http://localhost:8081';
const homeUrl = process.env.HOME_URL || 'http://localhost:8080';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_APP_KEY || '',
  secret: process.env.PUSHER_APP_SECRET || '',
  cluster: process.env.PUSHER_APP_CLUSTER || '',
});

/**
 * GET /my-reservations/:user_email
 * Return User's reservations
 */
export const getUsersReservations = async (req: any, res: Response, next: NextFunction) => {
  const email = Base64.decode(req.params.user_email);
  Reservation.find({ email }, '-_id start createdAt status service_id').lean()
    .then((dbReservations) => {
      if (!dbReservations) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Reservations not found',
        });
      }
      const serviceIds = _.map(dbReservations, 'service_id');
      Service.find({ service_id: { $in: serviceIds } }, '-_id service_id name')
        .then((dbServices) => {
          _.forEach(dbReservations, (reservation) => {
            const reservationsService = _.find(dbServices, { service_id: reservation.service_id });
            reservation.serviceName = reservationsService ? reservationsService.name : '';
            reservation.service_id = Base64.encode(reservation.service_id);
          });
          return res.status(constants.HTTP_STATUS_OK).send(dbReservations);
        });
    });
};

/**
 * POST /reservations
 * Returns reservations of Service with given service_id.
 *  - if no email is provided returns reservations with empty status, meaning they are occupied
 *  - if email is provided returns reservations reserved by user's email with their status,
 *     other reservations with empty status
 *  - if email is provided and user is admin and user is the owner of Service returns reservations with their status
 */
export const postGetReservations = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  let isAdmin = false;
  let isOwnService = false;
  await AdminUser.findOne({ email })
    .then((dbUserAdmin) => {
      if (dbUserAdmin) {
        isAdmin = true;
      }
    });
  await Service.findOne({ service_id: serviceId, user_email: email })
    .then((dbService) => {
      if (dbService) {
        isOwnService = true;
      }
    });
  Reservation.find({ service_id: serviceId }, '-_id start createdAt lastName comment email firstName status')
    .then((dbReservation) => {
      if (!dbReservation) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Reservations not found',
        });
      }
      const result = req.body.all_dates ? dbReservation : filterDatesBeforeToday(dbReservation);
      _.forEach(result, (current) => {
        if (!email) {
          current.status = '';
          current.comment = '';
        }
        if (!isAdmin && current.email !== email) {
          current.status = '';
          current.comment = '';
        } else if (isAdmin && !isOwnService && current.email !== email) {
          current.status = '';
          current.comment = '';
        }
        current.email = '';
      });
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

/**
 * POST /reserve
 * Saves reservation on a book-time-generated event
 */
export const postReserve = async (req: any, res: Response, next: NextFunction) => {
  if (!req.body.start) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
      error: 'Start must exist',
    });
  }
  const serviceId = Base64.decode(req.body.service_id);
  Service.findOne({ service_id: serviceId })
    .then((dbService) => {
      if (!dbService) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Service not found',
        });
      }
      const reservation = new Reservation({
        service_id: serviceId,
        email: req.body.email,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        city: req.body.city,
        comment: req.body.comment,
        start: req.body.start,
        status: req.body.status,
      });
      Reservation.findOne({ service_id: serviceId, start: reservation.start })
        .then((dbReservation) => {
          if (dbReservation) {
            return res.status(constants.HTTP_STATUS_CONFLICT).send({
              error: 'Reservation already exists',
            });
          }
          reservation.save((saveError) => {
            if (saveError) {
              return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                error: 'Error occured during save',
              });
            }
          });
          if (reservation.status === appConstants.reservationStatuses[2]) {
            const emailDetails = {
              to: reservation.email,
              subject: 'Időpontfoglalás megerősítése',
              replacements: {
                invocation: `${reservation.lastName} ${reservation.firstName}`,
                serviceName: dbService.name,
                startTime: reservation.start,
                activateUrl: `${apiUrl}/api/activate/${req.body.service_id}/${Base64.encode(reservation.start)}`,
                resignUrl: `${apiUrl}/api/resign-by-email/${req.body.service_id}/${Base64.encode(reservation.start)}` +
                  `/${Base64.encode(reservation.email)}`,
              },
            };
            sendMail(appConstants.mailTypes.activate, emailDetails);
            if (process.env.TEST) {
              // tslint:disable-next-line:no-console
              console.log(`activation link: ${emailDetails.replacements.activateUrl}`);
            }
          } else if (reservation.status === appConstants.reservationStatuses[0]) {
            const emailDetails = {
              to: reservation.email,
              subject: 'Időpont elfogadva',
              replacements: {
                invocation: `${reservation.lastName} ${reservation.firstName}`,
                serviceName: dbService.name,
                startTime: reservation.start,
                resignUrl: `${apiUrl}/api/resign-by-email/${req.body.service_id}/${Base64.encode(reservation.start)}` +
                  `/${Base64.encode(reservation.email)}`,
              },
            };
            sendMail(appConstants.mailTypes.reservationAccepted, emailDetails);
          }
          pusher.trigger(req.body.service_id, 'fetch_needed', {
            details: `reservation added with status '${reservation.status}'`,
          });
          res.sendStatus(constants.HTTP_STATUS_OK);
        });
    });
};

/**
 * GET /activate/:service_id/:start
 * Activates reservation of Service with given service_id that starts at start via link from email.
 */
export const activateReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  const start = Base64.decode(req.params.start);
  Reservation.findOne({ service_id: serviceId, start })
    .then((dbReservation) => {
      if (dbReservation && dbReservation.status === appConstants.reservationStatuses[2]) {
        dbReservation.status = appConstants.reservationStatuses[1];
        dbReservation.save((err) => {
          if (err) {
            return res.sendFile(path.join(__dirname + '/views/linkError.html'));
          }
          pusher.trigger(req.params.service_id, 'fetch_needed', {
            details: 'reservation activated via email',
          });
          return res.redirect(homeUrl + '/successfully-activated');
        });
      } else {
        return res.sendFile(path.join(__dirname + '/views/linkError.html'));
      }
    });
};

/**
 * GET /resign-by-email/:service_id/:start/:email
 * Resigns reservation of Service with given service_id that starts at start and was reserved by given email via email.
 */
export const resignByEmail = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  const start = Base64.decode(req.params.start);
  const email = Base64.decode(req.params.email);
  Reservation.findOne({ email, service_id: serviceId, start })
    .then((dbReservation) => {
      if (dbReservation) {
        Service.findOne({ service_id: serviceId })
          .then((dbService) => {
            if (dbService) {
              dbReservation.remove((err) => {
                if (err) {
                  return res.sendFile(path.join(__dirname + '/views/linkError.html'));
                }
              });
              const emailDetails = {
                to: dbService.user_email,
                subject: 'Időpont lemondásra került',
                replacements: {
                  invocation: 'Szolgáltató',
                  serviceName: dbService.name,
                  startTime: dbReservation.start,
                },
              };
              sendMail(appConstants.mailTypes.reservationResigned, emailDetails);
              pusher.trigger(req.params.service_id, 'fetch_needed', {
                details: 'reservation resigned via email',
              });
              return res.redirect(homeUrl + '/successfully-activated');
            } else {
              return res.sendFile(path.join(__dirname + '/views/linkError.html'));
            }
          });
      } else {
        return res.sendFile(path.join(__dirname + '/views/linkError.html'));
      }
    });
};

/**
 * POST /reservations/accept
 * Accepts selected reservation
 */
export const postAcceptReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  AdminUser.findOne({ email })
    .then((dbUser) => {
      if (dbUser) {
        Reservation.findOne({ service_id: serviceId, start: req.body.start })
          .then((dbReservation) => {
            if (dbReservation && dbReservation.status === appConstants.reservationStatuses[1]) {
              Service.findOne({ service_id: serviceId })
                .then((dbService) => {
                  if (dbService) {
                    dbReservation.status = appConstants.reservationStatuses[0];
                    dbReservation.save((err) => {
                      if (err) {
                        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                          error: 'Error occured during trying to save reservation',
                        });
                      }
                    });
                    const emailDetails = {
                      to: dbReservation.email,
                      subject: 'Időpont elfogadva',
                      replacements: {
                        invocation: `${dbReservation.lastName} ${dbReservation.firstName}`,
                        serviceName: dbService.name,
                        startTime: dbReservation.start,
                        resignUrl: `${apiUrl}/api/resign-by-email/${req.body.service_id}/${Base64.encode(dbReservation.start)}` +
                          `/${Base64.encode(dbReservation.email)}`,
                      },
                    };
                    sendMail(appConstants.mailTypes.reservationAccepted, emailDetails);
                    pusher.trigger(req.body.service_id, 'fetch_needed', {
                      details: 'reservation accepted',
                    });
                    return res.sendStatus(constants.HTTP_STATUS_OK);
                  } else {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                      error: 'Service does not exist',
                    });
                  }
                });
            } else {
              return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                error: 'Reservation does not exist',
              });
            }
          });
      } else {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist',
        });
      }
    });
};

/**
 * POST /reservations/resign
 * Resigns selected reservation
 */
export const postResignReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  Reservation.findOne({ email, service_id: serviceId, start: req.body.start })
    .then((dbReservation) => {
      if (dbReservation) {
        Service.findOne({ service_id: serviceId })
          .then((dbService) => {
            if (dbService) {
              dbReservation.remove((err) => {
                if (err) {
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during trying to remove reservation',
                  });
                }
              });
              const emailDetails = {
                to: dbService.user_email,
                subject: 'Időpont lemondásra került',
                replacements: {
                  invocation: 'Szolgáltató',
                  serviceName: dbService.name,
                  startTime: dbReservation.start,
                },
              };
              sendMail(appConstants.mailTypes.reservationResigned, emailDetails);
              pusher.trigger(req.body.service_id, 'fetch_needed', {
                details: 'reservation resigned',
              });
              return res.sendStatus(constants.HTTP_STATUS_OK);
            } else {
              return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                error: 'Service does not exist',
              });
            }
          });
      } else {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'Reservation does not exist',
        });
      }
    });
};

/**
 * POST /reservations/delete
 * Deletes selected reservation
 */
export const postDeleteReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  AdminUser.findOne({ email })
    .then((dbUser) => {
      if (dbUser) {
        Reservation.findOne({ service_id: serviceId, start: req.body.start })
          .then((dbReservation) => {
            if (dbReservation) {
              Service.findOne({ service_id: serviceId })
                .then((dbService) => {
                  if (dbService) {
                    dbReservation.remove((err) => {
                      if (err) {
                        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                          error: 'Error occured during trying to remove reservation',
                        });
                      }
                    });
                    let refuseMessage = '';
                    if (req.body.refuse_message) {
                      refuseMessage = `Elutasítás oka: ${req.body.refuse_message}`;
                    }
                    const emailDetails = {
                      to: dbReservation.email,
                      subject: 'Időpont elutasításra került',
                      replacements: {
                        invocation: `${dbReservation.lastName} ${dbReservation.firstName}`,
                        serviceName: dbService.name,
                        startTime: dbReservation.start,
                        refuseMessage,
                      },
                    };
                    sendMail(appConstants.mailTypes.reservationDeleted, emailDetails);
                    pusher.trigger(req.body.service_id, 'fetch_needed', {
                      details: 'reservation deleted',
                    });
                    return res.sendStatus(constants.HTTP_STATUS_OK);
                  } else {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                      error: 'Service does not exist',
                    });
                  }
                });
            } else {
              return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                error: 'Reservation does not exist',
              });
            }
          });
      } else {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist',
        });
      }
    });
};

/**
 * If starting time, ending time, or duration changed during updating a book-time
 *   moves forward the reservations that are affected by the update to a valid book-time.
 * @param bookTime The book-time that is in update progress
 * @param originalBookTime The book-time that was originally saved
 */
export const updateReservationsIfNeeded = async (bookTime: any, originalBookTime: any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  Reservation.find({ service_id: bookTime.service_id }, undefined, { sort: 'start' })
    .then(async (dbReservation) => {
      if (!dbReservation) {
        return;
      }
      const oldStartTime = dateUtil.minuteFromHour(originalBookTime.startTime);
      const oldEndTime = dateUtil.minuteFromHour(originalBookTime.endTime);
      const newStartTime = dateUtil.minuteFromHour(bookTime.startTime);
      const newEndTime = dateUtil.minuteFromHour(bookTime.endTime);
      dbReservation = _.filter(dbReservation, (reservation) => dateUtil.isAfterEquals(reservation.start, today));
      _.forEach(dbReservation, (reservation) => {
        // tslint:disable-next-line:prefer-const
        let [reservationDate, reservationTime] = _.split(reservation.start, ' ');

        // check if reservation was shifted by break. If so, put the reservation on the next point based on duration
        reservationTime = shiftReservation(reservationTime, originalBookTime.bookDuration, oldStartTime);

        // check if duration changed. If so, put the reservation on the next point based on new duration
        if (originalBookTime.bookDuration !== bookTime.bookDuration) {
          reservationTime = shiftReservation(reservationTime, bookTime.bookDuration, newStartTime);
        }

        // check if starting time changed. If so, set the reservation time to startTime
        if (newStartTime > oldStartTime && dateUtil.minuteFromHour(reservationTime) < newStartTime) {
          reservationTime = dateUtil.hourFromMinute(newStartTime);
        }

        // check if starting time changed. If so, set the reservation time to startTime
        if (newEndTime < oldEndTime && dateUtil.minuteFromHour(reservationTime) > newEndTime) {
          reservationTime = dateUtil.hourFromMinute(newEndTime - bookTime.bookDuration < newStartTime
            ? newStartTime : newEndTime - bookTime.bookDuration);
        }

        const resultDate = dateUtil.addDaysToDate(reservationDate,
          Math.floor(dateUtil.minuteFromHour(reservationTime) / 1440));

        reservation.start = `${resultDate} ${reservationTime}`;
      });

      // shift times by if on the same position
      const countByTime = _.countBy(dbReservation, 'start');
      const occupiedTimes = _.keysIn(countByTime);
      // tslint:disable-next-line:prefer-const
      let occupiedDates: string[] = [];

      await Leave.findOne({ service_id: bookTime.service_id })
        .then((dbLeave) => {
          if (!dbLeave) { return; }
          _.forEach(dbLeave.leaves, (leave) => {
            const daysOnLeave = dateUtil.getStringArrayBetweenTwoDates(
              leave.leaveInterval[0], leave.leaveInterval[1]);
            occupiedDates = occupiedDates.concat(daysOnLeave);
          });
        });
      _.forEach(countByTime, (count, date) => {
        const filteredReservations = _.filter(dbReservation, (res) => res.start === date);
        _.forEach(filteredReservations, (reservation) => {
          // tslint:disable-next-line:prefer-const
          let [reservationDate, reservationTime] = _.split(reservation.start, ' ');
          // if actual day is not a selected weekday increase the date by 1 day
          if (!dateUtil.isDateInSelectedWeekday(reservation.start, bookTime.selectedWeekdays)) {
            reservationDate = dateUtil.addDaysToDate(reservationDate, 1);
            const constructedDate = `${reservationDate} ${reservationTime}`;
            reservation.start = constructedDate;
            if (_.includes(occupiedTimes, constructedDate)) {
              countByTime[constructedDate]++;
            } else {
              countByTime[constructedDate] = 1;
            }
            return;
          }
          let reservationTimeInMinutes = dateUtil.minuteFromHour(reservationTime);
          // if there is more than one reservations on a date moves reservation to a free date-time
          while (count > 1) {
            if (reservationTimeInMinutes >= newEndTime) {
              reservationTimeInMinutes = newStartTime;
              reservationDate = dateUtil.addDaysToDate(reservationDate, 1);
            }
            const constructedDate = `${reservationDate} ${dateUtil.hourFromMinute(reservationTimeInMinutes)}`;
            if (!dateUtil.isDateInSelectedWeekday(constructedDate, bookTime.selectedWeekdays)) {
              continue;
            }
            if (!_.includes(occupiedTimes, constructedDate)) {
              occupiedTimes.push(constructedDate);
              reservation.start = constructedDate;
              count--;
              return;
            }
            reservationTimeInMinutes += bookTime.bookDuration;
          }
          // while the shifted reservation's date is on leave-time increase the date by 1 day
          while (_.includes(occupiedDates, reservationDate)) {
            reservationDate = dateUtil.addDaysToDate(reservationDate, 1);
            const constructedDate = `${reservationDate} ${reservationTime}`;
            if (!dateUtil.isDateInSelectedWeekday(constructedDate, bookTime.selectedWeekdays)) {
              continue;
            }
            reservation.start = constructedDate;
            if (_.includes(occupiedTimes, constructedDate)) {
              countByTime[constructedDate]++;
            }
          }
        });
      });
      // save modified reservations
      Service.findOne({ service_id: bookTime.service_id })
        .then((dbService) => {
          if (dbService) {
            _.forEach(dbReservation, (reservation) => {
              const emailDetails = {
                to: reservation.email,
                subject: 'Időpont módosításra került',
                replacements: {
                  invocation: `${reservation.lastName} ${reservation.firstName}`,
                  serviceName: dbService.name,
                  startTime: reservation.start,
                  resignUrl: `${apiUrl}/api/resign-by-email/${bookTime.service_id}/${Base64.encode(reservation.start)}`
                   + `/${Base64.encode(reservation.email)}`,
                },
              };
              sendMail(appConstants.mailTypes.reservationModified, emailDetails);
              reservation.save();
            });
          } else {
            throw new Error('Service does not exist');
          }
        });
    });
};

const shiftReservation = (reservationTime: string, duration: number, startTime: number): string => {
  if (dateUtil.minuteFromHour(reservationTime) % duration
    !== startTime % duration) {
    reservationTime = dateUtil.hourFromMinute(dateUtil.minuteFromHour(reservationTime) + duration
      - dateUtil.minuteFromHour(reservationTime) % duration + startTime % duration);
  }
  return reservationTime;
};

const filterDatesBeforeToday = (reservations: ReservationDocument[]): ReservationDocument[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return _.filter(reservations, (reservation) => {
    return dateUtil.isAfterEquals(reservation.start, new Date(today));
  });
};
