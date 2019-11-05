import Api from '@/service/api';

export default {
  register(credentials: any) {
    return Api().post('register', credentials);
  },
  login(credentials: any) {
    return Api().post('login', credentials);
  },
};
