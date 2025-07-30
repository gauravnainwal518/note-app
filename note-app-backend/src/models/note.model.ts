import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  userId: string;
  title: string;
  content: string;
}

const noteSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", noteSchema);
