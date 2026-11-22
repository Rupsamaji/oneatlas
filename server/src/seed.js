import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";
import Model from "./models/Model.js";
import Provider from "./models/Provider.js";
import Lab from "./models/Lab.js";
import { models, providers, labs } from "./data/seedData.js";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/oneatlas";
try {
  await mongoose.connect(uri);
  await Promise.all([Model.deleteMany({}), Provider.deleteMany({}), Lab.deleteMany({})]);
  await Promise.all([
    Model.insertMany(models),
    Provider.insertMany(providers),
    Lab.insertMany(labs)
  ]);
  console.log(`Seeded ${models.length} models, ${providers.length} providers and ${labs.length} labs.`);
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
