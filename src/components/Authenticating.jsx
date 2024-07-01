import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authSuccess } from '../services/api/authentication';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/Axios';
import { addUser } from '../features/auth/authSlice';
import { setAskPassword } from '../features/profile/userSettingSlice';
import { useDispatch } from 'react-redux';
import showToast from './ui/Toast';
import LegacyConfirmationPopup from './dialogue-boxes/LegacyConfirmationPopup';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Authenticating = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uuid, setUuid] = useState();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);



  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState();

  const legacyPromiseRef = useRef();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const {
    data: authSuccessResp,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['authSuccess'],
    queryFn: authSuccess,
    enabled: token !== null,
  });

  // Google
  const handleSignUpSocialGuest = async (data) => {
    try {
      data.uuid = localStorage.getItem('uuid');
      const res = await api.post(`/user/signUpSocial/guestMode`, data);
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));
        dispatch(setAskPassword(false));
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      navigate(pathname);
    }
  };

  // Linkedin, Github, Facebook .....
  const handleSignUpGuestSocialBadges = async (data, provider) => {
    try {
      data.uuid = localStorage.getItem('uuid');
      data.type = provider;
      const res = await api.post(`/user/signUpGuest/SocialBadges`, { data, type: provider });
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));
        dispatch(setAskPassword(false));
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      navigate(pathname);
    }
  };
  // For signing in with all social Badges 
  const handleSignInSocial = async (data, provider) => {
    try {
      let res;
      if (provider === 'google') {
        res = await api.post(`/user/signInUser/social`, {
          data,
        });
      } else {
        res = await api.post(`/user/signInUser/socialBadges`, { data, type: provider });
      }
      if (res.data.isPasswordEncryption) {
        setUuid(res.data.uuid);
        await handleOpenPasswordConfirmation();
      } else {
        if (res.status === 200) {
          localStorage.setItem('uuid', res.data.uuid);
          localStorage.setItem('userData', JSON.stringify(res.data));
          localStorage.removeItem('isGuestMode');
          dispatch(addUser(res.data));
          navigate('/');
        }
      }
    } catch (error) {
      console.log({ error });
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      navigate(pathname);
    }
  };
  const handleAddContactBadge = async ({ provider, data }) => {
    try {
      let addBadge;

      data['provider'] = provider;
      data['type'] = localStorage.getItem('selectedBadge');
      data['uuid'] = localStorage.getItem('uuid');
      if (localStorage.getItem('legacyHash')) {
        data['infoc'] = localStorage.getItem('legacyHash');
      }
      addBadge = await api.post(`/addBadge/contact`, {
        ...data,
      });

      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }

    } catch (error) {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);

    } finally {
      navigate(pathname)
    }
  };

  const handleAddBadge = async (data, provider) => {
    console.log("came", provider, data);
    try {
      let id;
      if (provider === 'linkedin') {
        id = data.id;
      } else if (provider === 'instagram') {
        id = data.user_id;
      } else if (provider === 'facebook') {
        id = data.id;
      } else if (provider === 'twitter') {
        id = data.user.uid;
      } else if (provider === 'github') {
        id = data.id;
      } else if (provider === 'youtube') {
        id = data.items[0].id;
      }
      const payload = {
        data,
        provider,
        badgeAccountId: id,
        uuid: persistedUserInfo.uuid,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (error) {
      console.log("error", error);
      if (provider !== 'instagram') {
        showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      }
    } finally {
      navigate(pathname);

    }
  };


  if (isError) {
    console.log('error', error);
  }


  const redirectTo = localStorage.getItem('target-url');
  const url = new URL(redirectTo);
  const pathname = url.pathname;
  if (!isLoading && !isError && isSuccess) {

    console.log(authSuccessResp.data.user, authSuccessResp.data.user.provider);
    if (pathname === '/signin') {
      handleSignInSocial(authSuccessResp.data.user, authSuccessResp.data.user.provider)
    } else if (pathname === '/profile/verification-badges') {
      if (authSuccessResp.data.user.provider === 'google') {
        handleAddContactBadge({ provider: authSuccessResp.data.user.provider, data: authSuccessResp.data.user })
      } else {
        handleAddBadge(authSuccessResp.data.user, authSuccessResp.data.user.provider)
      }
    }
    else {

      if (authSuccessResp.data.user.provider === 'google') {
        handleSignUpSocialGuest(authSuccessResp.data.user);
      } else {
        handleSignUpGuestSocialBadges(authSuccessResp.data.user, authSuccessResp.data.user.provider);
      }
    }
  } else if (isError) {
    navigate(pathname);
  }

  const handleOpenPasswordConfirmation = () => {
    setIsPasswordConfirmation(true);
    return new Promise((resolve) => {
      legacyPromiseRef.current = resolve;
    });
  };


  return (
    <>
      <LegacyConfirmationPopup
        isPopup={isPasswordConfirmation}
        setIsPopup={setIsPasswordConfirmation}
        title="Confirm Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        legacyPromiseRef={legacyPromiseRef}
        login={true}
        uuid={uuid}
      />
      <div>Loading... </div>
    </>)
};

export default Authenticating;
