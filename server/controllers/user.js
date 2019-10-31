"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var express_validator_1 = require("express-validator");
var Users_1 = require("../models/Users");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var http2_1 = require("http2");
var secret = process.env.SECRET || 'secret';
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
 * POST /register
 * Sign up usign email and password.
 */
exports.postRegister = function (req, res, next) {
    var validationErrorResult = express_validator_1.validationResult(req);
    if (!validationErrorResult.isEmpty() || req.body.password !== req.body.confirmPassword) {
        console.log(validationErrorResult.mapped());
        return res.json('Validation error on register');
    }
    var user = new Users_1.User({
        email: req.body.email,
        password: req.body.password,
    });
    Users_1.User.findOne({ email: user.email }, function (err, existingUser) {
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
            return res.sendStatus(http2_1.constants.HTTP_STATUS_CREATED);
        });
    });
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function (req, res) {
    var validationErrorResult = express_validator_1.validationResult(req);
    if (!validationErrorResult.isEmpty()) {
        console.log(validationErrorResult.mapped());
        return res.json('Validation error on login');
    }
    var user = new Users_1.User({
        email: req.body.email,
        password: req.body.password,
    });
    Users_1.User.findOne({ email: user.email })
        .then(function (dbUser) {
        if (!dbUser) {
            return res.status(404).json('No Account Found');
        }
        bcrypt_1.default.compare(user.password, dbUser.password)
            .then(function (isMatch) {
            if (isMatch) {
                var payload = {
                    id: dbUser._id,
                    name: dbUser.email,
                };
                jsonwebtoken_1.default.sign(payload, secret, { expiresIn: 36000 }, function (err, token) {
                    if (err) {
                        res.status(500).json({ error: 'Error signing token', raw: err });
                    }
                    res.json({ success: true, token: "Bearer " + token });
                });
            }
            else {
                res.status(400).json('Password is incorrect');
            }
        });
    });
};
