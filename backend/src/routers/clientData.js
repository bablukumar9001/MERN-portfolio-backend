const express = require("express");
const router = new express.Router();
const cData = require("../model/clientData");
const sendContactEmail = require("../utils/sendContactEmail");

router.get("", (req, res) => {
  res.send("hello this is the express home page ");
});

router.post("/clientdata", async (req, res) => {
  const { name, mobile, email, subject, message } = req.body;

  if (!name || !mobile || !email || !subject || !message) {
    return res.status(422).json({ error: "plz fill the fields properly" });
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
