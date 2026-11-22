import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: String,
  website: String,
  headquarters: String
}, { timestamps: true });
export default mongoose.model("Lab", schema);
