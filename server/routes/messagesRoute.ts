import * as messageController from '../controllers/messages';
import { middleware } from '../utils/middleware';

module.exports = (router: any) => {
  router.get(
    '/messages/:service_id',
    messageController.getMessages
  );

  router.post(
    '/settings/messages',
    middleware.isAuthenticatedAsAdmin,
    messageController.postSaveMessages
  );

  router.get(
    '/settings/messages/:service_id',
    middleware.isAuthenticatedAsAdmin,
    messageController.getMessages
  );
};
