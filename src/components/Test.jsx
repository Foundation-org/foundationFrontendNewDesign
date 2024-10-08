import { Button } from './ui/Button';

const Test = () => {
  const handlePushNotification = async () => {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      const notification = new Notification('Hello World', {
        body: 'This is a test notification',
        icon: 'https://cdn-icons-png.flaticon.com/512/531/531311.png',
        data: { hello: 'world' },
      });

      notification.onclick = () => {
        console.log('Notification clicked');
      };
    }
  };

  return (
    <div>
      <Button
        variant="submit"
        onClick={() => {
          handlePushNotification();
        }}
      >
        Send Push Notification
      </Button>
    </div>
  );
};

export default Test;
