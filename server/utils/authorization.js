"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http2_1 = require("http2");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.ADMIN = true;
var adminSecret = process.env.ADMIN_SECRET || 'adminsecretkey';
var secret = process.env.SECRET || 'secret';
function jwtSignUser(res, payload, status, admin) {
    if (status === void 0) { status = http2_1.constants.HTTP_STATUS_OK; }
    if (admin === void 0) { admin = false; }
    jsonwebtoken_1.default.sign(payload, admin ? adminSecret : secret, { expiresIn: '100h' }, function (err, token) {
        if (err) {
            res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Error signing token', raw: err });
        }
        res.status(status).json({ token: "Bearer " + token });
    });
}
exports.jwtSignUser = jwtSignUser;
