import { Schema, model } from "mongoose";

type User = {
  name: string;
  email: string;
  avatar?: string;
};


const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
});




export const User = model<User>("User", userSchema);
