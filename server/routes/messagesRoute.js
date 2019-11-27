"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var messageController = __importStar(require("../controllers/messages"));
var middleware_1 = require("../utils/middleware");
module.exports = function (router) {
    router.get('/messages/:service_id', messageController.getMessages);
    router.post('/settings/messages', middleware_1.middleware.isAuthenticatedAsAdmin, messageController.postSaveMessages);
    router.get('/settings/messages/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, messageController.getMessages);
};
