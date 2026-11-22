import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import modelRoutes from "./routes/models.js";
import catalogRoutes from "./routes/catalog.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected", service: "OneAtlas API" }));
app.use("/api/models", modelRoutes);
app.use("/api", catalogRoutes);
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server.", detail: process.env.NODE_ENV === "development" ? err.message : undefined });
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/oneatlas")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`OneAtlas API running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
