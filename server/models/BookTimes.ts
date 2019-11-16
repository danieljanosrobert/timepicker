import mongoose from 'mongoose';

export type BookTimeDocument = mongoose.Document & {
  user_email: string;
  lastMonth: string;
  startTime: string;
  endTime: string;
  bookDuration: number;
  selectedWeekdays: [string],
};

const bookTimeSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  lastMonth: String,
  startTime: String,
  endTime: String,
  bookDuration: Number,
  selectedWeekdays: [String],
});

export const BookTime = mongoose.model<BookTimeDocument>('BookTime', bookTimeSchema);
