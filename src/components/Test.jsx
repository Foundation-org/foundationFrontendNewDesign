import { Button } from './ui/Button';

const publicVapidKey = 'BKOVGI9f320L94lASnx1yhuHv-NICDsyGKPMqSIVxBQL_Afqk4KRCG_0QrT6v24bqBZkEGetewOuzlGE1l6DQhg';

const Test = () => {
  // Register SW, Register Push, Send Push
  const send = async () => {
    try {
      // Register Service Worker
      console.log('Registering service worker...');
      const register = await navigator.serviceWorker.register('/worker.js', {
        scope: '/test',
      });
      console.log('Service Worker Registered...');

      // Register Push
      console.log('Registering Push...');
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      console.log('Push Registered...');

      // Send Push Notification
      console.log('Sending Push...');
      await fetch(`${import.meta.env.VITE_FRONTEND_URL}/pushNotifications/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Push Sent...');
    } catch (err) {
      console.error(err);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <div>
      <Button variant="submit" onClick={send}>
        Send Push Notification
      </Button>
    </div>
  );
};

export default Test;
