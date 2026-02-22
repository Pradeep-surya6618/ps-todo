import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email: rawEmail, password } = await req.json();

    if (!name || !rawEmail || !password) {
      return NextResponse.json(
        { error: "Please provide name, email and password" },
        { status: 400 },
      );
    }

    const email = rawEmail.toLowerCase().trim();

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isOnboarded: false,
    });

    return NextResponse.json(
      { message: "Registration successful!", userId: user._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration fatal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
