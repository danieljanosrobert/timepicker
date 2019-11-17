import mongoose from 'mongoose';

export type MessageDocument = mongoose.Document & {
  user_email: string;
  messages: [{
      title: string,
      sub: string,
      content: string,
    }];
};

const messageSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  messages: [{
    title: String,
    sub: String,
    content: String,
  }],
}, { timestamps: true });

export const Messages = mongoose.model<MessageDocument>('Messages', messageSchema);
