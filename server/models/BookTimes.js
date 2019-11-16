"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var bookTimeSchema = new mongoose_1.default.Schema({
    user_email: { type: String, required: true, unique: true },
    lastMonth: String,
    startTime: String,
    endTime: String,
    bookDuration: Number,
    selectedWeekdays: [String],
});
exports.BookTime = mongoose_1.default.model('BookTime', bookTimeSchema);
