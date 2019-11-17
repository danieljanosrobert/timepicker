import mongoose from 'mongoose';

export type ServiceDocument = mongoose.Document & {
  user_email: string;
  service_id: string;
  name: string;
  description: string;
  image: string;
  image_id: string;
  hidden: boolean;
};

const serviceSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  service_id: String,
  name: String,
  description: String,
  image: String,
  image_id: String,
  hidden: Boolean,
});

export const Service = mongoose.model<ServiceDocument>('Service', serviceSchema);
