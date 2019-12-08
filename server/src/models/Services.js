"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var serviceSchema = new mongoose_1.default.Schema({
    user_email: { type: String, required: true, unique: true },
    service_id: String,
    name: String,
    description: String,
    image: String,
    image_id: String,
    hidden: Boolean,
});
exports.Service = mongoose_1.default.model('Service', serviceSchema);