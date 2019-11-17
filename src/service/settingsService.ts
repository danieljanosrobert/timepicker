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
  saveBook(data: any) {
    return Api().post('settings/book', data);
  },
  getBookSettings(data: any) {
    return Api().post('settings/get-book', data);
  },
  saveBreaks(data: any) {
    return Api().post('settings/breaks', data);
  },
  getBreakSettings(data: any) {
    return Api().post('settings/get-break', data);
  },
  saveLeaves(data: any) {
    return Api().post('settings/leaves', data);
  },
  getLeaveSettings(data: any) {
    return Api().post('settings/get-leave', data);
  },
  saveMessages(data: any) {
    return Api().post('settings/messages', data);
  },
  getMessages(data: any) {
    return Api().post('settings/get-messages', data);
  },
};

