import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import {validationResult} from 'express-validator';
import {User} from '../models/Users';
import {constants} from 'http2';
import {jwtSignUser} from '../utils/authorization';

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
      jwtSignUser(res, {email: user.email}, constants.HTTP_STATUS_CREATED);
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
      .then( (dbUser) => {
        if (!dbUser) {
          return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect email or password' });
        }
        bcrypt.compare(user.password, dbUser.password)
          .then((isMatch) => {
            if (isMatch) {
              jwtSignUser(res, {email: user.email});
            } else {
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect email or password' });
            }
          });
      });
};
