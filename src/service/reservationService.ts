import Api from '@/service/api';

export default {
  reserve(data: any) {
    return Api().post('/reserve', data);
  },
  getReservations(data: any) {
    return Api().post(`/reservations`, data);
  },
  acceptReservation(data: any) {
    return Api().post(`/reservations/accept`, data);
  },
  resignReservation(data: any) {
    return Api().post(`/reservations/resign`, data);
  },
  deleteReservation(data: any) {
    return Api().post(`/reservations/delete`, data);
  },
};
