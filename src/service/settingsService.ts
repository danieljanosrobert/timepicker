import Api from '@/service/api';

export default {
  saveService(data: any) {
    return Api().post('settings/service', data);
  },
  getServiceSettings(data: any) {
    return Api().post('settings/get-service', data);
  },
  saveContact(data: any) {
    return Api().post('settings/contact', data);
  },
  getContactSettings(data: any) {
    return Api().post('settings/get-contact', data);
  },
};

