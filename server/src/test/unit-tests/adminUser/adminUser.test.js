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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unused-expression
var chai_1 = __importDefault(require("chai"));
var mock_req_res_1 = require("mock-req-res");
var sinon_1 = __importDefault(require("sinon"));
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var testedController = __importStar(require("../../../controllers/adminUser"));
var http2_1 = require("http2");
var AdminUsers_1 = require("../../../models/AdminUsers");
var mongodb_1 = require("mongodb");
var serviceController = __importStar(require("../../../controllers/service"));
var contactController = __importStar(require("../../../controllers/contact"));
var messageController = __importStar(require("../../../controllers/messages"));
var authorization = __importStar(require("../../../utils/authorization"));
require('sinon-mongoose');
chai_1.default.use(sinon_chai_1.default);
var expect = chai_1.default.expect;
var EMAIL = 'e@mail.com';
var PASSWORD = 'P4ssW0rd';
var SERVICENAME = 'serviceName';
var NAME = 'Test Name';
describe('AdminUsers Controller', function () {
    describe('register AdminUser', function () {
        var _this = this;
        this.beforeAll(function () {
            sinon_1.default.spy(serviceController, 'saveService');
            sinon_1.default.spy(contactController, 'saveContact');
            sinon_1.default.spy(messageController, 'createMessage');
            sinon_1.default.spy(authorization, 'jwtSignUser');
        });
        beforeEach(function () {
            sinon_1.default.stub(AdminUsers_1.AdminUser, 'findOne');
        });
        afterEach(function () {
            AdminUsers_1.AdminUser.findOne.restore();
        });
        it('should return error when field is missing', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, next, res;
            return __generator(this, function (_a) {
                req = mock_req_res_1.mockRequest({
                    body: {
                        email: EMAIL,
                        password: PASSWORD,
                        serviceName: SERVICENAME,
                    },
                });
                next = sinon_1.default.spy();
                res = mock_req_res_1.mockResponse();
                testedController.postRegister(req, res, next);
                expect(res.status).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_BAD_REQUEST);
                expect(res.send).to.have.been.calledWith({
                    error: 'Invalid fields',
                });
                expect(next).to.not.have.been.called;
                expect(serviceController.saveService).to.not.have.been.called;
                expect(contactController.saveContact).to.not.have.been.called;
                expect(messageController.createMessage).to.not.have.been.called;
                expect(authorization.jwtSignUser).to.not.have.been.called;
                return [2 /*return*/];
            });
        }); });
        it('should return error when two fields are missing', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res, next;
            return __generator(this, function (_a) {
                req = mock_req_res_1.mockRequest({
                    body: {
                        email: EMAIL,
                        password: PASSWORD,
                    },
                });
                res = mock_req_res_1.mockResponse();
                next = sinon_1.default.spy();
                testedController.postRegister(req, res, next);
                expect(res.status).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_BAD_REQUEST);
                expect(res.send).to.have.been.calledWith({
                    error: 'Invalid fields',
                });
                expect(next).to.not.have.been.called;
                expect(serviceController.saveService).to.not.have.been.called;
                expect(contactController.saveContact).to.not.have.been.called;
                expect(messageController.createMessage).to.not.have.been.called;
                expect(authorization.jwtSignUser).to.not.have.been.called;
                return [2 /*return*/];
            });
        }); });
        it('should return error when fields are falsy', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res, next;
            return __generator(this, function (_a) {
                req = mock_req_res_1.mockRequest({
                    body: {
                        email: EMAIL,
                        password: PASSWORD,
                        serviceName: '',
                        name: '',
                    },
                });
                res = mock_req_res_1.mockResponse();
                next = sinon_1.default.spy();
                testedController.postRegister(req, res, next);
                expect(res.status).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_BAD_REQUEST);
                expect(res.send).to.have.been.calledWith({
                    error: 'Invalid fields',
                });
                expect(next).to.not.have.been.called;
                expect(serviceController.saveService).to.not.have.been.called;
                expect(contactController.saveContact).to.not.have.been.called;
                expect(messageController.createMessage).to.not.have.been.called;
                expect(authorization.jwtSignUser).to.not.have.been.called;
                return [2 /*return*/];
            });
        }); });
        it('should return error when AdminUser already exists', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest({
                            body: {
                                email: EMAIL,
                                password: PASSWORD,
                                serviceName: SERVICENAME,
                                name: NAME,
                            },
                        });
                        res = mock_req_res_1.mockResponse();
                        next = sinon_1.default.spy();
                        AdminUsers_1.AdminUser.findOne.yields(null, { email: EMAIL });
                        return [4 /*yield*/, testedController.postRegister(req, res, next)];
                    case 1:
                        _a.sent();
                        expect(res.status).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_CONFLICT);
                        expect(res.send).to.have.been.calledWith({
                            error: 'Account with that email address already exists.',
                        });
                        expect(authorization.jwtSignUser).to.not.have.been.called;
                        expect(next).to.not.have.been.called;
                        expect(serviceController.saveService).to.not.have.been.called;
                        expect(contactController.saveContact).to.not.have.been.called;
                        expect(messageController.createMessage).to.not.have.been.called;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return error when findOne throws any error', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest({
                            body: {
                                email: EMAIL,
                                password: PASSWORD,
                                serviceName: SERVICENAME,
                                name: NAME,
                            },
                        });
                        res = mock_req_res_1.mockResponse();
                        next = sinon_1.default.spy();
                        AdminUsers_1.AdminUser.findOne.yields(mongodb_1.MongoError, { email: EMAIL });
                        return [4 /*yield*/, testedController.postRegister(req, res, next)];
                    case 1:
                        _a.sent();
                        expect(next).to.have.been.called;
                        expect(serviceController.saveService).to.not.have.been.called;
                        expect(contactController.saveContact).to.not.have.been.called;
                        expect(messageController.createMessage).to.not.have.been.called;
                        expect(authorization.jwtSignUser).to.not.have.been.called;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return error when save throws any error', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest({
                            body: {
                                email: EMAIL,
                                password: PASSWORD,
                                serviceName: SERVICENAME,
                                name: NAME,
                            },
                        });
                        res = mock_req_res_1.mockResponse();
                        next = sinon_1.default.spy();
                        sinon_1.default.stub(AdminUsers_1.AdminUser.prototype, 'save');
                        AdminUsers_1.AdminUser.findOne.yields(null);
                        AdminUsers_1.AdminUser.prototype.save.yields(mongodb_1.MongoError);
                        return [4 /*yield*/, testedController.postRegister(req, res, next)];
                    case 1:
                        _a.sent();
                        expect(next).to.have.been.called;
                        expect(serviceController.saveService).to.not.have.been.called;
                        expect(contactController.saveContact).to.not.have.been.called;
                        expect(messageController.createMessage).to.not.have.been.called;
                        expect(authorization.jwtSignUser).to.not.have.been.called;
                        AdminUsers_1.AdminUser.prototype.save.restore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should proceed to create AdminUser', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest({
                            body: {
                                email: EMAIL,
                                password: PASSWORD,
                                serviceName: SERVICENAME,
                                name: NAME,
                            },
                        });
                        res = mock_req_res_1.mockResponse();
                        next = sinon_1.default.spy();
                        sinon_1.default.stub(AdminUsers_1.AdminUser.prototype, 'save');
                        AdminUsers_1.AdminUser.findOne.yields(null);
                        AdminUsers_1.AdminUser.prototype.save.yields(null);
                        return [4 /*yield*/, testedController.postRegister(req, res, next)];
                    case 1:
                        _a.sent();
                        expect(next).to.not.have.been.called;
                        expect(serviceController.saveService).to.have.been.called;
                        expect(contactController.saveContact).to.have.been.called;
                        expect(messageController.createMessage).to.have.been.called;
                        expect(authorization.jwtSignUser).to.have.been.called;
                        AdminUsers_1.AdminUser.prototype.save.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('authenticate AdminUser', function () {
        var _this = this;
        it('should return HTTP status OK if function is called', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest();
                        res = mock_req_res_1.mockResponse();
                        return [4 /*yield*/, testedController.auth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.sendStatus).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_OK);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('login AdminUser', function () {
        var _this = this;
        beforeEach(function () {
            sinon_1.default.stub(AdminUsers_1.AdminUser, 'findOne');
        });
        afterEach(function () {
            AdminUsers_1.AdminUser.findOne.restore();
        });
        it('should return error when AdminUser is not existing with given email', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest({
                            body: {
                                email: EMAIL,
                                password: PASSWORD,
                            },
                        });
                        res = mock_req_res_1.mockResponse();
                        return [4 /*yield*/, testedController.postLogin(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_BAD_REQUEST);
                        expect(res.send).to.have.been.calledWith({
                            error: 'Incorrect email or password.',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return error when AdminUser is not existing with given email', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
    });
    describe('change AdminUser password', function () {
        var _this = this;
        it('should return HTTP status OK if function is called', function () { return __awaiter(_this, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = mock_req_res_1.mockRequest();
                        res = mock_req_res_1.mockResponse();
                        return [4 /*yield*/, testedController.auth(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).to.have.been.calledWith(http2_1.constants.HTTP_STATUS_OK);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
