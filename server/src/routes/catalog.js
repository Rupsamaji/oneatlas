import { Router } from "express";
import Model from "../models/Model.js";
import Provider from "../models/Provider.js";
import Lab from "../models/Lab.js";
const router = Router();

router.get("/providers", async (_req, res, next) => {
  try {
    const providers = await Provider.find().sort({ name: 1 }).lean();
    const counts = await Model.aggregate([{ $group: { _id: "$provider", count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map(x => [x._id, x.count]));
    res.json(providers.map(p => ({ ...p, modelCount: countMap[p.name] || 0 })));
  } catch (e) { next(e); }
});
router.get("/providers/:slug", async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ slug: req.params.slug }).lean();
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    const models = await Model.find({ provider: provider.name }).lean();
    res.json({ ...provider, models });
  } catch (e) { next(e); }
});
router.get("/labs", async (_req, res, next) => {
  try {
    const labs = await Lab.find().sort({ name: 1 }).lean();
    const counts = await Model.aggregate([{ $group: { _id: "$company", count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map(x => [x._id, x.count]));
    res.json(labs.map(l => ({ ...l, modelCount: countMap[l.name] || 0 })));
  } catch (e) { next(e); }
});
router.get("/labs/:slug", async (req, res, next) => {
  try {
    const lab = await Lab.findOne({ slug: req.params.slug }).lean();
    if (!lab) return res.status(404).json({ message: "Lab not found" });
    const models = await Model.find({ company: lab.name }).lean();
    res.json({ ...lab, models });
  } catch (e) { next(e); }
});
router.get("/rankings", async (req, res, next) => {
  try {
    const { category, benchmark = "reasoning" } = req.query;
    const allowed = ["reasoning", "coding", "math", "knowledge"];
    const key = allowed.includes(benchmark) ? benchmark : "reasoning";
    const filter = category ? { capabilities: category } : {};
    const items = await Model.find(filter).sort({ [`benchmarks.${key}`]: -1 }).limit(30).lean();
    res.json({ benchmark: key, items });
  } catch (e) { next(e); }
});
export default router;
