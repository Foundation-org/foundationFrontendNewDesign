import { toast } from 'sonner';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { createGuestMode, userInfo } from '../../services/api/userAuth';

const GuestRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('jwt', resp.data.token);
      localStorage.setItem('uId', resp.data.uuid);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
    onSuccess: (res) => {
      dispatch(addUser(res.data));
    },
    onError: (error) => {
      console.error('Error fetching user info:', error);
    },
  });

  const createGuestAccount = async () => {
    await createGuest();
    await getUserInfo();
  };

  useEffect(() => {
    // If User not exist
    if (persistedUserInfo === null) {
      createGuestAccount();
    }
    // if User exist no matter guest/normal
    if (persistedUserInfo) {
      navigate(`/quest/post/${params}`);
    }
  }, [persistedUserInfo]);

  return (
    <div className="flex h-full min-h-screen justify-center bg-white pt-8 text-lg text-[#7C7C7C] dark:bg-black dark:text-[#B8B8B8]">
      Loading...
    </div>
  );
};

export default GuestRedirect;
