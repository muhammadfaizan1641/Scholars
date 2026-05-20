import { Router } from "express";
const router = Router();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const VERIFICATION_EXPIRY_HOURS = 24;

function getClientUrl() {
  return process.env.CLIENT_URL || "http://localhost:5173";
}

function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  return { token, hashedToken, expires };
}

async function sendUserVerification(user) {
  const { token, hashedToken, expires } = createVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expires;
  await user.save();

  const verificationUrl = `${getClientUrl()}/verify-email/${token}`;
  const emailResult = await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  return { verificationUrl, emailResult };
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

    const { verificationUrl, emailResult } = await sendUserVerification(user);

    res.json({
      message: emailResult.sent
        ? "Account created. Please verify your email."
        : "Account created. SMTP is not configured, use the verification link.",
      verificationRequired: true,
      verificationUrl: emailResult.sent ? undefined : verificationUrl,
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

    const { verificationUrl, emailResult } = await sendUserVerification(user);

    res.json({
      message: emailResult.sent
        ? "Verification email sent."
        : "SMTP is not configured, use the verification link.",
      verificationUrl: emailResult.sent ? undefined : verificationUrl
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
