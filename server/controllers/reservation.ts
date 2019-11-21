import { NextFunction, Response } from 'express';
import { constants } from 'http2';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';
import { Reservation } from '../models/Reservations';
import * as _ from 'lodash';
import dateUtil from '../utils/dateUtil';

export const getReservations = async (req: any, res: Response, next: NextFunction) => {
  const serviceId = Base64.decode(req.params.service_id);
  Reservation.find({ service_id: serviceId }, '-_id start end createdAt lastName firstName')
    .then((dbReservation) => {
      if (!dbReservation) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
          error: 'Reservations not found',
        });
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = _.filter(dbReservation, (reservation) => {
        return dateUtil.isAfterEquals(reservation.start, new Date(today));
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

export const updateReservationsIfNeeded = async (bookTime: any, originalBookTime: any) => {
  Reservation.find({ service_id: bookTime.service_id }, undefined, { sort: 'start' })
    .then((dbReservation) => {
      if (!dbReservation) {
        return;
      }
      const oldStartTime = dateUtil.minuteFromHour(originalBookTime.startTime);
      let oldEndTime = dateUtil.minuteFromHour(originalBookTime.endTime);
      const newStartTime = dateUtil.minuteFromHour(bookTime.startTime);
      let newEndTime = dateUtil.minuteFromHour(bookTime.endTime);

      _.forEach(dbReservation, (reservation) => {
        let [reservationDate, reservationTime] = _.split(reservation.start, ' ');

        // check if reservation was shifted by break. If so, put the reservation on the next point based on duration
        if (dateUtil.minuteFromHour(reservationTime) % originalBookTime.bookDuration
          !== oldStartTime % originalBookTime.bookDuration) {
          reservationTime = dateUtil.hourFromMinute(
            dateUtil.minuteFromHour(reservationTime) + originalBookTime.bookDuration
            - dateUtil.minuteFromHour(reservationTime) % originalBookTime.bookDuration
            + oldStartTime % originalBookTime.bookDuration);
        }
        // check if duration changed. If so, put the reservation on the next point based on new duration
        if (originalBookTime.bookDuration !== bookTime.bookDuration) {
          if (dateUtil.minuteFromHour(reservationTime) % bookTime.bookDuration
            !== newStartTime % bookTime.bookDuration) {
            reservationTime = dateUtil.hourFromMinute(
              dateUtil.minuteFromHour(reservationTime) + bookTime.bookDuration
              - dateUtil.minuteFromHour(reservationTime) % bookTime.bookDuration
              + newStartTime % bookTime.bookDuration);
          }
        }
        // check if starting time changed. If so, set the reservation time to startTime
        if (newStartTime > oldStartTime) {
          if (dateUtil.minuteFromHour(reservationTime) < newStartTime) {
            reservationTime = dateUtil.hourFromMinute(newStartTime);
          }
        }

        // check if starting time changed. If so, set the reservation time to startTime
        if (newEndTime < oldEndTime) {
          if (dateUtil.minuteFromHour(reservationTime) > newEndTime) {
            reservationTime = dateUtil.hourFromMinute(newEndTime - bookTime.bookDuration < newStartTime
              ? newStartTime : newEndTime - bookTime.bookDuration);
          }
        }

        const resultDate = dateUtil.addDaysToDate(reservationDate, Math.floor(dateUtil.minuteFromHour(reservationTime) / 1440))
        reservation.start = `${resultDate} ${reservationTime}`
      });

      // shift times by if on the same position
      const countByTime = _.countBy(dbReservation, 'start');
      let occupiedTimes = _.keysIn(countByTime);
      _.forEach(countByTime, (count, date) => {
        if (count > 1) {
          const filteredReservations = _.filter(dbReservation, (res) => res.start === date);
          _.forEach(filteredReservations, (reservation) => {
            let flag = true;
            let [reservationDate, reservationTime] = _.split(reservation.start, ' ');
            let reservationTimeInMinutes = dateUtil.minuteFromHour(reservationTime);
            while (flag) {
              if (reservationTimeInMinutes >= newEndTime) {
                reservationTimeInMinutes = newStartTime;
                reservationDate = dateUtil.addDaysToDate(reservationDate, 1);
              }
              const constructedDate = `${reservationDate} ${dateUtil.hourFromMinute(reservationTimeInMinutes)}`;
              if (!_.includes(occupiedTimes, constructedDate)) {
                occupiedTimes.push(constructedDate);
                reservation.start = constructedDate;
                flag = false;
              }
              reservationTimeInMinutes += bookTime.bookDuration;
            }
          });
        }
      });
      // save modified reservations
      _.forEach(dbReservation, (reservation) => reservation.save());
    });
};