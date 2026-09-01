const { getTransporter, escapeHtml } = require("./mailer");

// Sends an admin reply to the person who submitted a contact message.
// From = your portfolio Gmail (EMAIL_USER), To = the visitor's email.
const sendReplyEmail = async ({ to, name, subject, body, originalMessage }) => {
  const { EMAIL_USER } = process.env;
  const transporter = getTransporter();

  const replySubject = /^re:/i.test(subject) ? subject : `Re: ${subject}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <p>Hi ${escapeHtml(name || "there")},</p>
      <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(body)}</div>
      ${
        originalMessage
          ? `<hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
             <p style="color:#888;font-size:12px;">On your message: "${escapeHtml(
               subject
             )}"</p>
             <blockquote style="color:#888;font-size:13px;border-left:3px solid #eee;padding-left:12px;white-space:pre-wrap;">${escapeHtml(
               originalMessage
             )}</blockquote>`
          : ""
      }
    </div>
  `;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "Bablu Kumar"}" <${EMAIL_USER}>`,
    to,
    replyTo: EMAIL_USER,
    subject: replySubject,
    text: body,
    html,
  });
};

module.exports = sendReplyEmail;
