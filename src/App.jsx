import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Router } from './routes/route';
import { Toaster } from 'sonner';
import SEO from './utils/SEO';
// import SEO from './utils/SEO';

function App() {
  const [theme, setTheme] = useState(null);
  const persistedTheme = useSelector((state) => state.utils.theme);

  useEffect(() => {
    // Function to handle the event
    const handlePreloadError = (event) => {
      // Perform the desired action on preload error
      window.location.reload(); // Correct method to reload the page
    };
    // Add event listener when the component mounts
    window.addEventListener('vite:preloadError', handlePreloadError);
    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('vite:preloadError', handlePreloadError);
    };
  }, []);

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
        description={'Participate on foundation and have your voice heard. Foundation rewards every user for their valuable insights'}
        url={import.meta.env.VITE_CLIENT_URL}
        image={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
        type={'website'}
      />
      <Router />
      <Toaster position="top-right" expand={true} theme={persistedTheme === 'dark' ? 'dark' : 'light'} richColors />
    </div>
  );
}

export default App;
