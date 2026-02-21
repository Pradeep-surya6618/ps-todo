// Push notification handlers for service worker
// This gets merged with the auto-generated sw.js by @ducanh2912/next-pwa

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "",
      icon: data.icon || "/icons/Logo.png",
      badge: "/icons/Logo.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/dashboard",
        dateOfArrival: Date.now(),
      },
      actions: [
        { action: "open", title: "Open" },
        { action: "dismiss", title: "Dismiss" },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(urlToOpen);
      }),
  );
});
