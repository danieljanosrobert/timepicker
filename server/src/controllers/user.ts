import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/Users';
import { constants } from 'http2';
import { jwtSignUser } from '../utils/authorization';

/**
 * POST /register
 * Sign up usign email and password.
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Validation error' });
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    city: req.body.city,
  });
  User.findOne({ email: user.email }, (err, existingUser) => {
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
      jwtSignUser(res, { email: user.email }, constants.HTTP_STATUS_CREATED);
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
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Validation error' });
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email }, (err, dbUser) => {
    if (err) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (!dbUser) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect email or password' });
    }
    bcrypt.compare(user.password, dbUser.password)
      .then((isMatch) => {
        if (isMatch) {
          jwtSignUser(res, { email: user.email });
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
  User.findOne({ email: req.body.user_email }, (err, dbUser) => {
    if (err) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (!dbUser) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ error: 'User not found' });
    }
    bcrypt.compare(req.body.oldPassword, dbUser.password)
      .then((isMatch) => {
        if (isMatch) {
          dbUser.password = req.body.password;
          dbUser.save((saveError) => {
            if (saveError) {
              return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Error during save' });
            }
          });
          return res.sendStatus(constants.HTTP_STATUS_OK);
        } else {
          return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
        }
      });
  });
};

/**
 * POST /settings/get-user-data
 * Get currently logged in user's data
 */
export const postGetUserData = async (req: Request, res: Response) => {
  User.findOne({ email: req.body.user_email }, (err, dbUser) => {
    if (err) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (!dbUser) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ error: 'User not found' });
    }
    const result = {
      lastName: dbUser.lastName,
      firstName: dbUser.firstName,
      city: dbUser.city,
    };
    return res.status(constants.HTTP_STATUS_OK).send(result);
  });
};

/**
 * POST /settings/modify-user
 * Update user's data
 */
export const updateUserData = async (req: Request, res: Response) => {
  User.findOne({ email: req.body.user_email }, (err, dbUser) => {
    if (err) {
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Some error occured' });
    }
    if (!dbUser) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ error: 'User not found' });
    }
    bcrypt.compare(req.body.password, dbUser.password)
      .then((isMatch) => {
        if (isMatch) {
          dbUser.lastName = req.body.lastName,
            dbUser.firstName = req.body.firstName,
            dbUser.city = req.body.city,
            dbUser.save((saveError) => {
              if (saveError) {
                return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ error: 'Error during save' });
              }
            });
          return res.sendStatus(constants.HTTP_STATUS_OK);
        } else {
          return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
        }
      });
  });
};
