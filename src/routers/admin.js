const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authAdmin = require("../middleware/auth");
const Contact = require("../model/clientData");
const Project = require("../model/project");
const Experience = require("../model/experience");
const Skill = require("../model/skill");
const Education = require("../model/education");
const Service = require("../model/service");
const SiteContent = require("../model/siteContent");
const Image = require("../model/image");
const sendReplyEmail = require("../utils/sendReplyEmail");
const { deleteImageByRef, cleanupReplacedImage } = require("../utils/imageCleanup");

const router = express.Router();

// ——— Auth ———
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Admin env not configured" });
    }

    if (!email || !password) {
      return res.status(422).json({ error: "Email and password required" });
    }

    if (email !== adminEmail) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Support plain ADMIN_PASSWORD or bcrypt hash (starts with $2)
    let ok = false;
    if (adminPassword.startsWith("$2")) {
      ok = await bcrypt.compare(password, adminPassword);
    } else {
      ok = password === adminPassword;
    }

    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authAdmin, (req, res) => {
  res.json({ email: req.admin.email, isAdmin: true });
});

// ——— Dashboard stats ———
router.get("/stats", authAdmin, async (req, res) => {
  try {
    const [
      totalMessages,
      unreadMessages,
      projects,
      experiences,
      skills,
      education,
      services,
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
      Project.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Education.countDocuments(),
      Service.countDocuments(),
    ]);

    const latest = await Contact.find().sort({ date: -1 }).limit(5);

    res.json({
      totalMessages,
      unreadMessages,
      projects,
      experiences,
      skills,
      education,
      services,
      latest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ——— Messages ———
router.get("/messages", authAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/messages/:id", authAdmin, async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/messages/:id/read", authAdmin, async (req, res) => {
  try {
    const read = req.body.read !== false;
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/messages/:id", authAdmin, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reply to a message — email goes out from your portfolio Gmail (EMAIL_USER)
router.post("/messages/:id/reply", authAdmin, async (req, res) => {
  try {
    const body = (req.body.body || "").trim();
    if (!body) return res.status(422).json({ error: "Reply body is required" });

    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });

    await sendReplyEmail({
      to: msg.email,
      name: msg.name,
      subject: msg.subject,
      body,
      originalMessage: msg.message,
    });

    msg.replies.push({ body });
    msg.read = true;
    await msg.save();

    res.json(msg);
  } catch (err) {
    console.error("Reply failed:", err.message);
    res.status(500).json({ error: err.message || "Failed to send reply" });
  }
});

// ——— Projects CRUD ———
router.get("/projects", authAdmin, async (req, res) => {
  const items = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/projects", authAdmin, async (req, res) => {
  try {
    const item = await Project.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/projects/:id", authAdmin, async (req, res) => {
  try {
    const prev = await Project.findById(req.params.id);
    if (!prev) return res.status(404).json({ error: "Not found" });
    const item = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await cleanupReplacedImage(prev.src, item.src);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/projects/:id", authAdmin, async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (item) await deleteImageByRef(item.src);
  res.json({ success: true });
});

// ——— Experience CRUD ———
router.get("/experiences", authAdmin, async (req, res) => {
  const items = await Experience.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/experiences", authAdmin, async (req, res) => {
  try {
    const item = await Experience.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/experiences/:id", authAdmin, async (req, res) => {
  try {
    const prev = await Experience.findById(req.params.id);
    if (!prev) return res.status(404).json({ error: "Not found" });
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await cleanupReplacedImage(prev.companyLogo, item.companyLogo);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/experiences/:id", authAdmin, async (req, res) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (item) await deleteImageByRef(item.companyLogo);
  res.json({ success: true });
});

// ——— Skills CRUD ———
router.get("/skills", authAdmin, async (req, res) => {
  const items = await Skill.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/skills", authAdmin, async (req, res) => {
  try {
    const item = await Skill.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/skills/:id", authAdmin, async (req, res) => {
  try {
    const prev = await Skill.findById(req.params.id);
    if (!prev) return res.status(404).json({ error: "Not found" });
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await cleanupReplacedImage(prev.image, item.image);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/skills/:id", authAdmin, async (req, res) => {
  const item = await Skill.findByIdAndDelete(req.params.id);
  if (item) await deleteImageByRef(item.image);
  res.json({ success: true });
});

// ——— Education CRUD ———
router.get("/education", authAdmin, async (req, res) => {
  const items = await Education.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/education", authAdmin, async (req, res) => {
  try {
    const item = await Education.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/education/:id", authAdmin, async (req, res) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/education/:id", authAdmin, async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ——— Services CRUD ———
router.get("/services", authAdmin, async (req, res) => {
  const items = await Service.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post("/services", authAdmin, async (req, res) => {
  try {
    const item = await Service.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/services/:id", authAdmin, async (req, res) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/services/:id", authAdmin, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ——— Site Content (single document) ———
router.get("/site-content", authAdmin, async (req, res) => {
  try {
    let doc = await SiteContent.findOne({ key: "main" });
    if (!doc) doc = await SiteContent.create({ key: "main" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/site-content", authAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.key;
    const doc = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { $set: payload },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ——— Image upload (base64 data URL -> stored in Mongo) ———
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

router.post("/upload", authAdmin, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    const match = /^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/s.exec(dataUrl || "");
    if (!match) return res.status(422).json({ error: "Invalid image data" });

    const contentType = match[1];
    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(422).json({ error: "Unsupported image type" });
    }

    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: "Image too large (max 3 MB)" });
    }

    const img = await Image.create({
      data: buffer,
      contentType,
      filename: filename || "",
      size: buffer.length,
    });

    res.status(201).json({ url: `/api/images/${img._id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/images/:id", authAdmin, async (req, res) => {
  await Image.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Sweep uploaded images no collection references any more.
router.post("/images/cleanup", authAdmin, async (req, res) => {
  try {
    const referenced = new Set();
    const collect = (docs, field) =>
      docs.forEach((d) => {
        const m = /\/api\/images\/([a-f0-9]{24})/i.exec(d[field] || "");
        if (m) referenced.add(m[1]);
      });

    collect(await Project.find({}, "src"), "src");
    collect(await Skill.find({}, "image"), "image");
    collect(await Experience.find({}, "companyLogo"), "companyLogo");

    const all = await Image.find({}, "_id");
    const orphans = all.filter((img) => !referenced.has(String(img._id)));
    if (orphans.length) {
      await Image.deleteMany({ _id: { $in: orphans.map((o) => o._id) } });
    }
    res.json({ deleted: orphans.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
