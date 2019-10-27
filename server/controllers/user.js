"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var Users_1 = require("../models/Users");
exports.credentialValidator = [
    express_validator_1.check('email').exists()
        .withMessage('Email must exist')
        .isEmail()
        .withMessage('Email is not valid'),
    express_validator_1.check('password').exists()
        .withMessage('Password must exist')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 4 characters long'),
];
exports.registerValidator = exports.credentialValidator.concat([
    express_validator_1.check('confirmPassword', 'ConfirmPassword must exist').exists(),
    express_validator_1.check('password', 'Password and ConfirmPassword should be equal')
        .custom(function (value, _a) {
        var req = _a.req;
        if (value !== req.body.confirmPassword) {
            throw new Error('Passwords don\'t match');
        }
        else {
            return value;
        }
    }),
]);
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function (req, res) {
    express_validator_1.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    var validationErrorResult = express_validator_1.validationResult(req);
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
exports.postRegister = function (req, res, next) {
    express_validator_1.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    var validationErrorResult = express_validator_1.validationResult(req);
    if (!validationErrorResult.isEmpty() || req.body.password !== req.body.confirmPassword) {
        console.log(validationErrorResult.mapped());
        return res.json('Nemjó!');
    }
    var user = new Users_1.User({
        email: req.body.email,
        password: req.body.password,
    });
    Users_1.User.findOne({ email: 'asd' }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.json('Account with that email address already exists.');
        }
        user.save(function (saveError) {
            if (saveError) {
                return next(saveError);
            }
            return res.json('ok, megvan');
        });
    });
};
