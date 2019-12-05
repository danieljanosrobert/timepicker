import mongoose from 'mongoose';

export type MessageDocument = mongoose.Document & {
  service_id: string;
  messages: [{
      title: string,
      sub: string,
      content: string,
    }];
};

const messageSchema = new mongoose.Schema({
  service_id: { type: String, required: true, unique: true },
  messages: [{
    title: String,
    sub: String,
    content: String,
  }],
}, { timestamps: true });

export const Messages = mongoose.model<MessageDocument>('Messages', messageSchema);
