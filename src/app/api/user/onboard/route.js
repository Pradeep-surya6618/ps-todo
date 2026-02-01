import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rawBody = await req.text();
    console.log("Incoming request body size:", rawBody.length, "bytes");

    if (rawBody.length > 5 * 1024 * 1024) {
      // 5MB limit check (Base64 of 3MB is ~4MB)
      return NextResponse.json(
        { error: "Payload too large. Please use a smaller image." },
        { status: 413 },
      );
    }

    const { bio, role, image, dob, gender, mobile, location } =
      JSON.parse(rawBody);
    await dbConnect();

    console.log(
      "Updating user by ID or Email:",
      session.user.id,
      session.user.email,
    );
    const user = await User.findOneAndUpdate(
      { $or: [{ _id: session.user.id }, { email: session.user.email }] },
      { bio, role, image, dob, gender, mobile, location, isOnboarded: true },
      { new: true },
    );

    if (!user) {
      console.log("User not found in DB:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User updated successfully:", user.email);
    return NextResponse.json(user);
  } catch (error) {
    console.error("API Error in onboard route:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
