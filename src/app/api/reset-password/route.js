import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { resetToken, password } = await req.json();

    if (!resetToken || !password) {
      return NextResponse.json(
        { error: "Reset token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Find and verify the reset record
    const resetRecord = await PasswordReset.findById(resetToken);

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    if (!resetRecord.verified) {
      return NextResponse.json(
        { error: "Please verify your code first" },
        { status: 400 },
      );
    }

    if (new Date() > resetRecord.expiresAt) {
      await PasswordReset.deleteOne({ _id: resetRecord._id });
      return NextResponse.json(
        { error: "Reset token has expired. Please start over." },
        { status: 400 },
      );
    }

    // Find user and update password
    const user = await User.findOne({ email: resetRecord.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the reset record
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
