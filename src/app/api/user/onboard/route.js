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
    const { bio, role, image, dob, gender } = await req.json();
    await dbConnect();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { bio, role, image, dob, gender, isOnboarded: true },
      { new: true },
    );

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
