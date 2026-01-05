const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    startTime: String,
    endTime: String,
    date: Date,
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", shiftSchema);
