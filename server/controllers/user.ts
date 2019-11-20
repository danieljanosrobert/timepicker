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
    age: req.body.age,
    selectedServiceTags: req.body.selectedServiceTags,
  });
  User.findOne({ email: user.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(constants.HTTP_STATUS_CONFLICT).send({ error: 'Account with that email address already exists.' });
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
    console.log(validationErrorResult.mapped());
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Validation error' });
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'User not found' });
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
  console.log(req.body)

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    console.log(validationErrorResult.mapped());
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send('Validation error');
  }
  User.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
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

/**
 * POST /settings/get-user-data
 * Get actual user's data
 */
export const postGetUserData = async (req: Request, res: Response) => {
  User.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
      }
      const result = {
        lastName: dbUser.lastName,
        firstName: dbUser.firstName,
        city: dbUser.city,
        age: dbUser.age,
        selectedServiceTags: dbUser.selectedServiceTags,
      };
      return res.status(constants.HTTP_STATUS_OK).send(result);
    });
}

/**
 * POST /settings/modify-user
 * Update user's data
 */
export const updateUserData = async (req: Request, res: Response) => {
  User.findOne({ email: req.body.user_email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
      }
      bcrypt.compare(req.body.password, dbUser.password)
        .then((isMatch) => {
          if (isMatch) {
            dbUser.lastName = req.body.lastName,
              dbUser.firstName = req.body.firstName,
              dbUser.city = req.body.city,
              dbUser.age = req.body.age,
              dbUser.selectedServiceTags = req.body.selectedServiceTags,
              dbUser.save();
            return res.sendStatus(constants.HTTP_STATUS_OK);
          } else {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
          }
        });
    });
}
