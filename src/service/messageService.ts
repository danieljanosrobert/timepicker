import Api from '@/service/api';

export default {
  getMessages(param: string) {
    return Api().get(`messages/${param}`);
  },
};
