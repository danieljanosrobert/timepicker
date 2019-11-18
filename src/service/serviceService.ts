import Api from '@/service/api';

export default {
  saveService(data: any) {
    return Api().post('settings/service', data);
  },
  getServiceSettings(param: string) {
    return Api().get(`/settings/service/${param}`);
  },
  getAvailableServices() {
    return Api().get('available-services');
  },
  getServiceName(param: string) {
    return Api().get(`serviceName/${param}`);
  },
  postObtainServiceId(data: any) {
    return Api().post('service/obtain-id', data);
  },
};
