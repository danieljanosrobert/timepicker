import mongoose from 'mongoose';

export type FlagDocument = mongoose.Document & {
  user_email: string;
  service_id: string;
};

const flagSchema = new mongoose.Schema({
  user_email: String,
  service_id: String,
}, { timestamps: true });

export const Flag = mongoose.model<FlagDocument>('Flag', flagSchema);
