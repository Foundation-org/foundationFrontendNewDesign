import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { createGuestMode } from '../../services/api/userAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import FallbackLoading from '../../components/FallbackLoading';

const GuestRedirect = ({ redirectUrl }) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('jwt', resp.data.token);
      localStorage.setItem('uuid', resp.data.uuid);
      localStorage.setItem('userData', JSON.stringify(resp.data));
      dispatch(addUser(resp.data));
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    },
    onError: (err) => {
      localStorage.setItem('shared-post', location.pathname);
      navigate('/signin');
    },
  });

  useEffect(() => {
    if (persistedUserInfo === null) {
      createGuest();
    } else {
      navigate('/');
    }
  }, [persistedUserInfo, dispatch]);

  return <FallbackLoading />;
};

export default GuestRedirect;
