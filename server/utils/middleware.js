"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http2_1 = require("http2");
var _ = __importStar(require("lodash"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var adminSecret = process.env.ADMIN_SECRET || 'secret';
var Middleware = /** @class */ (function () {
    function Middleware() {
    }
    Middleware.log = function (req, res, next) {
        console.log('');
        console.log("Recived a " + req.method + " request from " + req.ip + " for " + req.url);
        if (!_.isEmpty(req.headers.authorization)) {
            console.log("authorization: " + JSON.stringify(req.headers.authorization));
        }
        if (!_.isEmpty(req.body)) {
            console.log("body: " + JSON.stringify(req.body));
        }
        if (!_.isEmpty(req.params)) {
            console.log("params: " + JSON.stringify(req.params));
        }
        if (!_.isEmpty(req.query)) {
            console.log("query: " + JSON.stringify(req.query));
        }
        next();
    };
    Middleware.isAuthenticated = function (req, res, next) {
        var header = req.headers.authorization;
        if (!_.isEmpty(header)) {
            var token = header.split(' ')[1];
            jsonwebtoken_1.default.verify(token, adminSecret, function (err, authData) {
                if (err) {
                    res.sendStatus(http2_1.constants.HTTP_STATUS_UNAUTHORIZED);
                }
                else {
                    next();
                }
            });
        }
        else {
            res.sendStatus(http2_1.constants.HTTP_STATUS_UNAUTHORIZED);
        }
    };
    return Middleware;
}());
exports.middleware = Middleware;
