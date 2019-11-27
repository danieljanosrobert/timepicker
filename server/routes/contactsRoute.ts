import * as contactController from '../controllers/contact';
import { middleware } from '../utils/middleware';

module.exports = (router: any, upload: any) => {
  router.get(
    '/contact/:service_id',
    contactController.getContact
  );

  router.post(
    '/settings/contact',
    middleware.isAuthenticatedAsAdmin,
    upload.single('image'),
    contactController.postSaveContact
  );

  router.get(
    '/settings/contact/:service_id',
    middleware.isAuthenticatedAsAdmin,
    contactController.getContact
  );
};
