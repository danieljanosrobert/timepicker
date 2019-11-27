import * as userController from '../controllers/user';
import * as adminUserController from '../controllers/adminUser';
import * as validator from '../utils/validators';
import { middleware } from '../utils/middleware';
import {constants} from 'http2';

module.exports = (router: any) => {

  router.post(
    '/user/auth',
    middleware.isAuthenticatedAsUser,
    (req: any, res: any) => res.sendStatus(constants.HTTP_STATUS_OK)
  );

  router.post(
    '/admin/auth',
    middleware.isAuthenticatedAsAdmin,
    (req: any, res: any) => res.sendStatus(constants.HTTP_STATUS_OK)
  );

  router.post(
    '/login',
    validator.credentialValidator,
    userController.postLogin
  );

  router.post(
    '/register',
    validator.registerValidator,
    userController.postRegister
  );

  router.post(
    '/admin/login',
    validator.credentialValidator,
    adminUserController.postLogin
  );

  router.post(
    '/admin/register',
    validator.registerValidator,
    adminUserController.postRegister
  );

  router.post(
    '/settings/change-password',
    middleware.isAuthenticatedAsUser,
    validator.passwordChangeValidator,
    userController.postChangePassword
  );

  router.post(
    '/settings/get-user-data',
    middleware.isAuthenticatedAsUser,
    userController.postGetUserData
  );

  router.post(
    '/settings/modify-user',
    middleware.isAuthenticatedAsUser,
    userController.updateUserData
  );

  router.post(
    '/settings/change-password/admin',
    middleware.isAuthenticatedAsAdmin,
    validator.passwordChangeValidator,
    adminUserController.postChangePassword
  );
};
