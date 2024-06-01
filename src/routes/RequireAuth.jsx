import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  // const location = useLocation();
  const navigate = useNavigate();
  const persistedUser = useSelector((state) => state.auth.user);

  // console.log('Logged in as', persistedUser?.role, allowedRoles.includes(persistedUser?.role));

  const isRoleAllowed = allowedRoles.includes(persistedUser?.role);

  useEffect(() => {
    if (!persistedUser) {
      localStorage.clear();
      navigate('/');
    }
  }, [persistedUser]);

  return isRoleAllowed ? <Outlet /> : <Navigate to="/help/about" />;
};

export default RequireAuth;
