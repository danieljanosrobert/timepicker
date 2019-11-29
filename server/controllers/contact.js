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
var AdminUsers_1 = require("../models/AdminUsers");
var http2_1 = require("http2");
var bcrypt_1 = __importDefault(require("bcrypt"));
var Contacts_1 = require("../models/Contacts");
var image_1 = require("../utils/image");
var js_base64_1 = require("js-base64");
var Services_1 = require("../models/Services");
/**
 * GET /contact/:service_id
 * GET /settings/contact/:service_id
 * Returns the contact info of Service with given service_id
 */
exports.getContact = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceId;
    return __generator(this, function (_a) {
        serviceId = js_base64_1.Base64.decode(req.params.service_id);
        Contacts_1.Contact.findOne({ service_id: serviceId })
            .then(function (dbContact) {
            if (!dbContact) {
                return res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                    error: 'Contact not found',
                });
            }
            var result = {
                name: dbContact.name,
                image_url: dbContact.image,
                phoneNumbers: dbContact.phoneNumbers,
                emails: dbContact.emails,
                addresses: dbContact.addresses,
            };
            return res.status(http2_1.constants.HTTP_STATUS_OK).send(result);
        });
        return [2 /*return*/];
    });
}); };
/**
 * Creates contact info on AdminUser creation.
 * @param serviceId string of generated UUID that joins AdminUser with Service
 */
exports.saveContact = function (req, res, next, serviceId) { return __awaiter(void 0, void 0, void 0, function () {
    var contact;
    return __generator(this, function (_a) {
        contact = new Contacts_1.Contact({
            service_id: serviceId,
            name: req.body.name,
            phoneNumbers: [],
            emails: [],
            addresses: [],
        });
        contact.save(function (saveError) {
            if (saveError) {
                next(saveError);
            }
            next();
        });
        return [2 /*return*/];
    });
}); };
/**
 * POST /settings/contact
 * Updates Service's contact info.
 */
exports.postSaveContact = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        AdminUsers_1.AdminUser.findOne({ email: req.body.user_email })
            .then(function (dbUser) {
            if (!dbUser) {
                return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                    error: 'User does not exist',
                });
            }
            bcrypt_1.default.compare(req.body.password, dbUser.password)
                .then(function (isMatch) {
                if (isMatch) {
                    Services_1.Service.findOne({ user_email: req.body.user_email }, 'service_id')
                        .then(function (dbService) { return __awaiter(void 0, void 0, void 0, function () {
                        var image, imageId, deleteImage, contact, contactAsObject;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!dbService) {
                                        return [2 /*return*/, res.status(http2_1.constants.HTTP_STATUS_NOT_FOUND).send({
                                                error: 'Service not found',
                                            })];
                                    }
                                    image = null;
                                    deleteImage = req.body.deleteImage === 'true';
                                    if (!req.file) return [3 /*break*/, 2];
                                    return [4 /*yield*/, tryUploadImage(req, res, next)];
                                case 1:
                                    image = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    contact = new Contacts_1.Contact({
                                        service_id: dbService.service_id,
                                        name: req.body.name,
                                        phoneNumbers: JSON.parse(req.body.phoneNumbers),
                                        emails: JSON.parse(req.body.emails),
                                        addresses: JSON.parse(req.body.addresses),
                                        image: image && image.url ? image.url : null,
                                        image_id: image && image.public_id ? image.public_id : null,
                                    });
                                    contactAsObject = contact.toObject();
                                    delete contactAsObject._id;
                                    if (!req.file && !deleteImage) {
                                        delete contactAsObject.image;
                                        delete contactAsObject.image_id;
                                    }
                                    else {
                                        Contacts_1.Contact.findOne({ service_id: contact.service_id })
                                            .then(function (dbContact) {
                                            if (dbContact) {
                                                imageId = dbContact.image_id;
                                            }
                                        });
                                    }
                                    Contacts_1.Contact.findOneAndUpdate({ service_id: contact.service_id }, contactAsObject, { upsert: true }, function (updateError, no) {
                                        if (updateError) {
                                            if (imageId) {
                                                image_1.destroyImage(imageId);
                                            }
                                            console.log(updateError);
                                            return res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
                                                error: 'Error occured during updating contact.',
                                            });
                                        }
                                        if (imageId) {
                                            image_1.destroyImage(imageId);
                                        }
                                        return res.sendStatus(http2_1.constants.HTTP_STATUS_OK);
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    return res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).send({
                        error: 'Incorrect password',
                    });
                }
            });
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
                    return [4 /*yield*/, image_1.uploadImage('contacts', req, res, next)];
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
