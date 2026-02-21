import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
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

function parseUserAgent(ua) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Browser detection
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/"))
    browser = "Safari";

  // OS detection
  if (ua.includes("Windows NT 10")) os = "Windows 10/11";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  // Device detection
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone"))
    device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

  return { browser, os, device };
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);

    const ua = request.headers.get("user-agent") || "";
    const { browser, os, device } = parseUserAgent(ua);

    // Get IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Add to loginActivity, keep last 20 entries
    await User.findByIdAndUpdate(userId, {
      $push: {
        loginActivity: {
          $each: [{ browser, os, device, ip, loginAt: new Date() }],
          $slice: -20,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activity log error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);
    const user = await User.findById(userId).select("loginActivity");

    const activities = (user?.loginActivity || [])
      .sort((a, b) => new Date(b.loginAt) - new Date(a.loginAt))
      .slice(0, 20);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
