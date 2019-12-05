"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http2_1 = require("http2");
var Flags_1 = require("../models/Flags");
var js_base64_1 = require("js-base64");
var Services_1 = require("../models/Services");
var _ = __importStar(require("lodash"));
/**
 * GET /flag/:user_email
 * Returns User's flagged Services
 */
exports.getUsersFlags = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userEmail;
    return __generator(this, function (_a) {
        userEmail = js_base64_1.Base64.decode(req.params.user_email);
        Flags_1.Flag.find({ user_email: userEmail }, 'service_id', { sort: 'createdAt' })
            .then(function (dbFlags) {
            if (dbFlags) {
                var serviceIds = _.map(dbFlags, 'service_id');
                Services_1.Service.find({ service_id: { $in: serviceIds }, hidden: false }, '-_id')
                    .then(function (dbService) {
                    if (dbService) {
                        _.map(dbService, function (service) { return service.service_id = js_base64_1.Base64.encode(service.service_id); });
                        return res.status(http2_1.constants.HTTP_STATUS_OK).send(dbService);
                    }
                });
            }
            else {
                return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
            }
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /flag
 * Saves or deletes a Flag to given Service for User
 */
exports.postToggleFlagService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = js_base64_1.Base64.decode(req.body.service_id);
        Services_1.Service.findOne({ service_id: serviceId })
            .then(function (dbService) {
            if (!dbService) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                });
            }
            var flag = new Flags_1.Flag({
                user_email: req.body.user_email,
                service_id: serviceId,
            });
            Flags_1.Flag.findOne({ user_email: flag.user_email, service_id: serviceId })
                .then(function (dbFlag) {
                if (dbFlag) {
                    dbFlag.remove(function (err) {
                        if (err) {
                            return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                error: 'Error occured during trying to remove flag',
                            });
                        }
                    });
                    return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                }
                flag.save(function (saveError) {
                    if (saveError) {
                        return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                            error: 'Error occured during save',
                        });
                    }
                });
                res.sendStatus(http2_1.constants.HTTP_STATUS_CREATED);
            });
        });
        return [2 /*return*/];
    });
}); };
