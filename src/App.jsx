import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Router } from './routes/route';
import { Toaster } from 'sonner';
import SEO from './utils/SEO';
import { MaintenanceRouter } from './routes/maintenance';
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

  // useEffect(() => {
  //   console.log('Running UseEffect For Erros Checker')
  //   // Check for blank screen
  //   const isBlankScreen = document.documentElement.clientWidth === 0 || document.documentElement.clientHeight === 0;

  //   // Check for JavaScript errors
  //   const hasJavaScriptError = window.onerror !== null;

  //   // Check for specific error messages in console
  //   const hasConsoleErrorMessage = console.error.toString().includes('Error message to check');

  //   // Check for network errors
  //   const hasNetworkError = window.navigator.onLine === false;

  //   // Check for uncaught exceptions
  //   const hasUncaughtException = window.onerror !== null || window.onunhandledrejection !== null;

  //   // Combine conditions to check for rendering issues
  //   const hasRenderingIssue = isBlankScreen || hasJavaScriptError || hasConsoleErrorMessage || hasNetworkError || hasUncaughtException;

  //   if (hasRenderingIssue) {

  //     // Reload the page if the condition is met

  //     window.location.reload();
  //   }
  // }, []); // Empty dependency array ensures this effect runs only once on component mount

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

  // useEffect(() => {
  //   document.addEventListener("visibilitychange", function() {
  //     if (document.visibilityState === 'hidden') {
  //       alert("Background Tab Throttling hidden")
  //     } else {
  //       alert("Background Tab Throttling not hidden")
  //       // Resume operations
  //     }
  // });
  // }, []);

  // useEffect(() => {
  //   let inactivityTimeout;

  //   const resetInactivityTimer = () => {
  //     clearTimeout(inactivityTimeout);
  //     inactivityTimeout = setTimeout(() => {
  //       window.location.reload(); // Reload the page after 10 minutes of inactivity
  //     }, 10 * 60 * 1000); // 10 minutes in milliseconds
  //   };

  //   const handleUserActivity = () => {
  //     resetInactivityTimer();
  //   };

  //   // Listen for user activity events
  //   document.addEventListener('mousemove', handleUserActivity);
  //   document.addEventListener('keypress', handleUserActivity);

  //   // Initial setup
  //   resetInactivityTimer();

  //   // Clean up event listeners
  //   return () => {
  //     document.removeEventListener('mousemove', handleUserActivity);
  //     document.removeEventListener('keypress', handleUserActivity);
  //     clearTimeout(inactivityTimeout);
  //   };
  // }, []);

  return (
    <div className="h-dvh overflow-hidden">
      <SEO
        title={'Foundation'}
        description={'A revolutionary new social platform. Own your data. Get rewarded.'}
        url={import.meta.env.VITE_CLIENT_URL}
        image={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
        type={'website'}
      />
      <Router />
      {/* <MaintenanceRouter /> */}
      <Toaster position="top-right" expand={true} theme={persistedTheme === 'dark' ? 'dark' : 'light'} richColors />
    </div>
  );
}

export default App;
