import Api from '@/service/api';

export default {
  saveMessages(data: any) {
    return Api().post('settings/messages', data);
  },
  getMessagesSettings(param: string) {
    return Api().get(`/settings/messages/${param}`);
  },
  getMessages(param: string) {
    return Api().get(`messages/${param}`);
  },
};
