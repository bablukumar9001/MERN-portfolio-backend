const mongoose = require("mongoose");

// Uploaded images are stored straight in Mongo so they survive on hosts with
// an ephemeral filesystem (Render, etc.) without needing an external bucket.
const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: "" },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
