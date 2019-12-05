"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bookController = __importStar(require("../controllers/book"));
var middleware_1 = require("../utils/middleware");
module.exports = function (router) {
    router.get('/book/book-time/:service_id', bookController.getBookTime);
    router.get('/book/breaks/:service_id', bookController.getBreaks);
    router.get('/book/leaves/:service_id', bookController.getLeaves);
    router.post('/settings/book', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.postSaveBookTime);
    router.get('/settings/book/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.getBookTime);
    router.post('/settings/breaks', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.postSaveBreaks);
    router.get('/settings/breaks/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.getBreaks);
    router.post('/settings/leaves', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.postSaveLeaves);
    router.get('/settings/leaves/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.getLeaves);
};
