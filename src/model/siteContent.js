const mongoose = require("mongoose");

// Single-document collection holding all the "one value" content
// that was previously hard-coded across the frontend components.
const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    // Resume / CV
    resumeUrl: { type: String, default: "" },

    // Home hero
    heroGreeting: { type: String, default: "WELCOME TO MY WORLD" },
    heroName: { type: String, default: "" },
    heroLocation: { type: String, default: "based in India" },
    heroRoles: { type: [String], default: [] },

    // About
    aboutBio: { type: String, default: "" },
    aboutYears: { type: String, default: "2+" },

    // Contact block
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactLocation: { type: String, default: "" },

    // Footer
    footerText: { type: String, default: "" },

    // Social links
    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
