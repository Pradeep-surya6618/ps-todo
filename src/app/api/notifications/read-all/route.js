import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { NextResponse } from "next/server";

async function getUserId(session) {
  if (!session?.user?.id && session?.user?.email) {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user?._id;
  }
  return session?.user?.id;
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark all read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
