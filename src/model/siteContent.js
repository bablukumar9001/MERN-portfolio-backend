const mongoose = require("mongoose");

// Single-document collection holding all the "one value" content
// that was previously hard-coded across the frontend components.
const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    // Resume / CV
    resumeUrl: { type: String, default: "" },

    // Booking / scheduling (Calendly, Google Calendar, etc.)
    bookingUrl: { type: String, default: "" },

    // "Now" strip — what you're currently working on
    nowTitle: { type: String, default: "" },
    nowDescription: { type: String, default: "" },

    // Home hero
    heroGreeting: { type: String, default: "WELCOME TO MY WORLD" },
    heroName: { type: String, default: "" },
    heroLocation: { type: String, default: "based in India" },
    heroRoles: { type: [String], default: [] },

    // About
    aboutBio: { type: String, default: "" },
    aboutYears: { type: String, default: "2+" },

    // Availability badge (hero, about, contact)
    availabilityText: { type: String, default: "Open to opportunities" },
    availabilityOpen: { type: Boolean, default: true },

    // Animated impact counters
    impactMetrics: {
      type: [
        {
          value: { type: Number, default: 0 },
          suffix: { type: String, default: "" },
          label: { type: String, default: "" },
          icon: { type: String, default: "fas fa-chart-line" },
        },
      ],
      default: [],
    },

    // Freelance / delivery process steps
    workProcess: {
      type: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          icon: { type: String, default: "fas fa-circle" },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },

    // Contact block
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactLocation: { type: String, default: "" },

    // Services section copy
    servicesIntro: { type: String, default: "" },
    servicesEngagementNote: { type: String, default: "" },

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
