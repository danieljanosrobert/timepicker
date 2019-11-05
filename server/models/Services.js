"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var serviceSchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true },
    description: String,
});
exports.Service = mongoose_1.default.model('Service', serviceSchema);
