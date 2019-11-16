import mongoose from 'mongoose';

export type LeaveDocument = mongoose.Document & {
  user_email: string;
  leaves: [{
      leaveInterval: [string],
      label: string,
    }];
};

const leaveSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  leaves: [{
    leaveInterval: [String],
    label: String,
  }],
});

export const Leave = mongoose.model<LeaveDocument>('Leave', leaveSchema);
