import Api from '@/service/api';

export default {
  register(credentials: any) {
    return Api().post('admin/register', credentials);
  },
  login(credentials: any) {
    return Api().post('admin/login', credentials);
  },
  changePassword(credentials: any) {
    return Api().post('/settings/change-password/admin', credentials);
  },
};
