const mongoose = require("mongoose");

// Single admin account. Seeded from ADMIN_EMAIL / ADMIN_PASSWORD on first login,
// after which the password can be changed from the admin panel.
const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUser", adminUserSchema);
