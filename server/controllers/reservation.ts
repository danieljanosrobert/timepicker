import { NextFunction, Response } from 'express';
import { constants } from 'http2';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';
import { Reservation, ReservationDocument } from '../models/Reservations';
import * as _ from 'lodash';
import dateUtil from '../utils/dateUtil';
import { Leave } from '../models/Leaves';
import { AdminUser } from '../models/AdminUsers';

export const getUsersReservations = async (req:any, res: Response, next: NextFunction) => {
  const email = Base64.decode(req.params.user_email);
  Reservation.find({email: email}, '-_id start createdAt status service_id').lean()
    .then((dbReservations) => {
      if (!dbReservations) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Reservations not found',
        });
      }
      const serviceIds = _.map(dbReservations, 'service_id');
      Service.find({service_id: {$in: serviceIds}}, '-_id service_id name')
        .then( (dbServices) => {
          _.forEach(dbReservations, (reservation) => {
            const reservationsService = _.find(dbServices, { 'service_id': reservation.service_id} )
            reservation.serviceName = reservationsService ? reservationsService.name : '';
            reservation.service_id = Base64.encode(reservation.service_id);
          });
          return res.status(constants.HTTP_STATUS_OK).send(dbReservations);
        });
    });
};

export const postGetReservations = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  let isAdmin = false;
  let isOwnService = false;
  await AdminUser.findOne({ email: email })
    .then((dbUserAdmin) => {
      if (dbUserAdmin) isAdmin = true;
    })
  await Service.findOne({ service_id: serviceId ,user_email: email })
    .then((dbService) => {
      if (dbService) isOwnService = true;
    })
  Reservation.find({ service_id: serviceId }, '-_id start createdAt lastName email firstName status')
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
        }
        if (!isAdmin && current.email !== email) {
          current.status = '';
        } else if (isAdmin && !isOwnService && current.email !== email) {
          current.status = '';
        }
        current.email = '';
      })
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
};

export const postReserve = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.serviceId)
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
        age: req.body.age,
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
                error: 'Error occured during save'
              });
            }
          });
          res.sendStatus(constants.HTTP_STATUS_OK);
        });
    });
};

export const postAcceptReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  AdminUser.findOne({ email: email })
    .then((dbUser) => {
      if (dbUser) {
        Reservation.findOne({service_id: serviceId, start: req.body.start})
          .then( (dbReservation) => {
            if (dbReservation) {
              dbReservation.status = 'Elfogadott';
              dbReservation.save((err) => {
                if (err) {
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during trying to save reservation',
                  });
                }
              });
              return res.sendStatus(constants.HTTP_STATUS_OK);
            } else {
              return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                error: 'Reservation does not exist'
              });
            }
          })
      } else {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'
        });
      }
    });
};

export const postResignReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  Reservation.findOne({email: email, service_id: serviceId, start: req.body.start})
    .then( (dbReservation) => {
      if (dbReservation) {
        dbReservation.remove((err) => {
          if (err) {
            return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
              error: 'Error occured during trying to remove reservation',
            });
          }
        });
        if (req.body.resign_message) {
          console.log('lemondó email küldése, az üzenet:');
          console.log(req.body.resign_message);
        }
        return res.sendStatus(constants.HTTP_STATUS_OK);
      } else {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'Reservation does not exist'
        });
      }
    });
}

export const postDeleteReservation = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.body.service_id);
  const email = Base64.decode(req.body.user_email);
  AdminUser.findOne({ email: email })
    .then((dbUser) => {
      if (dbUser) {
        Reservation.findOne({service_id: serviceId, start: req.body.start})
          .then( (dbReservation) => {
            if (dbReservation) {
              dbReservation.remove((err) => {
                if (err) {
                  return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                    error: 'Error occured during trying to remove reservation',
                  });
                }
              });
              if (req.body.refuse_message) {
                console.log('elutasító email küldése, az üzenet:');
                console.log(req.body.refuse_message);
              }
              if (req.body.resign_message) {
                console.log('lemondó email küldése, az üzenet:');
                console.log(req.body.resign_message);
              }
              return res.sendStatus(constants.HTTP_STATUS_OK);
            } else {
              return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                error: 'Reservation does not exist'
              });
            }
          });
      } else {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          error: 'User does not exist'
        });
      }
    });
};

export const updateReservationsIfNeeded = async (bookTime: any, originalBookTime: any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  Reservation.find({ service_id: bookTime.service_id }, undefined, { sort: 'start' })
    .then(async (dbReservation) => {
      if (!dbReservation) {
        return;
      }
      const oldStartTime = dateUtil.minuteFromHour(originalBookTime.startTime);
      let oldEndTime = dateUtil.minuteFromHour(originalBookTime.endTime);
      const newStartTime = dateUtil.minuteFromHour(bookTime.startTime);
      let newEndTime = dateUtil.minuteFromHour(bookTime.endTime);
      dbReservation = _.filter(dbReservation, (reservation) => dateUtil.isAfterEquals(reservation.start, today));
      _.forEach(dbReservation, (reservation) => {
        let [reservationDate, reservationTime] = _.split(reservation.start, ' ');

        // check if reservation was shifted by break. If so, put the reservation on the next point based on duration
        reservationTime = shiftReservation(reservationTime, originalBookTime.bookDuration, oldStartTime);

        // check if duration changed. If so, put the reservation on the next point based on new duration
        if (originalBookTime.bookDuration !== bookTime.bookDuration) {
          reservationTime = shiftReservation(reservationTime, bookTime.bookDuration, newStartTime)
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

        let resultDate = dateUtil.addDaysToDate(reservationDate,
          Math.floor(dateUtil.minuteFromHour(reservationTime) / 1440));

        reservation.start = `${resultDate} ${reservationTime}`;
      });

      // shift times by if on the same position
      const countByTime = _.countBy(dbReservation, 'start');
      let occupiedTimes = _.keysIn(countByTime);
      let occupiedDates: string[] = [];

      await Leave.findOne({ service_id: bookTime.service_id })
        .then((dbLeave) => {
          if (!dbLeave) { return; }
          _.forEach(dbLeave.leaves, (leave) => {
            const daysOnLeave = dateUtil.getStringArrayBetweenTwoDates(
              leave.leaveInterval[0], leave.leaveInterval[1]);
            occupiedDates = occupiedDates.concat(daysOnLeave)
          });
        });
      _.forEach(countByTime, (count, date) => {
        const filteredReservations = _.filter(dbReservation, (res) => res.start === date);
        _.forEach(filteredReservations, (reservation) => {
          let [reservationDate, reservationTime] = _.split(reservation.start, ' ');
          let reservationTimeInMinutes = dateUtil.minuteFromHour(reservationTime);
          while (count > 1) {
            if (reservationTimeInMinutes >= newEndTime) {
              reservationTimeInMinutes = newStartTime;
              reservationDate = dateUtil.addDaysToDate(reservationDate, 1);
            }
            const constructedDate = `${reservationDate} ${dateUtil.hourFromMinute(reservationTimeInMinutes)}`;
            if (!_.includes(occupiedTimes, constructedDate)) {
              occupiedTimes.push(constructedDate);
              reservation.start = constructedDate;
              count--;
            }
            reservationTimeInMinutes += bookTime.bookDuration;
          }
          while (_.includes(occupiedDates, reservationDate)) {
            reservationDate = dateUtil.addDaysToDate(reservationDate, 1);
            const constructedDate = `${reservationDate} ${reservationTime}`;
            reservation.start = constructedDate;
            if (_.includes(occupiedTimes, constructedDate)) {
              countByTime[constructedDate]++;
            }
          }
        });
      });
      // save modified reservations
      _.forEach(dbReservation, (reservation) => reservation.save());
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
}