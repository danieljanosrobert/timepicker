"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var contactController = __importStar(require("../controllers/contact"));
var middleware_1 = require("../utils/middleware");
module.exports = function (router, upload) {
    router.get('/contact/:service_id', contactController.getContact);
    router.post('/settings/contact', middleware_1.middleware.isAuthenticatedAsAdmin, upload.single('image'), contactController.postSaveContact);
    router.get('/settings/contact/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, contactController.getContact);
};
