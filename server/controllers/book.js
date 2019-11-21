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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var reservationController = __importStar(require("./reservation"));
var AdminUsers_1 = require("../models/AdminUsers");
var http2_1 = require("http2");
var BookTimes_1 = require("../models/BookTimes");
var Breaks_1 = require("../models/Breaks");
var Leaves_1 = require("../models/Leaves");
var bcrypt_1 = __importDefault(require("bcrypt"));
var Services_1 = require("../models/Services");
var dateUtil_1 = __importDefault(require("../utils/dateUtil"));
var _ = __importStar(require("lodash"));
exports.getBookTime = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = Base64.decode(req.params.service_id);
        BookTimes_1.BookTime.findOne({ service_id: serviceId })
            .then(function (dbBookTime) {
            if (!dbBookTime) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Book not found',
                });
            }
            var result = {
                lastMonth: dbBookTime.lastMonth,
                startTime: dbBookTime.startTime,
                endTime: dbBookTime.endTime,
                bookDuration: dbBookTime.bookDuration,
                selectedWeekdays: dbBookTime.selectedWeekdays,
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
exports.postSaveBookTime = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        AdminUsers_1.AdminUser.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                    error: 'User does not exist'
                });
            }
            bcrypt_1.default.compare(req.body.password, dbUser.password)
                .then(function (isMatch) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (isMatch) {
                        Services_1.Service.findOne({ user_email: req.body.user_email }, 'service_id')
                            .then(function (dbService) {
                            if (!dbService) {
                                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                                    error: 'Service not found',
                                });
                            }
                            var bookTime = new BookTimes_1.BookTime({
                                service_id: dbService.service_id,
                                lastMonth: req.body.lastMonth,
                                startTime: req.body.startTime,
                                endTime: req.body.endTime,
                                bookDuration: req.body.bookDuration,
                                selectedWeekdays: req.body.selectedWeekdays,
                            });
                            var bookTimeAsObject = bookTime.toObject();
                            delete bookTimeAsObject._id;
                            BookTimes_1.BookTime.findOneAndUpdate({ service_id: bookTime.service_id }, bookTimeAsObject, { upsert: true }, function (updateError, originalBookTime) {
                                if (updateError) {
                                    console.log(updateError);
                                    return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                        error: 'Error occured during updating bookTime.',
                                    });
                                }
                                if (originalBookTime && originalBookTime.startTime) {
                                    if (originalBookTime.startTime !== bookTime.startTime
                                        || originalBookTime.bookDuration !== bookTime.bookDuration
                                        || originalBookTime.endTime !== bookTime.endTime) {
                                        reservationController.updateReservationsIfNeeded(bookTime, originalBookTime);
                                    }
                                }
                                Breaks_1.Break.deleteOne({ service_id: dbService.service_id }, function (err) {
                                    if (err) {
                                        return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                            error: 'Error occured during deleting breaks.',
                                        });
                                    }
                                });
                                return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                            });
                        });
                    }
                    else {
                        return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                                error: 'Incorrect password',
                            })];
                    }
                    return [2 /*return*/];
                });
            }); });
        });
        return [2 /*return*/];
    });
}); };
exports.getBreaks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = Base64.decode(req.params.service_id);
        Breaks_1.Break.findOne({ service_id: serviceId })
            .then(function (dbBreak) {
            if (!dbBreak) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Breaks not found',
                });
            }
            var result = {
                breaks: dbBreak.breaks,
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
exports.postSaveBreaks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        AdminUsers_1.AdminUser.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                    error: 'User does not exist'
                });
            }
            bcrypt_1.default.compare(req.body.password, dbUser.password)
                .then(function (isMatch) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (isMatch) {
                        Services_1.Service.findOne({ user_email: req.body.user_email }, 'service_id')
                            .then(function (dbService) {
                            if (!dbService) {
                                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                                    error: 'Service not found',
                                });
                            }
                            var breaks = new Breaks_1.Break({
                                service_id: dbService.service_id,
                                breaks: JSON.parse(req.body.breaks),
                            });
                            var breakAsObject = breaks.toObject();
                            delete breakAsObject._id;
                            console.log(JSON.stringify(breakAsObject.breaks));
                            _.forEach(breakAsObject.breaks, function (currBreak) {
                                var totalTime = dateUtil_1.default.minuteFromHour(currBreak.startTime) + currBreak.duration;
                                if (totalTime > 1440) {
                                    currBreak.duration -= totalTime % 1440;
                                    breakAsObject.breaks.push({
                                        date: dateUtil_1.default.addDaysToDate(currBreak.date, 1),
                                        startTime: '00:00',
                                        duration: totalTime % 1440,
                                        always: currBreak.always,
                                    });
                                }
                            });
                            Breaks_1.Break.findOneAndUpdate({ service_id: breaks.service_id }, breakAsObject, { upsert: true }, function (updateError, no) {
                                if (updateError) {
                                    console.log(updateError);
                                    return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                        error: 'Error occured during updating breaks.',
                                    });
                                }
                                return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                            });
                        });
                    }
                    else {
                        return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                                error: 'Incorrect password',
                            })];
                    }
                    return [2 /*return*/];
                });
            }); });
        });
        return [2 /*return*/];
    });
}); };
exports.getLeaves = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = Base64.decode(req.params.service_id);
        Leaves_1.Leave.findOne({ service_id: serviceId })
            .then(function (dbLeave) {
            if (!dbLeave) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Leaves not found',
                });
            }
            var result = {
                leaves: dbLeave.leaves,
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
exports.postSaveLeaves = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        AdminUsers_1.AdminUser.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                    error: 'User does not exist'
                });
            }
            bcrypt_1.default.compare(req.body.password, dbUser.password)
                .then(function (isMatch) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (isMatch) {
                        Services_1.Service.findOne({ user_email: req.body.user_email }, 'service_id')
                            .then(function (dbService) {
                            if (!dbService) {
                                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                                    error: 'Service not found',
                                });
                            }
                            var leaves = new Leaves_1.Leave({
                                service_id: dbService.service_id,
                                leaves: JSON.parse(req.body.leaves),
                            });
                            var leavesAsObject = leaves.toObject();
                            delete leavesAsObject._id;
                            Leaves_1.Leave.findOneAndUpdate({ service_id: leaves.service_id }, leavesAsObject, { upsert: true }, function (updateError, no) {
                                if (updateError) {
                                    console.log(updateError);
                                    return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                        error: 'Error occured during updating leaves.',
                                    });
                                }
                                return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                            });
                        });
                    }
                    else {
                        return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                                error: 'Incorrect password',
                            })];
                    }
                    return [2 /*return*/];
                });
            }); });
        });
        return [2 /*return*/];
    });
}); };
