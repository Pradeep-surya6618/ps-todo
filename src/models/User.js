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
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
