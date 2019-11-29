import * as serviceController from '../controllers/service';
import * as flagController from '../controllers/flag';
import { middleware } from '../utils/middleware';

module.exports = (router: any, upload: any) => {
  router.post(
    '/service/obtain-id',
    serviceController.postObtainServiceId,
  );

  router.get(
    '/available-services',
    serviceController.getAvailableServices,
  );

  router.get(
    '/serviceName/:service_id',
    serviceController.getServiceName,
  );

  router.post(
    '/settings/service',
    middleware.isAuthenticatedAsAdmin,
    upload.single('image'),
    serviceController.postUpdateService,
  );

  router.get(
    '/settings/service/:service_id',
    middleware.isAuthenticatedAsAdmin,
    serviceController.getServiceSettings,
  );

  router.post(
    '/flag',
    middleware.isAuthenticatedAsUser,
    flagController.postToggleFlagService,
  );

  router.get(
    '/flag/:user_email',
    middleware.isAuthenticatedAsUser,
    flagController.getUsersFlags,
  );
};
