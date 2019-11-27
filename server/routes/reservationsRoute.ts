import * as reservationController from '../controllers/reservation';
import { middleware } from '../utils/middleware';

module.exports = (router: any) => {
  router.post(
    '/reserve',
    reservationController.postReserve
  );

  router.post(
    '/reservations',
    reservationController.postGetReservations
  );

  router.get(
    '/my-reservations/:user_email',
    middleware.isAuthenticatedAsUser,
    reservationController.getUsersReservations
  );

  router.get(
    '/activate/:service_id/:start',
    reservationController.activateReservation
  );

  router.get(
    '/resign-by-email/:service_id/:start/:email',
    reservationController.resignByEmail
  )

  router.post(
    '/reservations/resign',
    reservationController.postResignReservation
  );

  router.post(
    '/reservations/accept',
    middleware.isAuthenticatedAsAdmin,
    reservationController.postAcceptReservation
  );

  router.post(
    '/reservations/delete',
    middleware.isAuthenticatedAsAdmin,
    reservationController.postDeleteReservation
  );
};
