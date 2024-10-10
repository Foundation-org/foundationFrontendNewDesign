console.log('Service Worker Loaded...');

self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log('Push Received...');
  self.registration.showNotification(data.title, {
    body: 'This is a test notification by Foundation',
    icon: `https://s3.us-east-2.amazonaws.com/on.foundation/assets/svgs/F.svg`,
  });
});
