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
var http2_1 = require("http2");
var js_base64_1 = require("js-base64");
var Services_1 = require("../models/Services");
var Reservations_1 = require("../models/Reservations");
var _ = __importStar(require("lodash"));
var dateUtil_1 = __importDefault(require("../utils/dateUtil"));
var Leaves_1 = require("../models/Leaves");
exports.getReservations = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = js_base64_1.Base64.decode(req.params.service_id);
        Reservations_1.Reservation.find({ service_id: serviceId }, '-_id start end createdAt lastName firstName')
            .then(function (dbReservation) {
            if (!dbReservation) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Reservations not found',
                });
            }
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var result = _.filter(dbReservation, function (reservation) {
                return dateUtil_1.default.isAfterEquals(reservation.start, new Date(today));
            });
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
exports.postReserve = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = js_base64_1.Base64.decode(req.body.serviceId);
        Services_1.Service.findOne({ service_id: serviceId })
            .then(function (dbService) {
            if (!dbService) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                });
            }
            var reservation = new Reservations_1.Reservation({
                service_id: serviceId,
                email: req.body.email,
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                city: req.body.city,
                age: req.body.age,
                comment: req.body.comment,
                start: req.body.start,
            });
            Reservations_1.Reservation.findOne({ service_id: serviceId, start: reservation.start })
                .then(function (dbReservation) {
                if (dbReservation) {
                    return res.status(http2_1.constants.HTTP_STATUS_CONFLICT).send({
                        error: 'Reservation already exists',
                    });
                }
                reservation.save(function (saveError) {
                    if (saveError) {
                        return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                            error: 'Error occured during save'
                        });
                    }
                });
                res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
            });
        });
        return [2 /*return*/];
    });
}); };
exports.updateReservationsIfNeeded = function (bookTime, originalBookTime) { return __awaiter(void 0, void 0, void 0, function () {
    var today;
    return __generator(this, function (_a) {
        today = new Date();
        today.setHours(0, 0, 0, 0);
        Reservations_1.Reservation.find({ service_id: bookTime.service_id }, undefined, { sort: 'start' })
            .then(function (dbReservation) { return __awaiter(void 0, void 0, void 0, function () {
            var oldStartTime, oldEndTime, newStartTime, newEndTime, countByTime, occupiedTimes, occupiedDates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dbReservation) {
                            return [2 /*return*/];
                        }
                        oldStartTime = dateUtil_1.default.minuteFromHour(originalBookTime.startTime);
                        oldEndTime = dateUtil_1.default.minuteFromHour(originalBookTime.endTime);
                        newStartTime = dateUtil_1.default.minuteFromHour(bookTime.startTime);
                        newEndTime = dateUtil_1.default.minuteFromHour(bookTime.endTime);
                        dbReservation = _.filter(dbReservation, function (reservation) { return dateUtil_1.default.isAfterEquals(reservation.start, today); });
                        _.forEach(dbReservation, function (reservation) {
                            var _a = _.split(reservation.start, ' '), reservationDate = _a[0], reservationTime = _a[1];
                            // check if reservation was shifted by break. If so, put the reservation on the next point based on duration
                            reservationTime = shiftReservation(reservationTime, originalBookTime.bookDuration, oldStartTime);
                            // check if duration changed. If so, put the reservation on the next point based on new duration
                            if (originalBookTime.bookDuration !== bookTime.bookDuration) {
                                reservationTime = shiftReservation(reservationTime, bookTime.bookDuration, newStartTime);
                            }
                            // check if starting time changed. If so, set the reservation time to startTime
                            if (newStartTime > oldStartTime && dateUtil_1.default.minuteFromHour(reservationTime) < newStartTime) {
                                reservationTime = dateUtil_1.default.hourFromMinute(newStartTime);
                            }
                            // check if starting time changed. If so, set the reservation time to startTime
                            if (newEndTime < oldEndTime && dateUtil_1.default.minuteFromHour(reservationTime) > newEndTime) {
                                reservationTime = dateUtil_1.default.hourFromMinute(newEndTime - bookTime.bookDuration < newStartTime
                                    ? newStartTime : newEndTime - bookTime.bookDuration);
                            }
                            var resultDate = dateUtil_1.default.addDaysToDate(reservationDate, Math.floor(dateUtil_1.default.minuteFromHour(reservationTime) / 1440));
                            reservation.start = resultDate + " " + reservationTime;
                        });
                        countByTime = _.countBy(dbReservation, 'start');
                        occupiedTimes = _.keysIn(countByTime);
                        occupiedDates = [];
                        return [4 /*yield*/, Leaves_1.Leave.findOne({ service_id: bookTime.service_id })
                                .then(function (dbLeave) {
                                if (!dbLeave) {
                                    return;
                                }
                                _.forEach(dbLeave.leaves, function (leave) {
                                    var daysOnLeave = dateUtil_1.default.getStringArrayBetweenTwoDates(leave.leaveInterval[0], leave.leaveInterval[1]);
                                    occupiedDates = occupiedDates.concat(daysOnLeave);
                                });
                            })];
                    case 1:
                        _a.sent();
                        _.forEach(countByTime, function (count, date) {
                            var filteredReservations = _.filter(dbReservation, function (res) { return res.start === date; });
                            _.forEach(filteredReservations, function (reservation) {
                                var flag = true;
                                var _a = _.split(reservation.start, ' '), reservationDate = _a[0], reservationTime = _a[1];
                                var reservationTimeInMinutes = dateUtil_1.default.minuteFromHour(reservationTime);
                                while (flag && count > 1) {
                                    if (reservationTimeInMinutes >= newEndTime) {
                                        reservationTimeInMinutes = newStartTime;
                                        reservationDate = dateUtil_1.default.addDaysToDate(reservationDate, 1);
                                    }
                                    var constructedDate = reservationDate + " " + dateUtil_1.default.hourFromMinute(reservationTimeInMinutes);
                                    if (!_.includes(occupiedTimes, constructedDate)) {
                                        occupiedTimes.push(constructedDate);
                                        reservation.start = constructedDate;
                                        flag = false;
                                        count--;
                                    }
                                    reservationTimeInMinutes += bookTime.bookDuration;
                                }
                                while (_.includes(occupiedDates, reservationDate)) {
                                    reservationDate = dateUtil_1.default.addDaysToDate(reservationDate, 1);
                                    var constructedDate = reservationDate + " " + reservationTime;
                                    reservation.start = constructedDate;
                                    if (!_.includes(occupiedDates, reservationDate)) {
                                        flag = false;
                                    }
                                }
                            });
                        });
                        // save modified reservations
                        _.forEach(dbReservation, function (reservation) { return reservation.save(); });
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
var shiftReservation = function (reservationTime, duration, startTime) {
    if (dateUtil_1.default.minuteFromHour(reservationTime) % duration
        !== startTime % duration) {
        reservationTime = dateUtil_1.default.hourFromMinute(dateUtil_1.default.minuteFromHour(reservationTime) + duration
            - dateUtil_1.default.minuteFromHour(reservationTime) % duration + startTime % duration);
    }
    return reservationTime;
};
