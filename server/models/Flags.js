"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var flagSchema = new mongoose_1.default.Schema({
    user_email: String,
    service_id: String,
}, { timestamps: true });
exports.Flag = mongoose_1.default.model('Flag', flagSchema);
