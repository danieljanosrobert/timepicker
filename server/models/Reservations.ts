import mongoose from 'mongoose';

export type ReservationDocument = mongoose.Document & {
  service_id: string;
  email: string;
  lastName: string;
  firstName: string;
  city: string;
  age: string;
  comment: string;
  start: string;
  end: string;
};

const reservationSchema = new mongoose.Schema({
  service_id: String,
  email: String,
  lastName: String,
  firstName: String,
  city: String,
  age: String,
  comment: String,
  start: String,
}, { timestamps: true });

export const Reservation = mongoose.model<ReservationDocument>('Reservation', reservationSchema);
