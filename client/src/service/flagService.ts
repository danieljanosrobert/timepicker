import Api from '@/service/api';

export default {
  toggleFlagService(data: any) {
    return Api().post('/flag', data);
  },
  getUsersFlags(param: any) {
    return Api().get(`/flag/${param}`);
  },
};
