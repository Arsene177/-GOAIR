// Service worker for handling push notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/vite.svg',
      badge: '/vite.svg',
      data: data.data || {},
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'GoAir Notification', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Handle notification click
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});