import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;  
  otp?: string;
  otpExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String }, 
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true } // enables createdAt & updatedAt
);

export default mongoose.model<IUser>("User", userSchema);
