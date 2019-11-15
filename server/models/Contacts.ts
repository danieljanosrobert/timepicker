import mongoose from 'mongoose';

export type ContactDocument = mongoose.Document & {
  user_email: string;
  name: string;
  phoneNumbers: [{number: string, comment: string}],
  emails: [{email: string, comment: string}],
  addresses: [{stateNumber: number, city: string, streetAndNumber: string}],
  image: string;
  image_id: string;
};

const contactSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  name: String,
  phoneNumbers: [{
    number: String,
    comment: String,
  }],
  emails: [{
    email: String,
    comment: String,
  }],
  addresses: [{
    stateNumber: Number,
    city: String,
    streetAndNumber: String,
  }],
  image: String,
  image_id: String,
});

export const Contact = mongoose.model<ContactDocument>('Contact', contactSchema);
