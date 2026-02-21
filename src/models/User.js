import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
    role: String,
    mobile: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    cycleConfig: {
      periodStartDate: Date,
      cycleLength: { type: Number, default: 28 },
      periodLength: { type: Number, default: 5 },
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastLoginDate: { type: Date, default: null },
    },
    loginActivity: [
      {
        browser: String,
        os: String,
        device: String,
        ip: String,
        loginAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
