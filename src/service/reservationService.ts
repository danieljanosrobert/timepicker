import Api from '@/service/api';

export default {
  reserve(data: any) {
    return Api().post('/reserve', data);
  },
  getReservations(param: string) {
    return Api().get(`/reservations/${param}`);
  },
};
