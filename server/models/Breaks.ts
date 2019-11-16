import mongoose from 'mongoose';

export type BreakDocument = mongoose.Document & {
  user_email: string;
  breaks: [{
      date: string,
      startTime: string,
      duration: number,
      always: boolean,
    }];
};

const breakSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  breaks: [{
    date: String,
    startTime: String,
    duration: Number,
    always: Boolean,
  }],
});

export const Break = mongoose.model<BreakDocument>('Break', breakSchema);
