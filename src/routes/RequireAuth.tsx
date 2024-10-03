import { useEffect } from 'react';
import { addUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilters } from '../features/sidebar/filtersSlice';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { createGuestMode } from '../services/api/userAuth';
import { useMutation } from '@tanstack/react-query';

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUser = useSelector((state: any) => state.auth.user);

  const isRoleAllowed = allowedRoles.includes(persistedUser?.role);

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp: any) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('jwt', resp.data.token);
      localStorage.setItem('uuid', resp.data.uuid);
      localStorage.setItem('userData', JSON.stringify(resp.data));
      dispatch(addUser(resp.data));
      navigate(-1);
      // if (redirectUrl) {
      // }
    },
    onError: (err: any) => {
      console.log('user', err?.response?.data?.user);

      localStorage.setItem('shared-post', location.pathname);
      localStorage.setItem('uuid', err?.response?.data?.user?.uuid);

      dispatch(addUser(err?.response?.data?.user));
      navigate(-1);
      // if (redirectUrl) {
      // navigate('/');
      // }
    },
  });

  useEffect(() => {
    if (!persistedUser || persistedUser === null) {
      // localStorage.clear();
      // navigate('/');
      createGuest();
    } else if (persistedUser?.isPasswordEncryption && !localStorage.getItem('legacyHash')) {
      localStorage.clear();
      dispatch(resetFilters());
      dispatch(addUser(null));
      navigate('/');
    }
  }, [persistedUser]);

  return isRoleAllowed ? <Outlet /> : <Navigate to="/" />;
};

export default RequireAuth;
