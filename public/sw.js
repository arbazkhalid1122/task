self.addEventListener("push", (event) => {
  let data = { title: "Notification", body: "", url: "/" };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {}
  }

  const options = {
    body: data.body || "",
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(data.title || "Notification", options));
});

function normalizeNotificationUrl(value) {
  try {
    const url = new URL(value || "/", self.location.origin);
    if (url.origin !== self.location.origin) {
      return "/";
    }
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = normalizeNotificationUrl(event.notification.data?.url);

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === self.location.origin && "focus" in client) {
          client.navigate(path);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(`${self.location.origin}${path}`);
      }
    }),
  );
});
