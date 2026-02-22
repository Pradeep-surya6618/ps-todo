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

    if (rawBody.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Payload too large. Please use a smaller image." },
        { status: 413 },
      );
    }

    const { name, bio, role, image, dob, gender, mobile, location } =
      JSON.parse(rawBody);
    await dbConnect();

    const user = await User.findOneAndUpdate(
      { $or: [{ _id: session.user.id }, { email: session.user.email }] },
      {
        name,
        bio,
        role,
        image,
        dob,
        gender,
        mobile,
        location,
        isOnboarded: true,
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Onboard route error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
