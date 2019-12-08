import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Flag } from '../models/Flags';
import { Base64 } from 'js-base64';
import { Service } from '../models/Services';
import * as _ from 'lodash';

/**
 * GET /flag/:user_email
 * Returns User's flagged Services
 */
export const getUsersFlags = async (req: any, res: Response) => {
  const userEmail = Base64.decode(req.params.user_email);
  Flag.find({user_email: userEmail}, 'service_id', {sort: 'createdAt'}, (flagError, dbFlags) => {
    if (flagError) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (dbFlags) {
      const serviceIds = _.map(dbFlags, 'service_id');
      Service.find({service_id: {$in: serviceIds}, hidden: false}, '-_id', (serviceError, dbServices) => {
        if (serviceError) {
          return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
        }
        if (dbServices) {
          _.map(dbServices, (service) => service.service_id = Base64.encode(service.service_id));
          return res.status(constants.HTTP_STATUS_OK).send(dbServices);
        }
      });
    } else {
      return res.sendStatus(constants.HTTP_STATUS_OK);
    }
  });
};

/**
 * POST /flag
 * Saves or deletes a Flag to given Service for User
 */
export const postToggleFlagService = async (req: any, res: Response) => {
  const serviceId = Base64.decode(req.body.service_id);
  Service.findOne({ service_id: serviceId }, (serviceError, dbService) => {
    if (serviceError) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (!dbService) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
        error: 'Service not found',
      });
    }
    const flag = new Flag({
      user_email: req.body.user_email,
      service_id: serviceId,
    });
    Flag.findOne({ user_email: flag.user_email, service_id: serviceId }, (flagError, dbFlag) => {
      if (flagError) {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
      }
      if (dbFlag) {
        dbFlag.remove((err) => {
          if (err) {
            return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
              error: 'Error occured during trying to remove flag',
            });
          }
        });
        return res.sendStatus(constants.HTTP_STATUS_OK);
      }
      flag.save((saveError) => {
        if (saveError) {
          return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
            error: 'Error occured during save',
          });
        }
      });
      return res.sendStatus(constants.HTTP_STATUS_CREATED);
    });
  });
};
