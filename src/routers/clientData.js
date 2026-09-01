const express = require("express");
const router = new express.Router();
const cData = require("../model/clientData");
const sendContactEmail = require("../utils/sendContactEmail");
const createRateLimiter = require("../middleware/rateLimit");

// Max 3 contact submissions per IP per 10 minutes.
const contactLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: "Too many messages sent. Please try again in a few minutes.",
});

router.get("", (req, res) => {
  res.send("hello this is the express home page ");
});

router.post("/clientdata", contactLimiter, async (req, res) => {
  const { name, email, message, website } = req.body;
  const mobile = req.body.mobile || "";
  const subject = req.body.subject || "General inquiry";

  // Honeypot: real users never fill the hidden "website" field; bots do.
  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(422).json({ error: "Please fill in your name, email and message." });
  }

  try {
    const user = new cData({ name, mobile, email, subject, message });
    const createUser = await user.save();

    // Soft-fail: DB save succeeded even if email fails
    try {
      await sendContactEmail({ name, mobile, email, subject, message });
    } catch (mailErr) {
      console.error("Contact email failed:", mailErr.message);
    }

    res.status(201).json(createUser);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e.message || "Bad request" });
  }
});

module.exports = router;
