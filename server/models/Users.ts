import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
}, { timestamps: true });

userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    // tslint:disable-next-line
    bcrypt.hash(user.password, salt, () => {}, (bcyptError: any, hash: any) => {
      if (bcyptError) { return next(bcyptError); }
      user.password = hash;
      next();
    });
  });
});


export const User = mongoose.model<UserDocument>('User', userSchema, 'User');
