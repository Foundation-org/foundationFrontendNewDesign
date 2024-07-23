import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { resetFilters } from '../features/sidebar/filtersSlice';
import { addUser } from '../features/auth/authSlice';

const RequireAuth = ({ allowedRoles }) => {
  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUser = useSelector((state) => state.auth.user);

  // console.log('Logged in as', persistedUser?.role, allowedRoles.includes(persistedUser?.role));

  const isRoleAllowed = allowedRoles.includes(persistedUser?.role);

  useEffect(() => {
    if (!persistedUser) {
      localStorage.clear();
      navigate('/');
    } else if (persistedUser?.isPasswordEncryption && !localStorage.getItem('legacyHash')) {
      localStorage.clear();
      dispatch(resetFilters());
      dispatch(addUser(null));
      navigate('/signin');
    }
  }, [persistedUser]);

  return isRoleAllowed ? <Outlet /> : <Navigate to="/help/about" />;
};

export default RequireAuth;
