import mongoose from 'mongoose';

export type BreakDocument = mongoose.Document & {
  service_id: string;
  breaks: [{
      date: string,
      startTime: string,
      duration: number,
      always: boolean,
    }];
};

const breakSchema = new mongoose.Schema({
  service_id: { type: String, required: true, unique: true },
  breaks: [{
    date: String,
    startTime: String,
    duration: Number,
    always: Boolean,
  }],
});

export const Break = mongoose.model<BreakDocument>('Break', breakSchema);
