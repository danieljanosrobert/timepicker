"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var reservationSchema = new mongoose_1.default.Schema({
    service_id: String,
    email: String,
    lastName: String,
    firstName: String,
    city: String,
    comment: String,
    start: String,
    status: String,
}, { timestamps: true });
exports.Reservation = mongoose_1.default.model('Reservation', reservationSchema);
