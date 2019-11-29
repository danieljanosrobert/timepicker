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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var image_1 = require("../utils/image");
var http2_1 = require("http2");
var Services_1 = require("../models/Services");
var AdminUsers_1 = require("../models/AdminUsers");
var bcrypt_1 = __importDefault(require("bcrypt"));
var js_base64_1 = require("js-base64");
/**
 * POST /service/obtain-id
 * Returns the AdminUser's Service's service_id
 */
exports.postObtainServiceId = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        Services_1.Service.findOne({ user_email: req.body.user_email })
            .then(function (dbService) {
            if (!dbService) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                });
            }
            var result = {
                service_id: js_base64_1.Base64.encode(dbService.service_id),
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
/**
 * GET /serviceName/:service_id
 * Returns name of Service with given service_id
 */
exports.getServiceName = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = js_base64_1.Base64.decode(req.params.service_id);
        Services_1.Service.findOne({ service_id: serviceId })
            .then(function (dbService) {
            if (!dbService) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                });
            }
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(dbService.name);
        });
        return [2 /*return*/];
    });
}); };
/**
 * GET /available-services
 * Returns array of Services where hidden is false
 */
exports.getAvailableServices = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        Services_1.Service.find({ hidden: false }, 'service_id name image description')
            .then(function (dbServices) {
            if (!dbServices) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Services not found',
                });
            }
            dbServices.forEach(function (service) {
                service.service_id = js_base64_1.Base64.encode(service.service_id);
            });
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(JSON.stringify(dbServices));
        });
        return [2 /*return*/];
    });
}); };
/**
 * GET /settings/service/:service_id
 * Returns the search setting details of Service with given service_id
 */
exports.getServiceSettings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = js_base64_1.Base64.decode(req.params.service_id);
        Services_1.Service.findOne({ service_id: serviceId })
            .then(function (dbService) {
            if (!dbService) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Service not found',
                });
            }
            var result = {
                name: dbService.name,
                image_url: dbService.image,
                description: dbService.description,
                hidden: dbService.hidden,
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
/**
 * Creates a service on AdminUser creation.
 * @param service_id string of generated UUID that joins AdminUser with Service
 */
exports.saveService = function (req, res, next, serviceId) { return __awaiter(void 0, void 0, void 0, function () {
    var service;
    return __generator(this, function (_a) {
        service = new Services_1.Service({
            user_email: req.body.email,
            service_id: serviceId,
            name: req.body.serviceName,
            description: '',
            hidden: true,
        });
        service.save(function (saveError) {
            if (saveError) {
                return next(saveError);
            }
            next();
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /settings/service
 * Updates Service
 */
exports.postUpdateService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        AdminUsers_1.AdminUser.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                    error: 'User does not exist',
                });
            }
            bcrypt_1.default.compare(req.body.password, dbUser.password)
                .then(function (isMatch) { return __awaiter(void 0, void 0, void 0, function () {
                var image, imageId_1, deleteImage, service, serviceAsObject;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!isMatch) return [3 /*break*/, 3];
                            image = null;
                            deleteImage = req.body.deleteImage === 'true';
                            if (!req.file) return [3 /*break*/, 2];
                            return [4 /*yield*/, tryUploadImage(req, res, next)];
                        case 1:
                            image = _a.sent();
                            _a.label = 2;
                        case 2:
                            service = new Services_1.Service({
                                user_email: req.body.user_email,
                                name: req.body.name,
                                description: req.body.description,
                                image: image && image.url ? image.url : null,
                                image_id: image && image.public_id ? image.public_id : null,
                                hidden: req.body.hidden,
                            });
                            serviceAsObject = service.toObject();
                            delete serviceAsObject._id;
                            if (!req.file && !deleteImage) {
                                delete serviceAsObject.image;
                                delete serviceAsObject.image_id;
                            }
                            else {
                                Services_1.Service.findOne({ user_email: service.user_email })
                                    .then(function (dbService) {
                                    if (dbService) {
                                        imageId_1 = dbService.image_id;
                                    }
                                });
                            }
                            Services_1.Service.findOneAndUpdate({ user_email: service.user_email }, serviceAsObject, { upsert: true }, function (updateError, no) {
                                if (updateError) {
                                    if (imageId_1) {
                                        image_1.destroyImage(imageId_1);
                                    }
                                    return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                        error: 'Error occured during updating service.',
                                    });
                                }
                                if (imageId_1) {
                                    image_1.destroyImage(imageId_1);
                                }
                                return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                            });
                            return [3 /*break*/, 4];
                        case 3: return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                                error: 'Incorrect password',
                            })];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
        return [2 /*return*/];
    });
}); };
function tryUploadImage(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, image_1.uploadImage('services', req, res, next)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                        error: 'An error occured during the upload.',
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
