const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "fas fa-graduation-cap" },
    color: { type: String, default: "#4f46e5" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", educationSchema);
