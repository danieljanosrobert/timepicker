import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export type AdminUserDocument = mongoose.Document & {
  email: string;
  password: string;
  name: string;
  servicename: string;
};

const adminUserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  servicename: String,
}, { timestamps: true });

adminUserSchema.pre('save', function save(next) {
  const user = this as AdminUserDocument;
  if (!user.isModified('password')) { return next(); }
  bcrypt.hash(user.password, 10, (bcyptError: any, hash: any) => {
      if (bcyptError) { return next(bcyptError); }
      user.password = hash;
      next();
  });
});

export const AdminUser = mongoose.model<AdminUserDocument>('AdminUser', adminUserSchema);
