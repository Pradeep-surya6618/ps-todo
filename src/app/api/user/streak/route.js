import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

async function getUserId(session) {
  if (!session?.user?.id && session?.user?.email) {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user?._id;
  }
  return session?.user?.id;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = user.streak?.lastLoginDate
      ? new Date(user.streak.lastLoginDate)
      : null;
    const lastLoginDay = lastLogin
      ? new Date(
          lastLogin.getFullYear(),
          lastLogin.getMonth(),
          lastLogin.getDate(),
        )
      : null;

    let current = user.streak?.current || 0;
    let longest = user.streak?.longest || 0;

    if (lastLoginDay && lastLoginDay.getTime() === today.getTime()) {
      // Same day — no update needed
      return NextResponse.json({ current, longest, lastLoginDate: today });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLoginDay && lastLoginDay.getTime() === yesterday.getTime()) {
      // Consecutive day — increment streak
      current += 1;
    } else {
      // Streak broken — reset to 1
      current = 1;
    }

    if (current > longest) {
      longest = current;
    }

    user.streak = { current, longest, lastLoginDate: today };
    await user.save();

    // Send milestone notifications
    if ([3, 7, 14, 30, 50, 100].includes(current)) {
      await Notification.create({
        userId,
        title: "Streak Milestone!",
        message: `Amazing! You've maintained a ${current}-day login streak!`,
        type: "success",
      });
    }

    return NextResponse.json({ current, longest, lastLoginDate: today });
  } catch (error) {
    console.error("Streak error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
