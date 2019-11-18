import Api from '@/service/api';

export default {
  saveBook(data: any) {
    return Api().post('settings/book', data);
  },
  getBookSettings(param: string) {
    return Api().get(`/settings/book/${param}`);
  },
  saveBreaks(data: any) {
    return Api().post('settings/breaks', data);
  },
  getBreakSettings(param: string) {
    return Api().get(`/settings/breaks/${param}`);
  },
  saveLeaves(data: any) {
    return Api().post('settings/leaves', data);
  },
  getLeaveSettings(param: string) {
    return Api().get(`/settings/leaves/${param}`);
  },
  getBooktimes(param: string) {
    return Api().get(`book/book-times/${param}`);
  },
  getBreaks(param: string) {
    return Api().get(`book/breaks/${param}`);
  },
  getLeaves(param: string) {
    return Api().get(`book/leaves${param}`);
  },
};
