import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for automatic deletion of expired documents
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups
passwordResetSchema.index({ email: 1, code: 1 });

const PasswordReset =
  mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;
