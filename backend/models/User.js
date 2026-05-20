import { Schema, model } from "mongoose";

const userSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: {
    type: String,
    default: null
  },

  emailVerificationExpires: {
    type: Date,
    default: null
  },

  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },

  planStartDate: {
    type: Date,
    default: null
  },

  planEndDate: {
    type: Date,
    default: null
  },

  lastPaymentId: {
    type: String,
    default: null
  }

}, { timestamps: true });

export default model("User", userSchema);
