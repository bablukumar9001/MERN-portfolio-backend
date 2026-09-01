const nodemailer = require("nodemailer");

// Shared Gmail transporter used for both the contact notification and
// admin replies. Requires EMAIL_USER + EMAIL_PASS (Gmail app password).
const getTransporter = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email env vars missing (EMAIL_USER, EMAIL_PASS)");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
};

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

module.exports = { getTransporter, escapeHtml };
