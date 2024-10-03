import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import authRoutes from './authRoutes';
import FallbackLoading from '../components/FallbackLoading';
// import guestRoutes from './guestRoutes';
// import { useSelector } from 'react-redux';

const AppRouter = () => {
  // const persistedUser = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === '/embed') {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <RouterProvider
        // key={persistedUser?.role}
        router={createBrowserRouter(authRoutes)}
        future={{ v7_startTransition: true }}
      />
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <FallbackLoading />
        </div>
      )}
    </div>
  );
};

export default AppRouter;
