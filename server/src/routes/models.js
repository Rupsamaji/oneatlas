import { Router } from "express";
import mongoose from "mongoose";
import Model from "../models/Model.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { q, company, provider, capability, type, sort = "featured", page = 1, limit = 50 } = req.query;
    const filter = {};
    if (company) filter.company = company;
    if (provider) filter.provider = provider;
    if (type) filter.type = type;
    if (capability) filter.capabilities = capability;
    if (q) filter.$text = { $search: q };
    const sortMap = {
      featured: { featured: -1, "benchmarks.reasoning": -1 },
      price_asc: { inputPrice: 1 },
      price_desc: { inputPrice: -1 },
      context: { contextWindow: -1 },
      newest: { releaseDate: -1 },
      reasoning: { "benchmarks.reasoning": -1 }
    };
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const [items, total] = await Promise.all([
      Model.find(filter).sort(sortMap[sort] || sortMap.featured).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
      Model.countDocuments(filter)
    ]);
    res.json({ items, total, page: safePage, pages: Math.ceil(total / safeLimit) });
  } catch (error) { next(error); }
});

router.get("/compare", async (req, res, next) => {
  try {
    const ids = String(req.query.ids || "").split(",").filter(id => mongoose.isValidObjectId(id)).slice(0, 4);
    const items = await Model.find({ _id: { $in: ids } }).lean();
    res.json({ items });
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Model.findOne({ $or: [{ slug: req.params.id }, ...(mongoose.isValidObjectId(req.params.id) ? [{ _id: req.params.id }] : [])] }).lean();
    if (!item) return res.status(404).json({ message: "Model not found" });
    res.json(item);
  } catch (error) { next(error); }
});
export default router;
