import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

import dotenv from "dotenv";
dotenv.config();

const router = Router();

const PRO_PRICE_INR = 29900;
const PLAN_DURATION_DAYS = 30;

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

// Razorpay instance - keys .env se lo
const razorpay = new Razorpay({
  key_id    : process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ─── CREATE ORDER ─────────────────────────────────────────────────────────── */
// POST /api/payment/create-order
router.post("/create-order", auth, async (req, res) => {
  try {
    const options = {
      amount  : PRO_PRICE_INR,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order); // { id, amount, currency, receipt, status, ... }
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Order create karna fail ho gaya" });
  }
});

/* ─── VERIFY PAYMENT ───────────────────────────────────────────────────────── */
// POST /api/payment/verify
router.post("/verify", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details incomplete hain" });
    }

    // Razorpay signature verify karo
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature - payment tampered" });
    }

    const planStartDate = new Date();
    const planEndDate = addDays(planStartDate, PLAN_DURATION_DAYS);

    await User.findByIdAndUpdate(req.userId, {
      plan: "pro",
      planStartDate,
      planEndDate,
      lastPaymentId: razorpay_payment_id,
    });

    res.json({
      success: true,
      message: "Pro plan activate ho gaya!",
      planInfo: {
        plan: "pro",
        status: "active",
        isProActive: true,
        startedAt: planStartDate,
        expiresAt: planEndDate,
        daysRemaining: PLAN_DURATION_DAYS,
      },
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
