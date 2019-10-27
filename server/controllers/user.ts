import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult } from 'express-validator';

import {User} from '../models/Users';

export const credentialValidator = [
  check('email').exists()
      .withMessage('Email must exist')
      .isEmail()
      .withMessage('Email is not valid'),
  check('password').exists()
      .withMessage('Password must exist')
      .isLength({min: 6})
      .withMessage('Password must be at least 4 characters long'),
];

export const registerValidator = credentialValidator.concat([
    check('confirmPassword', 'ConfirmPassword must exist').exists(),
    check('password', 'Password and ConfirmPassword should be equal')
        .custom((value, {req}) => {
          if (value !== req.body.confirmPassword) {
            throw new Error('Passwords don\'t match');
          } else { return value; }
        }),
]);

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = (req: Request, res: Response) => {
  sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const validationErrorResult = validationResult(req);
  if (!validationErrorResult.isEmpty()) {
    console.log(validationErrorResult.mapped());
    return res.json('Nemjó!');
  }
  return res.json(JSON.stringify('ok'));
};

/**
 * POST /register
 * Sign up usign email and password.
 */
export const postRegister = (req: Request, res: Response, next: NextFunction) => {
  sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty() || req.body.password !== req.body.confirmPassword) {
    console.log(validationErrorResult.mapped());
    return res.json('Nemjó!');
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: 'asd' }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.json('Account with that email address already exists.');
    }
    user.save((saveError) => {
      if (saveError) {
        return next(saveError);
      }
      return res.json('ok, megvan');
    });
  });
};

