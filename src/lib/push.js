import webpush from "web-push";
import dbConnect from "@/lib/db";
import PushSubscription from "@/models/PushSubscription";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:sunmoonie@app.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

export async function sendPushToUser(userId, payload) {
  await dbConnect();
  const subscriptions = await PushSubscription.find({ userId });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        JSON.stringify(payload),
      ),
    ),
  );

  // Clean expired
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === "rejected") {
      const err = results[i].reason;
      if (err.statusCode === 410 || err.statusCode === 404) {
        await PushSubscription.deleteOne({
          endpoint: subscriptions[i].endpoint,
        });
      }
    }
  }

  return results.filter((r) => r.status === "fulfilled").length;
}
