import authenticationService from '../service/authenticationService';

export default async function({ next, store }: any) {
  try {
    await authenticationService.isAuthenticatedAsAdmin({
      user_email: store.state.loggedInUserEmail,
    });
  } catch (e) {
    store.dispatch('adminLogout');
    store.dispatch('logout');
  }
  if (!store.getters.auth) {
    return next({
      name: 'home',
    });
  }

  return next();
}
