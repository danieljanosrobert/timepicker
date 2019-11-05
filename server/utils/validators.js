"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
exports.credentialValidator = [
    express_validator_1.check('email').exists()
        .withMessage('Email must exist')
        .isEmail()
        .withMessage('Email is not valid'),
    express_validator_1.check('password').exists()
        .withMessage('Password must exist')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
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
