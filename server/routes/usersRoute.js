"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var userController = __importStar(require("../controllers/user"));
var adminUserController = __importStar(require("../controllers/adminUser"));
var validator = __importStar(require("../utils/validators"));
var middleware_1 = require("../utils/middleware");
var http2_1 = require("http2");
module.exports = function (router) {
    router.post('/user/auth', middleware_1.middleware.isAuthenticatedAsUser, function (req, res) { return res.sendStatus(http2_1.constants.HTTP_STATUS_OK); });
    router.post('/admin/auth', middleware_1.middleware.isAuthenticatedAsAdmin, function (req, res) { return res.sendStatus(http2_1.constants.HTTP_STATUS_OK); });
    router.post('/login', validator.credentialValidator, userController.postLogin);
    router.post('/register', validator.registerValidator, userController.postRegister);
    router.post('/admin/login', validator.credentialValidator, adminUserController.postLogin);
    router.post('/admin/register', validator.registerValidator, adminUserController.postRegister);
    router.post('/settings/change-password', middleware_1.middleware.isAuthenticatedAsUser, validator.passwordChangeValidator, userController.postChangePassword);
    router.post('/settings/get-user-data', middleware_1.middleware.isAuthenticatedAsUser, userController.postGetUserData);
    router.post('/settings/modify-user', middleware_1.middleware.isAuthenticatedAsUser, userController.updateUserData);
    router.post('/settings/change-password/admin', middleware_1.middleware.isAuthenticatedAsAdmin, validator.passwordChangeValidator, adminUserController.postChangePassword);
};
