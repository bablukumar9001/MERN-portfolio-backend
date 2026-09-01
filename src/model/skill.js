const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "Languages",
        "Frontend",
        "Backend",
        "Databases",
        "DevOps & Cloud",
        "Integrations & Tools",
      ],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
