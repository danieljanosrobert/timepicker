import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AdminUser } from '../models/AdminUsers';
import { constants } from 'http2';
import { ADMIN, jwtSignUser } from '../utils/authorization';
import uuid from 'uuid';
import * as serviceController from './service';
import * as contactController from './contact';
import * as messageController from './messages';

/**
 * POST /admin/register
 * Sign up usign email and password.
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Validation error' });
  }

  if (!req.body.name || !req.body.serviceName) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Invalid fields' });
  }

  const user = new AdminUser({
    email: req.body.email,
    password: req.body.password,
  });
  AdminUser.findOne({ email: user.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(constants.HTTP_STATUS_CONFLICT).send({
        error: 'Account with that email address already exists.',
      });
    }
    user.save((saveError) => {
      if (saveError) {
        return next(saveError);
      }
      const serviceId = uuid.v4();
      serviceController.saveService(req, res, next, serviceId);
      contactController.saveContact(req, res, next, serviceId);
      messageController.createMessage(req, res, next, serviceId);

      jwtSignUser(res, { email: user.email }, undefined, ADMIN);
    });
  });
};

/**
 * POST /admin/auth
 * Returns OK is middleware says it's authenticated
 */

export const auth = async (req: Request, res: Response) => {
  return res.sendStatus(constants.HTTP_STATUS_OK);
};

/**
 * POST /admin/login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send('Validation error');
  }
  const user = new AdminUser({
    email: req.body.email,
    password: req.body.password,
  });
  AdminUser.findOne({ email: user.email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect email or password' });
      }
      bcrypt.compare(user.password, dbUser.password)
        .then((isMatch) => {
          if (isMatch) {
            jwtSignUser(res, { email: user.email }, undefined, ADMIN);
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect email or password' });
          }
        });
    });
};

/**
 * POST /settings/change-password
 * Change password
 */
export const postChangePassword = async (req: Request, res: Response) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send('Validation error');
  }
  AdminUser.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ error: 'User not found' });
      }
      bcrypt.compare(req.body.oldPassword, dbUser.password)
        .then((isMatch) => {
          if (isMatch) {
            dbUser.password = req.body.password;
            dbUser.save();
            return res.sendStatus(constants.HTTP_STATUS_OK);
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
          }
        });
    });
};
