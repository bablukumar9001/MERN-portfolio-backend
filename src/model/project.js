const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tools: { type: String, default: "" },
    accomplishments: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    liveLink: { type: String, default: "" },
    sourceLink: { type: String, default: "" },
    src: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
