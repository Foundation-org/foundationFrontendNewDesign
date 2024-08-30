import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router } from './routes/route';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { signOut } from './services/api/userAuth';
import { resetFilters } from './features/sidebar/filtersSlice';
import { addUser } from './features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from './services/api/Axios';
import FallbackLoading from './components/FallbackLoading';
import showToast from './components/ui/Toast';
import { MaintenanceRouter } from './routes/maintenance';

function App() {
  // const [theme, setTheme] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Function to handle the event
    const handlePreloadError = () => {
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

  // useEffect(() => {
  //   if (persistedTheme === 'dark') {
  //     setTheme('dark');
  //   } else {
  //     setTheme('light');
  //   }
  // }, [persistedTheme]);

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

  useEffect(() => {
    if (persistedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [persistedTheme]);

  api.interceptors.response.use(
    function (response) {
      setIsMaintenance(false);
      return response;
    },
    function (error) {
      if (error.response.request.status === 503) {
        setIsMaintenance(true);
      } else {
        setIsMaintenance(false);
      }
      return Promise.reject(error);
    },
  );

  const { mutateAsync: handleSignout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      dispatch(resetFilters());
      dispatch(addUser(null));
      localStorage.clear();
      localStorage.setItem('userExist', 'true');
      navigate('/signin');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (persistedUserInfo?.tempLogout) {
      handleSignout(persistedUserInfo.uuid);
    }
  }, [persistedUserInfo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-dvh overflow-hidden">
      <Helmet>
        <script>
          {`
            window.prerenderReady = false;
          `}
        </script>
        <title>Foundation</title>
        <meta name="description" content="A revolutionary new social platform. Own your data. Get rewarded." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Foundation" />
        <meta property="og:description" content="A revolutionary new social platform. Own your data. Get rewarded." />
        <meta property="og:image" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Foundation" />
        <meta
          property="twitter:description"
          content="A revolutionary new social platform. Own your data. Get rewarded."
        />
        <meta property="twitter:image" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
      </Helmet>
      {/* <MaintenanceRouter /> */}
      {/* {isLoading && !location.pathname.includes('/embed') ? <FallbackLoading /> : <Router />} */}
      {/* {isMaintenance ? <MaintenanceRouter /> : <Router />} */}
      <div className="relative">
        <Router />
        {isLoading && !location.pathname.includes('/embed') && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
            <FallbackLoading />
          </div>
        )}
      </div>
      <Toaster
        position="top-right"
        expand={true}
        // theme={persistedTheme === 'dark' ? 'dark' : 'light'}
        richColors
      />
    </div>
  );
}

export default App;
