const express = require("express");
require("dotenv").config();
require("./db/conn");
const clientRouter = require("./routers/clientData");
const adminRouter = require("./routers/admin");
const Project = require("./model/project");
const Experience = require("./model/experience");
const Skill = require("./model/skill");
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
app.use(express.json());

app.use(clientRouter);
app.use("/api/admin", adminRouter);

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

app.listen(PORT, () => {
  console.log(`this app listening on port no. ${PORT}`);
});
