import mongoose from 'mongoose';

export type LeaveDocument = mongoose.Document & {
  service_id: string;
  leaves: [{
      leaveInterval: [string, string],
      label: string,
    }];
};

const leaveSchema = new mongoose.Schema({
  service_id: { type: String, required: true, unique: true },
  leaves: [{
    leaveInterval: [String, String],
    label: String,
  }],
});

export const Leave = mongoose.model<LeaveDocument>('Leave', leaveSchema);
