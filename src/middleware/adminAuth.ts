export default function({ next, store }: any) {
  if (!store.getters.auth) {
    return next({
      name: 'home',
    });
  }

  return next();
}
