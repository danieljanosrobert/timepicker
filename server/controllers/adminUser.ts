import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import {validationResult} from 'express-validator';
import {AdminUser} from '../models/AdminUsers';
import {constants} from 'http2';
import {jwtSignUser} from '../utils/authorization';

/**
 * POST /register
 * Sign up usign email and password.
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    console.log(validationErrorResult.mapped());
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json('Validation error');
  }
  const user = new AdminUser({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    servicename: req.body.servicename,
  });
  AdminUser.findOne({ email: user.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(constants.HTTP_STATUS_CONFLICT).json('Account with that email address already exists.');
    }
    user.save((saveError) => {
      if (saveError) {
        return next(saveError);
      }
      jwtSignUser(res, {email: user.email});
    });
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    console.log(validationErrorResult.mapped());
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json('Validation error');
  }
  const user = new AdminUser({
    email: req.body.email,
    password: req.body.password,
  });
  AdminUser.findOne({ email: user.email })
      .then( (dbUser) => {
        if (!dbUser) {
          return res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
        }
        bcrypt.compare(user.password, dbUser.password)
          .then((isMatch) => {
            if (isMatch) {
              jwtSignUser(res, {email: user.email});
            } else {
                res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST);
            }
          });
      });
};