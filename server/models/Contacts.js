"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var contactSchema = new mongoose_1.default.Schema({
    service_id: { type: String, required: true, unique: true },
    name: String,
    phoneNumbers: [{
            number: String,
            comment: String,
        }],
    emails: [{
            email: String,
            comment: String,
        }],
    addresses: [{
            stateNumber: Number,
            city: String,
            streetAndNumber: String,
        }],
    image: String,
    image_id: String,
});
exports.Contact = mongoose_1.default.model('Contact', contactSchema);
