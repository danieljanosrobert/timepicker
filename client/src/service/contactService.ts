import Api from '@/service/api';

export default {
  saveContact(data: any) {
    return Api().post('settings/contact', data);
  },
  getContactSettings(param: string) {
    return Api().get(`/settings/contact/${param}`);
  },
  getContact(param: string) {
    return Api().get(`contact/${param}`);
  },
};
