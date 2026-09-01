const express = require("express");
require("dotenv").config();
require("./db/conn");
const clientRouter = require("./routers/clientData");
const adminRouter = require("./routers/admin");
const Project = require("./model/project");
const Experience = require("./model/experience");
const Skill = require("./model/skill");
const Education = require("./model/education");
const Service = require("./model/service");
const SiteContent = require("./model/siteContent");
const Image = require("./model/image");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 7000;

const allowedOrigin = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "6mb" })); // room for base64 image uploads

app.use(clientRouter);
app.use("/api/admin", adminRouter);

// Public: serve an uploaded image by id
app.get("/api/images/:id", async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).end();
    res.set("Content-Type", img.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(img.data);
  } catch (err) {
    res.status(400).end();
  }
});

// Public read APIs (portfolio content — fallback on frontend if empty)
app.get("/api/projects", async (req, res) => {
  try {
    const items = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/experiences", async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const items = await Skill.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/education", async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/services", async (req, res) => {
  try {
    const items = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/site-content", async (req, res) => {
  try {
    const doc = await SiteContent.findOne({ key: "main" });
    res.json(doc || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`this app listening on port no. ${PORT}`);
});
