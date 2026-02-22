import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

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

    // Validate cycle config fields
    const safeConfig = {};
    if (body.cycleLength !== undefined) {
      const len = Number(body.cycleLength);
      if (isNaN(len) || len < 20 || len > 45) {
        return NextResponse.json({ error: "Cycle length must be between 20 and 45" }, { status: 400 });
      }
      safeConfig.cycleLength = len;
    }
    if (body.periodLength !== undefined) {
      const len = Number(body.periodLength);
      if (isNaN(len) || len < 2 || len > 10) {
        return NextResponse.json({ error: "Period length must be between 2 and 10" }, { status: 400 });
      }
      safeConfig.periodLength = len;
    }
    if (body.periodStartDate !== undefined) {
      safeConfig.periodStartDate = body.periodStartDate;
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { cycleConfig: { ...safeConfig } } },
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
