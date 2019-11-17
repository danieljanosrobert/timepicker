import Api from '@/service/api';

export default {
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
