import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import dbConnect from "@/lib/db";
import PushSubscription from "@/models/PushSubscription";
import User from "@/models/User";
import webpush from "web-push";
import { NextResponse } from "next/server";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:sunmoonie@app.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

async function getUserId(session) {
  if (!session?.user?.id && session?.user?.email) {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user?._id;
  }
  return session?.user?.id;
}

export async function POST(request) {
  try {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: "Push notifications not configured" }, { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = await getUserId(session);
    const { title, body, icon, url } = await request.json();

    const subscriptions = await PushSubscription.find({ userId });
    const payload = JSON.stringify({ title, body, icon, url });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload,
        ),
      ),
    );

    // Clean up expired subscriptions
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === "rejected") {
        const error = results[i].reason;
        if (error.statusCode === 410 || error.statusCode === 404) {
          await PushSubscription.deleteOne({
            endpoint: subscriptions[i].endpoint,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.filter((r) => r.status === "fulfilled").length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
