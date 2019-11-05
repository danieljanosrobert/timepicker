import mongoose from 'mongoose';

export type ServiceDocument = mongoose.Document & {
  name: string;
  description: string;
};

const serviceSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
});

export const Service = mongoose.model<ServiceDocument>('Service', serviceSchema);
