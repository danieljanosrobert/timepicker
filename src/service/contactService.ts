import Api from '@/service/api';

export default {
  getContact(param: string) {
    return Api().get(`contact/${param}`);
  },
};
