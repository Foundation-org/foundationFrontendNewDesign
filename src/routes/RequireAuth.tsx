import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { resetFilters } from '../features/sidebar/filtersSlice';
import { addUser } from '../features/auth/authSlice';

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUser = useSelector((state: any) => state.auth.user);

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
