"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http2_1 = require("http2");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var secret = process.env.SECRET || 'secret';
function jwtSignUser(res, payload, status) {
    if (status === void 0) { status = http2_1.constants.HTTP_STATUS_OK; }
    jsonwebtoken_1.default.sign(payload, secret, { expiresIn: 600 }, function (err, token) {
        if (err) {
            res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Error signing token', raw: err });
        }
        res.status(status).json({ token: "Bearer " + token });
    });
}
exports.jwtSignUser = jwtSignUser;
