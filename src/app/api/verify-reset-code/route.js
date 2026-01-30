import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PasswordReset from "@/models/PasswordReset";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Find the reset code
    const resetRecord = await PasswordReset.findOne({
      email: email.toLowerCase(),
      code: code.trim(),
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }

    // Check if code is expired
    if (new Date() > resetRecord.expiresAt) {
      await PasswordReset.deleteOne({ _id: resetRecord._id });
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Mark as verified
    resetRecord.verified = true;
    await resetRecord.save();

    return NextResponse.json(
      {
        message: "Code verified successfully",
        resetToken: resetRecord._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
