import * as bookController from '../controllers/book';
import { middleware } from '../utils/middleware';

module.exports = (router: any) => {
  router.get(
    '/book/book-time/:service_id',
    bookController.getBookTime
  );

  router.get(
    '/book/breaks/:service_id',
    bookController.getBreaks
  );

  router.get(
    '/book/leaves/:service_id',
    bookController.getLeaves
  );

  router.post(
    '/settings/book',
    middleware.isAuthenticatedAsAdmin,
    bookController.postSaveBookTime
  );

  router.get(
    '/settings/book/:service_id',
    middleware.isAuthenticatedAsAdmin,
    bookController.getBookTime
  );

  router.post(
    '/settings/breaks',
    middleware.isAuthenticatedAsAdmin,
    bookController.postSaveBreaks
  );

  router.get(
    '/settings/breaks/:service_id',
    middleware.isAuthenticatedAsAdmin,
    bookController.getBreaks
  );

  router.post(
    '/settings/leaves',
    middleware.isAuthenticatedAsAdmin,
    bookController.postSaveLeaves
  );

  router.get(
    '/settings/leaves/:service_id',
    middleware.isAuthenticatedAsAdmin,
    bookController.getLeaves
  );
};
