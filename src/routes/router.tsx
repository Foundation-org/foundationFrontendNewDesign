import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import authRoutes from './authRoutes';
import guestRoutes from './guestRoutes';
import FallbackLoading from '../components/FallbackLoading';

const AppRouter = () => {
  const persistedUser = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [router, setRouter] = useState(createBrowserRouter(guestRoutes)); // Default to guest routes

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

  useEffect(() => {
    const routes = persistedUser?.uuid ? authRoutes : guestRoutes;
    setRouter(createBrowserRouter(routes)); // Update router whenever persistedUser changes
  }, [persistedUser]);

  return (
    <div className="relative">
      <RouterProvider router={router} />
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <FallbackLoading />
        </div>
      )}
    </div>
  );
};

export default AppRouter;
