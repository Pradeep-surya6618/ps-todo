import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { sendEmail } from "@/lib/email";
import {
  getVerificationCodeEmail,
  getVerificationCodeText,
} from "@/lib/emailTemplates";

// Generate random 4-digit code
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a password reset code.",
        },
        { status: 200 },
      );
    }

    // Delete any existing reset codes for this email
    await PasswordReset.deleteMany({ email: email.toLowerCase() });

    // Generate new code
    const code = generateCode();

    // Save reset code to database
    await PasswordReset.create({
      email: email.toLowerCase(),
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send email with verification code
    const emailResult = await sendEmail({
      to: email,
      subject: "Reset Your Password - SunMoonie",
      html: getVerificationCodeEmail(code),
      text: getVerificationCodeText(code),
    });

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
