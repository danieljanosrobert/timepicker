import { check } from 'express-validator';

export const credentialValidator = [
  check('email').exists()
    .withMessage('Email must exist')
    .isEmail()
    .withMessage('Email is not valid'),
  check('password').exists()
    .withMessage('Password must exist')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const passwordValidator = [
  check('confirmPassword', 'ConfirmPassword must exist').exists(),
  check('password', 'Password and ConfirmPassword should be equal')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error('Passwords don\'t match');
      } else { return value; }
    }),
];

export const registerValidator = credentialValidator.concat(passwordValidator);

export const passwordChangeValidator =[
  check('oldPassword', 'OldPassword must exist').exists(),
  check('oldPassword', 'Password and OldPassword should not be equal')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        throw new Error('Passwords match');
      } else { return value; }
    })
].concat(passwordValidator);

