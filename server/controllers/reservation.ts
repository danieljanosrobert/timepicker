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
      today.setHours(0,0,0,0);
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
        end: req.body.end,
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
