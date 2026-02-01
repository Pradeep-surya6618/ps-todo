import mongoose from "mongoose";

const CalendarEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["note", "birthday", "task", "other"],
      default: "note",
    },
    color: {
      type: String,
      default: "#ff2e63", // Default to primary color
    },
  },
  { timestamps: true },
);

export default mongoose.models.CalendarEvent ||
  mongoose.model("CalendarEvent", CalendarEventSchema);
