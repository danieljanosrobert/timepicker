import Api from '@/service/api';

export default {
  register(credentials: any) {
    return Api().post('register', credentials);
  },
  login(credentials: any) {
    return Api().post('login', credentials);
  },
  changePassword(credentials: any) {
    return Api().post('/settings/change-password', credentials);
  },
  fetchUserData(credentials: any) {
    return Api().post('/settings/get-user-data', credentials);
  },
  modifyUser(credentials: any) {
    return Api().post('/settings/modify-user', credentials);
  },
};
