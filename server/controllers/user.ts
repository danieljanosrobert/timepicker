import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult } from 'express-validator';
import {User, UserDocument} from '../models/Users';
import jwt from 'jsonwebtoken';
import {constants} from 'http2';

const secret = process.env.SECRET || 'secret';

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
 * POST /register
 * Sign up usign email and password.
 */
export const postRegister = (req: Request, res: Response, next: NextFunction) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty() || req.body.password !== req.body.confirmPassword) {
    console.log(validationErrorResult.mapped());
    return res.json('Validation error on register');
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email }, (err, existingUser) => {
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
      return res.sendStatus(constants.HTTP_STATUS_CREATED);
    });
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = (req: Request, res: Response) => {

  const validationErrorResult = validationResult(req);

  if (!validationErrorResult.isEmpty()) {
    console.log(validationErrorResult.mapped());
    return res.json('Validation error on login');
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email })
      .then( (dbUser) => {
        if (!dbUser) {
          return res.status(404).json('No Account Found');
        }
        bcrypt.compare(user.password, dbUser.password)
          .then((isMatch) => {
            if (isMatch) {
              const payload = {
                id: dbUser._id,
                name: dbUser.email,
              };
              jwt.sign(payload, secret, { expiresIn: 36000 },
                (err, token) => {
                  if (err) {
                    res.status(500).json({ error: 'Error signing token', raw: err});
                  }
                  res.json({ success: true, token: `Bearer ${token}`});
                });
            } else {
                res.status(400).json('Password is incorrect');
            }
          });
      });
};

