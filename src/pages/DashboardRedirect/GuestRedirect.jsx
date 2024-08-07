import { toast } from 'sonner';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { createGuestMode } from '../../services/api/userAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import showToast from '../../components/ui/Toast';

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
      console.log('err', err);
      navigate('/signin');
      toast.error(err?.response?.data?.message);
    },
  });

  useEffect(() => {
    localStorage.setItem('shared-post', location.pathname);
    if (persistedUserInfo === null) {
      createGuest();
    } else {
      navigate('/');
    }
  }, [persistedUserInfo, dispatch]);

  return (
    <div className="flex h-full min-h-screen justify-center bg-white pt-8 text-lg text-[#7C7C7C] dark:bg-black dark:text-[#B8B8B8]">
      Loading...
    </div>
  );
};

export default GuestRedirect;
