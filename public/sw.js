// frontend/public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data?.json();
  
  const options = {
    body: data.body,
    icon: data.icon || 'https://prepmirrors.com/[favicon]-Prep-mirror-white-bg.png',
    badge: data.badge || '/badge-72x72.png',
    vibrate: data.vibrate || [200, 100, 200],
    data: {
      url: data.data?.url || '/dashboard',
    },
    actions: [
      {
        action: 'practice',
        title: 'Practice Now',
      },
      {
        action: 'later',
        title: 'Later',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'practice') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});