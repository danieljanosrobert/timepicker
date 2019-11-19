import authenticationService from '../service/authenticationService';

export default async function({ next, store }: any) {
  try {
    await authenticationService.isAuthenticatedAsAdmin({
      user_email: store.state.loggedInUserEmail,
    });
  } catch {
    return next({
      name: 'home',
    });
  }
  if (!store.getters.adminAuth) {
    return next({
      name: 'home',
    });
  }

  return next();
}
