import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  company: { type: String, required: true, index: true },
  provider: { type: String, required: true, index: true },
  description: { type: String, default: "" },
  type: { type: String, default: "LLM", index: true },
  capabilities: [{ type: String, index: true }],
  modalities: [String],
  contextWindow: { type: Number, default: 0, index: true },
  inputPrice: { type: Number, default: 0, index: true },
  outputPrice: { type: Number, default: 0 },
  releaseDate: { type: Date },
  benchmarks: {
    reasoning: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    math: { type: Number, default: 0 },
    knowledge: { type: Number, default: 0 }
  },
  providerOptions: [{ name: String, inputPrice: Number, outputPrice: Number }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

modelSchema.index({ name: "text", company: "text", provider: "text", description: "text" });
export default mongoose.model("Model", modelSchema);
