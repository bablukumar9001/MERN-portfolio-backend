const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, default: "" },
    issueDate: { type: String, default: "" }, // free text e.g. "Jun 2024"
    credentialId: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    image: { type: String, default: "" }, // badge / logo
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);
