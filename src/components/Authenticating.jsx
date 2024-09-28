import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authSuccess } from '../services/api/authentication';
import { useLocation, useNavigate } from 'react-router-dom';
import { addUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAskPassword } from '../features/profile/userSettingSlice';
import api from '../services/api/Axios';
import showToast from './ui/Toast';
import LegacyConfirmationPopup from './dialogue-boxes/LegacyConfirmationPopup';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import * as homeFilterActions from '../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../features/sidebar/bookmarkFilterSlice';

const Authenticating = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const legacyPromiseRef = useRef();
  const [uuid, setUuid] = useState();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState(false);

  let filtersActions;
  if (location.pathname === '/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  const redirectTo = localStorage.getItem('target-url');
  const url = new URL(redirectTo);
  const pathname = url.pathname;

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

  const initializeFilters = (userData) => {
    dispatch(filtersActions.setFilterByScope(userData?.States.filterByScope));
    dispatch(filtersActions.setFilterBySort(userData?.States.filterBySort));
    dispatch(filtersActions.setFilterByStatus(userData?.States.filterByStatus));
    dispatch(filtersActions.setFilterByType(userData?.States.filterByType));
    dispatch(filtersActions.setFilterByMedia(userData?.States.filterByMedia));
    dispatch(filtersActions.setExpandedView(true));
    dispatch(filtersActions.setBookmarks(userData?.States.bookmarks));
    dispatch(filtersActions.setSearchData(userData?.States.searchData));
    dispatch(filtersActions.setBlockTopics(userData?.States.topics?.Block.list));
    dispatch(
      filtersActions.setRatings({
        initial: userData?.States.moderationRatingFilter?.initial
          ? userData?.States.moderationRatingFilter?.initial
          : 0,
        final: userData?.States.moderationRatingFilter?.final ? userData?.States.moderationRatingFilter?.final : 0,
      }),
    );
    localStorage.setItem('selectedButtonId', userData?.States.selectedBtnId);
  };

  // Google
  const handleSignUpSocialGuest = async (data) => {
    if (persistedUserInfo?.role === 'user') return;

    try {
      data.uuid = localStorage.getItem('uuid');
      const res = await api.post(`/user/signUpSocial/guestMode`, data);
      if (res.status === 200) {
        initializeFilters(res.data);
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));
        dispatch(setAskPassword(false));
        if (localStorage.getItem('shared-post') !== '' && localStorage.getItem('shared-post') !== null) {
          navigate(localStorage.getItem('shared-post'));
          localStorage.clearItem('shared-post');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      if (error.response.data.message.split(':')[1].trim() === 'Email Already Exist') {
        toast.error(
          <p>
            Email Already Exist{' '}
            <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/')}>
              Sign in
            </span>{' '}
          </p>,
        );
      } else {
        showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      }
      navigate(pathname);
    }
  };

  // Linkedin, Github, Facebook .....
  const handleSignUpGuestSocialBadges = async (data, provider) => {
    if (persistedUserInfo?.role === 'user') return;

    try {
      data.uuid = localStorage.getItem('uuid');
      data.type = provider;
      const res = await api.post(`/user/signUpGuest/SocialBadges`, { data, type: provider });
      if (res.status === 200) {
        initializeFilters(res.data);
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userData', JSON.stringify(res.data));
        localStorage.removeItem('isGuestMode');
        dispatch(addUser(res.data));
        dispatch(setAskPassword(false));
        if (localStorage.getItem('shared-post') !== '' && localStorage.getItem('shared-post') !== null) {
          navigate(localStorage.getItem('shared-post'));
          localStorage.clearItem('shared-post');
        } else {
          navigate('/');
        }
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
          initializeFilters(res.data);
          localStorage.setItem('uuid', res.data.uuid);
          localStorage.setItem('userData', JSON.stringify(res.data));
          localStorage.removeItem('isGuestMode');
          dispatch(addUser(res.data));
          if (localStorage.getItem('shared-post') !== '' && localStorage.getItem('shared-post') !== null) {
            navigate(localStorage.getItem('shared-post'));
            localStorage.clearItem('shared-post');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message.split(':')[1].trim() === 'User not Found') {
        toast.error(
          <p>
            User not Found{' '}
            <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/signup')}>
              Create an Account
            </span>{' '}
          </p>,
        );
      } else {
        showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      }
    } finally {
      localStorage.removeItem('authMode');
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
      navigate(pathname);
    }
  };

  const handleAddBadge = async (data, provider) => {
    try {
      let id;
      if (provider === 'linkedin') {
        id = data.id;
      } else if (provider === 'instagram') {
        id = data.user_id;
      } else if (provider === 'facebook') {
        id = data.id;
      } else if (provider === 'twitter') {
        id = data.id;
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
      console.log('error', error);
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

  useEffect(() => {
    if (!isLoading && !isError && isSuccess) {
      if (localStorage.getItem('authMode') === 'Login') {
        handleSignInSocial(authSuccessResp.data.user, authSuccessResp.data.user.provider);
      } else if (pathname === '/profile/verification-badges') {
        if (authSuccessResp.data.user.provider === 'google') {
          handleAddContactBadge({ provider: authSuccessResp.data.user.provider, data: authSuccessResp.data.user });
        } else {
          handleAddBadge(authSuccessResp.data.user, authSuccessResp.data.user.provider);
        }
      } else {
        if (authSuccessResp.data.user.provider === 'google') {
          handleSignUpSocialGuest(authSuccessResp.data.user);
        } else {
          handleSignUpGuestSocialBadges(authSuccessResp.data.user, authSuccessResp.data.user.provider);
        }
      }
    } else if (isError) {
      navigate(pathname);
    }
  }, [isLoading, isError, isSuccess]);

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
      <div className="flex h-full min-h-screen justify-center bg-[#F5F5F5] text-lg text-[#7C7C7C] dark:bg-black dark:text-[#B8B8B8]">
        <div className="flex flex-col items-center justify-center gap-4">
          <FaSpinner className="animate-spin text-[10vw] text-blue-200 tablet:text-[4vw]" /> Authenticating User...
        </div>
      </div>
    </>
  );
};

export default Authenticating;
