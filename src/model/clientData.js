const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("A valid email is required");
      }
    },
  },
  subject: {
    type: String,
    default: "General inquiry",
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  replies: [
    {
      body: { type: String, required: true },
      sentAt: { type: Date, default: Date.now },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const contactData = mongoose.model("contactData", contactSchema);

module.exports = contactData;
