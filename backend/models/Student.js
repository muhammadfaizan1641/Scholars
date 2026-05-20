import { Schema, model } from "mongoose";

const feesSchema = new Schema({
  month: String,
  paid: {
    type: Boolean,
    default: false,
  },
  paidDate: {
    type: Date,
    default: null,
  },
});

const studentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  className: {
    type: String,
    required: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  fees: {
    type: Number,
    required: true,
  },

  joiningDate: {
    type: Date,
  },

  teacherName: {
    type: String,
  },

  batchTiming: {
    startTime: {
      type: String, // example "17:00"
      required: true,
    },

    endTime: {
      type: String, // example "18:00"
      required: true,
    },
  },

  feesHistory: [feesSchema],
});

export default model("Student", studentSchema);
