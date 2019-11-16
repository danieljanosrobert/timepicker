import Api from '@/service/api';

export default {
  isAuthenticatedAsAdmin(email: any) {
    return Api().post('admin/auth', email);
  },
};
