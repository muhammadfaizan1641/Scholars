import { Router } from "express";
const router = Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const VERIFICATION_EXPIRY_HOURS = 24;
const EMAIL_SEND_TIMEOUT_MS = 8000;

function getClientUrl() {
  return process.env.CLIENT_URL || "http://localhost:5173";
}

function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  return { token, hashedToken, expires };
}

function createVerificationOtp() {
  const otp = String(crypto.randomInt(100000, 1000000));
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  return { otp, hashedOtp, expires };
}

function withTimeout(promise, timeoutMs, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    }),
  ]);
}

async function sendUserVerification(user) {
  const { token, hashedToken, expires } = createVerificationToken();
  const { otp, hashedOtp, expires: otpExpires } = createVerificationOtp();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expires;
  user.emailVerificationOtp = hashedOtp;
  user.emailVerificationOtpExpires = otpExpires;
  await user.save();

  const verificationUrl = `${getClientUrl()}/verify-email/${token}`;
  let emailResult;

  try {
    emailResult = await withTimeout(
      sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
        otp,
      }),
      EMAIL_SEND_TIMEOUT_MS,
      "EMAIL_SEND_TIMEOUT"
    );
  } catch (error) {
    emailResult = { sent: false, reason: error.message || "EMAIL_SEND_FAILED" };
  }

  return { verificationUrl, otp, emailResult };
}

router.post("/signup", async (req, res) => {

  try {

    const {
      name,
      password
    } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword

    });

    const { emailResult } = await sendUserVerification(user);

    res.json({
      message: emailResult.sent
        ? "Account created. Please verify your email with the OTP."
        : "Account created, but verification email could not be sent. Please try Resend OTP.",
      verificationRequired: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.get("/verify-email/:token", async (req, res) => {

  try {

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link invalid ya expire ho gaya hai"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;
    await user.save();

    res.json({
      message: "Email verified successfully. You can sign in now."
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.post("/verify-otp", async (req, res) => {

  try {

    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Valid email aur 6 digit OTP required hai"
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      emailVerificationOtp: hashedOtp,
      emailVerificationOtpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: "OTP invalid ya expire ho gaya hai"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;
    await user.save();

    res.json({
      message: "Email verified successfully. You can sign in now."
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.post("/resend-verification", async (req, res) => {

  try {

    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email required hai"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Account nahi mila"
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        message: "Email already verified hai"
      });
    }

    const { emailResult } = await sendUserVerification(user);

    res.json({
      message: emailResult.sent
        ? "Verification OTP sent."
        : "Verification email could not be sent. Please check SMTP settings and try again."
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.post("/login", async (req, res) => {

  try {

    const {
      password
    } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();

    const user = await User.findOne({
      email
    });

    if (!user) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }

    if (!user.isEmailVerified) {

      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before signing in.",
        email: user.email
      });

    }

    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET

    );

    res.json({
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

export default router;
