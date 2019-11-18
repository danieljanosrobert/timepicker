"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var breakSchema = new mongoose_1.default.Schema({
    service_id: { type: String, required: true, unique: true },
    breaks: [{
            date: String,
            startTime: String,
            duration: Number,
            always: Boolean,
        }],
});
exports.Break = mongoose_1.default.model('Break', breakSchema);
