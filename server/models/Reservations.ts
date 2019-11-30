import mongoose from 'mongoose';

export type ReservationDocument = mongoose.Document & {
  service_id: string;
  email: string;
  lastName: string;
  firstName: string;
  city: string;
  comment: string;
  start: string;
  status: string;
};

const reservationSchema = new mongoose.Schema({
  service_id: String,
  email: String,
  lastName: String,
  firstName: String,
  city: String,
  comment: String,
  start: String,
  status: String,
}, { timestamps: true });

export const Reservation = mongoose.model<ReservationDocument>('Reservation', reservationSchema);
