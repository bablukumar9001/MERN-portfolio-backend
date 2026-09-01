const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    companyLogo: { type: String, default: "" },
    companyName: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, default: "" },
    color: { type: String, default: "#ff014f" },
    icon: { type: String, default: "fas fa-briefcase" },
    achievements: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
