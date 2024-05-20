import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  // const location = useLocation();
  const persistedUser = useSelector((state) => state.auth.user);

  // console.log('Logged in as', persistedUser?.role, allowedRoles.includes(persistedUser?.role));

  const isRoleAllowed = allowedRoles.includes(persistedUser?.role);

  return isRoleAllowed ? <Outlet /> : <Navigate to="/help/about" />;
};

export default RequireAuth;
