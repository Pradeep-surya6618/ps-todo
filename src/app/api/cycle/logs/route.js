import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CycleLog from "@/models/CycleLog";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { startOfMonth, endOfMonth } from "date-fns";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      // We need user ID for the log.
      // Ideally next-auth session has ID. If not, we fetch user by email.
    }

    // Ensure we have the user ID
    await dbConnect();
    let userId = session?.user?.id;
    if (!userId && session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select(
        "_id",
      );
      if (user) userId = user._id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, symptoms } = await req.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Upsert the log for this date
    // Convert date string to Date object (midnight) to normalize
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    const log = await CycleLog.findOneAndUpdate(
      { userId, date: logDate },
      { $set: { symptoms } },
      { upsert: true, new: true },
    );

    return NextResponse.json(log);
  } catch (error) {
    console.error("Save Cycle Log Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();

    let userId = session?.user?.id;
    if (!userId && session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select(
        "_id",
      );
      if (user) userId = user._id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const monthStr = searchParams.get("month"); // "2025-10"

    // Default to current month if not specified, or handle ranges
    let startDate, endDate;
    if (monthStr) {
      const date = new Date(monthStr + "-01");
      startDate = startOfMonth(date);
      endDate = endOfMonth(date);
    } else {
      // Fallback: fetch last 60 days? Or just all logs?
      // Let's just return all logs for now as dataset is small
      const logs = await CycleLog.find({ userId }).sort({ date: -1 });
      return NextResponse.json(logs);
    }

    const logs = await CycleLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Fetch Cycle Logs Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
