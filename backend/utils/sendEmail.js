export async function sendVerificationEmail({ to, name, verificationUrl, otp }) {
  const cleanEnv = (value) => {
    if (!value) return "";
    const trimmed = value.trim();
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];

    if ((first === "'" && last === "'") || (first === '"' && last === '"')) {
      return trimmed.slice(1, -1);
    }

    return trimmed;
  };

  const smtpHost = cleanEnv(process.env.SMTP_HOST);
  const smtpUser = cleanEnv(process.env.SMTP_USER);
  const smtpPass = cleanEnv(process.env.SMTP_PASS).replace(/\s+/g, "");
  const smtpFrom = cleanEnv(process.env.SMTP_FROM);

  const hasSmtpConfig =
    smtpHost &&
    smtpUser &&
    smtpPass;

  if (!hasSmtpConfig) {
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: smtpFrom || `"Scholars" <${smtpUser}>`,
    to,
    subject: "Verify your Scholars account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #111827;">
        <h2 style="margin-bottom: 8px;">Welcome to Scholars${name ? `, ${name}` : ""}</h2>
        <p style="line-height: 1.6; color: #4b5563;">
          Please verify your email address to activate your account. You can click the button or enter the OTP below.
        </p>
        <div style="font-size: 28px; letter-spacing: 8px; font-weight: 800; margin: 18px 0; padding: 14px 18px; background: #f3f4f6; border-radius: 10px; text-align: center;">
          ${otp}
        </div>
        <a href="${verificationUrl}" style="display: inline-block; margin: 18px 0; padding: 12px 18px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">
          Verify Email
        </a>
        <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
          This OTP and link will expire in 24 hours. If the button does not work, paste this link in your browser:<br />
          ${verificationUrl}
        </p>
      </div>
    `,
  });

  return { sent: true };
}
