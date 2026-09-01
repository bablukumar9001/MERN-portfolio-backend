const { getTransporter, escapeHtml } = require("./mailer");

const sendContactEmail = async ({ name, mobile, email, subject, message }) => {
  const { EMAIL_USER, EMAIL_TO } = process.env;
  if (!EMAIL_TO) {
    throw new Error("Email env var missing (EMAIL_TO)");
  }

  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">New Portfolio Contact</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Mobile</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(mobile))}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(subject)}</td></tr>
        <tr><td style="padding: 8px; vertical-align: top;"><strong>Message</strong></td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(message)}</td></tr>
      </table>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">Sent from your portfolio contact form · ${new Date().toLocaleString()}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${EMAIL_USER}>`,
    to: EMAIL_TO,
    replyTo: email,
    subject: `Portfolio Contact: ${subject} — ${name}`,
    html,
  });
};

module.exports = sendContactEmail;
