import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch fresh user data including cycleConfig
    const user = await User.findOne({ email: session.user.email }).select(
      "cycleConfig",
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.cycleConfig || {});
  } catch (error) {
    console.error("Fetch Cycle Settings Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Validate body if necessary (e.g. check ranges)

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { cycleConfig: body } },
      { new: true },
    )
      .select("cycleConfig")
      .lean();

    return NextResponse.json(updatedUser?.cycleConfig || {});
  } catch (error) {
    console.error("Update Cycle Settings Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
