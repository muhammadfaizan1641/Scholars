export async function sendVerificationEmail({ to, name, verificationUrl }) {
  const hasSmtpConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtpConfig) {
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Scholars" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your Scholars account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #111827;">
        <h2 style="margin-bottom: 8px;">Welcome to Scholars${name ? `, ${name}` : ""}</h2>
        <p style="line-height: 1.6; color: #4b5563;">
          Please verify your email address to activate your account.
        </p>
        <a href="${verificationUrl}" style="display: inline-block; margin: 18px 0; padding: 12px 18px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">
          Verify Email
        </a>
        <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
          This link will expire in 24 hours. If the button does not work, paste this link in your browser:<br />
          ${verificationUrl}
        </p>
      </div>
    `,
  });

  return { sent: true };
}
