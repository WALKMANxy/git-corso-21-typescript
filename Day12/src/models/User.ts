import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string | null;
};

type UserDocument = Document & User;

const userSchema = new Schema<UserDocument>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
});


userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

export const User = model<UserDocument>("User", userSchema);
