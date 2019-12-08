import authenticationService from '../service/authenticationService';

export default async function({ next, store }: any) {
  try {
    await authenticationService.isAuthenticatedAsUser({
      user_email: store.state.loggedInUserEmail,
    });
  } catch {
    return next({
      name: 'home',
    });
  }
  if (!store.getters.userAuth) {
    return next({
      name: 'home',
    });
  }

  return next();
}
