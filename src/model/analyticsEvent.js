const mongoose = require("mongoose");

// Lightweight, cookie-less analytics. One row per day per event type.
const analyticsEventSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // "YYYY-MM-DD"
    type: { type: String, required: true }, // "visit" | "cv_download"
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

analyticsEventSchema.index({ day: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
