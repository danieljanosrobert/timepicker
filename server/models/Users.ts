import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  city: string;
  age: string;
  selectedServiceTags: [string];
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  lastName: String,
  firstName: String,
  city: String,
  age: String,
  selectedServiceTags: [String],
}, { timestamps: true });

userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) { return next(); }
  bcrypt.hash(user.password, 10, (bcyptError: any, hash: any) => {
      if (bcyptError) { return next(bcyptError); }
      user.password = hash;
      next();
  });
});

export const User = mongoose.model<UserDocument>('User', userSchema);
