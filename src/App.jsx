import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Router } from './routes/route';
import { Toaster } from 'sonner';
import SEO from './utils/SEO';

function App() {
  const [theme, setTheme] = useState(null);
  const persistedTheme = useSelector((state) => state.utils.theme);

  useEffect(() => {
    if (persistedTheme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [persistedTheme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="h-screen overflow-hidden">
      <SEO
        title={'Foundation'}
        description={'Participate on foundation and have your voice heard / Foundation rewards every user for their valuable insights'}
        url={import.meta.env.VITE_CLIENT_URL}
        image={'https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4///https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fdocuments%2F4a15bdca-57e7-4915-89e0-beebefb33798.jpg%3Ftoken%3DLCK-kqqJ3iGGM8Bzsy58F1pXJ3qnK3vy02v58cNKGpI%26height%3D200%26width%3D200%26expires%3D33243854540/og.png'}
        type={'website'}
      />
      <Router />
      <Toaster position="top-right" expand={true} theme={persistedTheme === 'dark' ? 'dark' : 'light'} richColors />
    </div>
  );
}

export default App;
