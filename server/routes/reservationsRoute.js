"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var reservationController = __importStar(require("../controllers/reservation"));
var middleware_1 = require("../utils/middleware");
module.exports = function (router) {
    router.post('/reserve', reservationController.postReserve);
    router.post('/reservations', reservationController.postGetReservations);
    router.get('/my-reservations/:user_email', middleware_1.middleware.isAuthenticatedAsUser, reservationController.getUsersReservations);
    router.get('/activate/:service_id/:start', reservationController.activateReservation);
    router.get('/resign-by-email/:service_id/:start/:email', reservationController.resignByEmail);
    router.post('/reservations/resign', reservationController.postResignReservation);
    router.post('/reservations/accept', middleware_1.middleware.isAuthenticatedAsAdmin, reservationController.postAcceptReservation);
    router.post('/reservations/delete', middleware_1.middleware.isAuthenticatedAsAdmin, reservationController.postDeleteReservation);
};
