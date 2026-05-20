import dotenv from "dotenv";
dotenv.config();

// console.log("PORT =", process.env.PORT);
// console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);

import express from "express";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});