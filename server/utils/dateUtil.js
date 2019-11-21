"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var dateUtil = {
    minuteFromHour: function (hour) {
        var _a = _.split(hour, ':', 2), h = _a[0], m = _a[1];
        return 60 * parseInt(h, 10) + parseInt(m, 10);
    },
    hourFromMinute: function (minute) {
        minute = minute % 1440;
        var h = ('00' + Math.floor(minute / 60)).slice(-2);
        var m = ('00' + minute % 60).slice(-2);
        return h + ":" + m;
    },
    addDaysToDate: function (dateString, daysToAdd) {
        var dateOfString = new Date(dateString);
        dateOfString.setDate(dateOfString.getDate() + daysToAdd);
        return this.createStringFromDate(dateOfString);
    },
    createStringFromDate: function (date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
    },
    isAfter: function (firstDate, secondDate) {
        if (typeof firstDate === 'string') {
            firstDate = new Date(firstDate);
        }
        if (typeof secondDate === 'string') {
            secondDate = new Date(secondDate);
        }
        return firstDate.getTime() > secondDate.getTime();
    },
    isAfterEquals: function (firstDate, secondDate) {
        if (typeof firstDate === 'string') {
            firstDate = new Date(firstDate);
        }
        if (typeof secondDate === 'string') {
            secondDate = new Date(secondDate);
        }
        return firstDate.getTime() >= secondDate.getTime();
    },
    isBefore: function (firstDate, secondDate) {
        if (typeof firstDate === 'string') {
            firstDate = new Date(firstDate);
        }
        if (typeof secondDate === 'string') {
            secondDate = new Date(secondDate);
        }
        return firstDate.getTime() < secondDate.getTime();
    },
    isBeforeEquals: function (firstDate, secondDate) {
        if (typeof firstDate === 'string') {
            firstDate = new Date(firstDate);
        }
        if (typeof secondDate === 'string') {
            secondDate = new Date(secondDate);
        }
        return firstDate.getTime() <= secondDate.getTime();
    },
    equals: function (firstDate, secondDate) {
        if (typeof firstDate === 'string') {
            firstDate = new Date(firstDate);
        }
        if (typeof secondDate === 'string') {
            secondDate = new Date(secondDate);
        }
        return firstDate.getTime() === secondDate.getTime();
    },
};
exports.default = dateUtil;
