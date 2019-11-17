"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var messageSchema = new mongoose_1.default.Schema({
    user_email: { type: String, required: true, unique: true },
    messages: [{
            title: String,
            sub: String,
            content: String,
        }],
}, { timestamps: true });
exports.Messages = mongoose_1.default.model('Messages', messageSchema);
