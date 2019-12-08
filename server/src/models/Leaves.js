"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var leaveSchema = new mongoose_1.default.Schema({
    service_id: { type: String, required: true, unique: true },
    leaves: [{
            leaveInterval: [String, String],
            label: String,
        }],
});
exports.Leave = mongoose_1.default.model('Leave', leaveSchema);