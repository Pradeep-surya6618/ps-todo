import mongoose from "mongoose";

const CycleLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    symptoms: {
      type: [String], // e.g. ["cramps", "headache"]
      default: [],
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "bad", "awful", ""],
      default: "",
    },
    flowIntensity: {
      type: String,
      enum: ["spot", "light", "medium", "heavy", ""],
      default: "",
    },
    note: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true },
);

// Compound index to ensure one log per day per user
CycleLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.CycleLog ||
  mongoose.model("CycleLog", CycleLogSchema);
