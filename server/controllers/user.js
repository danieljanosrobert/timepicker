"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var express_validator_1 = require("express-validator");
var Users_1 = require("../models/Users");
var http2_1 = require("http2");
var authorization_1 = require("../utils/authorization");
/**
 * POST /register
 * Sign up usign email and password.
 */
exports.postRegister = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var validationErrorResult, user;
    return __generator(this, function (_a) {
        validationErrorResult = express_validator_1.validationResult(req);
        if (!validationErrorResult.isEmpty()) {
            return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Validation error' })];
        }
        user = new Users_1.User({
            email: req.body.email,
            password: req.body.password,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            city: req.body.city,
            age: req.body.age,
            selectedServiceTags: req.body.selectedServiceTags,
        });
        Users_1.User.findOne({ email: user.email }, function (err, existingUser) {
            if (err) {
                return next(err);
            }
            if (existingUser) {
                return res.status(http2_1.constants.HTTP_STATUS_CONFLICT).send({ error: 'Account with that email address already exists.' });
            }
            user.save(function (saveError) {
                if (saveError) {
                    return next(saveError);
                }
                authorization_1.jwtSignUser(res, { email: user.email }, http2_1.constants.HTTP_STATUS_CREATED);
            });
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationErrorResult, user;
    return __generator(this, function (_a) {
        validationErrorResult = express_validator_1.validationResult(req);
        if (!validationErrorResult.isEmpty()) {
            console.log(validationErrorResult.mapped());
            return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Validation error' })];
        }
        user = new Users_1.User({
            email: req.body.email,
            password: req.body.password,
        });
        Users_1.User.findOne({ email: user.email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'User not found' });
            }
            bcrypt_1.default.compare(user.password, dbUser.password)
                .then(function (isMatch) {
                if (isMatch) {
                    authorization_1.jwtSignUser(res, { email: user.email });
                }
                else {
                    return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect email or password' });
                }
            });
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /settings/change-password
 * Change password
 */
exports.postChangePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationErrorResult;
    return __generator(this, function (_a) {
        console.log(req.body);
        validationErrorResult = express_validator_1.validationResult(req);
        if (!validationErrorResult.isEmpty()) {
            console.log(validationErrorResult.mapped());
            return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send('Validation error')];
        }
        Users_1.User.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
            }
            bcrypt_1.default.compare(req.body.oldPassword, dbUser.password)
                .then(function (isMatch) {
                if (isMatch) {
                    dbUser.password = req.body.password;
                    dbUser.save();
                    return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                }
                else {
                    return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
                }
            });
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /settings/get-user-data
 * Get actual user's data
 */
exports.postGetUserData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        Users_1.User.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
            }
            var result = {
                lastName: dbUser.lastName,
                firstName: dbUser.firstName,
                city: dbUser.city,
                age: dbUser.age,
                selectedServiceTags: dbUser.selectedServiceTags,
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /settings/modify-user
 * Update user's data
 */
exports.updateUserData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        Users_1.User.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
            }
            bcrypt_1.default.compare(req.body.password, dbUser.password)
                .then(function (isMatch) {
                if (isMatch) {
                    dbUser.lastName = req.body.lastName,
                        dbUser.firstName = req.body.firstName,
                        dbUser.city = req.body.city,
                        dbUser.age = req.body.age,
                        dbUser.selectedServiceTags = req.body.selectedServiceTags,
                        dbUser.save();
                    return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                }
                else {
                    return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({ error: 'Incorrect password' });
                }
            });
        });
        return [2 /*return*/];
    });
}); };
