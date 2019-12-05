"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var serviceController = __importStar(require("../controllers/service"));
var flagController = __importStar(require("../controllers/flag"));
var middleware_1 = require("../utils/middleware");
module.exports = function (router, upload) {
    router.post('/service/obtain-id', serviceController.postObtainServiceId);
    router.get('/available-services', serviceController.getAvailableServices);
    router.get('/serviceName/:service_id', serviceController.getServiceName);
    router.post('/settings/service', middleware_1.middleware.isAuthenticatedAsAdmin, upload.single('image'), serviceController.postUpdateService);
    router.get('/settings/service/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, serviceController.getServiceSettings);
    router.post('/flag', middleware_1.middleware.isAuthenticatedAsUser, flagController.postToggleFlagService);
    router.get('/flag/:user_email', middleware_1.middleware.isAuthenticatedAsUser, flagController.getUsersFlags);
};
