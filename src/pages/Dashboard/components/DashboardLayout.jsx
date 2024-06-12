import { toast } from 'sonner';
import { GrClose } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from '../../../utils/useDebounce';
import { addUser } from '../../../features/auth/authSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getConstants, userInfo, userInfoById } from '../../../services/api/userAuth';
import { hiddenPostFilters, updateSearch } from '../../../features/profile/hiddenPosts';
import { sharedLinksFilters, updateSharedLinkSearch } from '../../../features/profile/sharedLinks';
import { feedbackFilters, updateFeedbackSearch } from '../../../features/profile/feedbackSlice';
import SidebarLeft from './SidebarLeft';
import api from '../../../services/api/Axios';
import PopUp from '../../../components/ui/PopUp';
import SideNavbar from '../../../components/SideNavbar';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId } from '../../../features/quest/utilsSlice';
import MediaControls from '../../../components/MediaControls';
import SummarySidebar from '../pages/Profile/pages/summary/SummarySidebar';
import { saveConstants } from '../../../features/constants/constantsSlice';
import showToast from '../../../components/ui/Toast';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const getHiddenPostFilters = useSelector(hiddenPostFilters);
  const getSharedLinksFilters = useSelector(sharedLinksFilters);
  const getFeedbackFilters = useSelector(feedbackFilters);
  const [modalVisible, setModalVisible] = useState(false);
  const [hiddenSearch, setHiddenSearch] = useState('');
  const [sharedlinkSearch, setSharedlinkSearch] = useState('');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const questUtilsState = useSelector(getQuestUtils);
  const { data: constants, error: constantsError } = useQuery({
    queryKey: ['constants'],
    queryFn: getConstants,
  });

  console.log(constants);
  if (constantsError) {
    console.log(constantsError);
  }

  useEffect(() => {
    if (constants) {
      dispatch(saveConstants(constants));
    }
  }, [constants]);

  const {
    data: userInfoData,
    isSuccess: userInfoSuccess,
    isError: userInfoError,
  } = useQuery({
    queryKey: ['userInfo', localStorage.getItem('uuid')],
    queryFn: userInfo,
  });

  const { mutateAsync: getUserInfoById } = useMutation({
    mutationFn: userInfoById,
    onSuccess: (res) => {
      dispatch(addUser(res?.data));
      if (res?.data?.requiredAction) {
        setModalVisible(true);
      }
    },
    onError: (e) => {
      console.log({ e });
    },
  });

  useEffect(() => {
    if (userInfoError && !userInfoData?.data) {
      getUserInfoById();
    }
  }, [userInfoError, userInfoData, getUserInfoById]);

  useEffect(() => {
    // Handle userInfoData when successfully fetched
    if (userInfoSuccess && userInfoData?.status === 200) {
      if (userInfoData.data && userInfoData.data.role === 'user') {
        dispatch(addUser(userInfoData.data));
        // localStorage.setItem('userData', JSON.stringify(userInfoData.data));
        // Set into local storage
        if (!localStorage.getItem('uuid')) {
          localStorage.setItem('uuid', userInfoData.data.uuid);
        }
      }
      if (userInfoData?.data?.requiredAction) {
        setModalVisible(true);
      }
    }
  }, [userInfoSuccess, userInfoData, dispatch, setModalVisible]);

  const handleEmailType = async (value) => {
    try {
      if (!value) return showToast('warning', 'emailType');
      setModalVisible(false);
      const res = await api.patch(`/updateBadge/${persistedUserInfo._id}/${persistedUserInfo.badges[0]._id}`, {
        type: value,
        primary: true,
      });
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userLoggedIn', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('jwt', res.data.token);
        queryClient.invalidateQueries(['userInfo']);
        navigate('/dashboard');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1])
    }
  };

  // const handleGuestLogout = async () => {
  //   navigate('/guest-signup');
  // };

  // Hidden post Search
  const handleHiddenPostSearch = (e) => {
    setHiddenSearch(e.target.value);
  };

  const debouncedHiddenSearch = useDebounce(hiddenSearch, 1000);

  useEffect(() => {
    dispatch(updateSearch(debouncedHiddenSearch));
  }, [debouncedHiddenSearch]);

  useEffect(() => {
    if (getHiddenPostFilters.searchData === '') {
      setHiddenSearch('');
    }
  }, [getHiddenPostFilters.searchData]);

  // SharedLinks Posts Search
  const handleSharedLinkSearch = (e) => {
    setSharedlinkSearch(e.target.value);
  };

  const debouncedSharedSearch = useDebounce(sharedlinkSearch, 1000);

  useEffect(() => {
    dispatch(updateSharedLinkSearch(debouncedSharedSearch));
  }, [debouncedSharedSearch]);

  useEffect(() => {
    if (getSharedLinksFilters.searchData === '') {
      setSharedlinkSearch('');
    }
  }, [getSharedLinksFilters.searchData]);

  // Feedback Posts Search
  const handleFeedbackSearch = (e) => {
    setFeedbackSearch(e.target.value);
  };

  const debouncedFeedbackSearch = useDebounce(feedbackSearch, 1000);

  useEffect(() => {
    dispatch(updateFeedbackSearch(debouncedFeedbackSearch));
  }, [debouncedFeedbackSearch]);

  useEffect(() => {
    if (getFeedbackFilters.searchData === '') {
      setFeedbackSearch('');
    }
  }, [getFeedbackFilters.searchData]);

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PopUp
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email.svg`}
        title={'Email'}
        open={modalVisible}
        closeIcon={true}
      >
        <div className="flex flex-col items-center pb-[32px] pt-2">
          <p className="text-center text-[8px] font-semibold text-[#838383] tablet:text-[25px]">
            {persistedUserInfo?.email}
          </p>
          <p className="mb-[10px] mt-[10px] text-center text-[10px] font-medium text-[#838383] tablet:mb-[22px] tablet:mt-[14px] tablet:text-[25px]">
            Please select if this email is personal or professional.
          </p>
          <div className="flex items-center justify-center gap-[30px] tablet:gap-[65px]">
            <Button
              variant="personal-work"
              className="gap-2 tablet:gap-[15px]"
              onClick={() => handleEmailType('personal')}
            >
              <img
                className="h-[16.6px] w-[16.6px] tablet:h-10 tablet:w-10"
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/personal.svg`}
                alt="personal"
              />
              Personal
            </Button>
            <Button variant="personal-work" className="gap-2 tablet:gap-[15px]" onClick={() => handleEmailType('work')}>
              <img
                className="h-[16.6px] w-[16.6px] tablet:h-10 tablet:w-10"
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/work.svg`}
                alt="work"
              />{' '}
              Work
            </Button>
          </div>
        </div>
      </PopUp>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col justify-between laptop:flex-row">
        {/* Mobile TopBar */}
        <div className="flex h-[43px] min-h-[43px] items-center justify-between bg-[#DEE6F7] px-4 tablet:h-[80px] tablet:pr-[3.25rem] laptop:hidden">
          <div className="h-fit rounded-[15px]" onClick={() => navigate('/dashboard/treasury')}>
            {persistedUserInfo?.role !== 'user' ? (
              <div className="flex cursor-pointer items-center gap-2">
                <div className="relative h-fit w-fit">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
                    alt="badge"
                    className="h-[25px] w-5 tablet:size-[36px]"
                  />
                  <p className="transform-center absolute z-50 pb-[5px] text-[12px] font-medium leading-normal text-white tablet:pb-3 tablet:text-[20px]">
                    G
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="heading w-fit border-b">My Balance (Guest)</h4>
                  <p className="font-inter text-[8px] font-medium leading-[8px] text-[#616161] dark:text-[#D2D2D2]">
                    <p>{userInfoData && userInfoData?.data?.balance ? userInfoData.data?.balance.toFixed(2) : 0} FDX</p>
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => {
                  navigate('/dashboard/profile');
                }}
              >
                <div className="relative flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                    alt="badge"
                    className="h-[28px] w-[23px]"
                  />
                  <p className="absolute left-1/2 top-[40%] z-50 mb-1 -translate-x-1/2 -translate-y-1/2 transform text-[14px] font-medium leading-[14px] text-[#7A7016]">
                    {userInfoData && userInfoData?.data?.badges?.length}
                  </p>
                </div>
                <div className="flex h-7 flex-col justify-between">
                  <h4 className="heading w-fit border-b">My Balance</h4>
                  <p className="font-inter text-[11px] font-medium leading-[11px] text-[#616161] tablet:text-[16px] dark:text-[#D2D2D2]">
                    {userInfoData && userInfoData?.data?.balance ? userInfoData?.data?.balance.toFixed(2) : 0} FDX
                  </p>
                </div>
              </div>
            )}
          </div>
          {location.pathname !== '/dashboard/help/about' &&
            location.pathname !== '/dashboard/help/faq' &&
            location.pathname !== '/dashboard/help/contact-us' &&
            location.pathname !== '/dashboard/profile' &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/profile/hidden-posts' &&
            location.pathname !== '/dashboard/profile/shared-links' &&
            location.pathname !== '/dashboard/profile/user-settings' &&
            location.pathname !== '/dashboard/profile/post-activity' &&
            location.pathname !== '/dashboard/profile/verification-badges' &&
            location.pathname !== '/dashboard/profile/lists' &&
            location.pathname !== '/dashboard/profile/feedback' &&
            !location.pathname.startsWith('/dashboard/quest') &&
            location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/reward-schedule' &&
            location.pathname !== '/dashboard/treasury/buy-fdx' &&
            location.pathname !== '/dashboard/treasury/redemption-center' &&
            location.pathname !== '/dashboard/treasury/ledger' && (
              <>
                {persistedUserInfo?.role === 'user' && location.pathname !== '/' ? (
                  <div className="flex w-fit max-w-[18.75rem] items-center gap-[15px] tablet:ml-[31px] tablet:w-full tablet:justify-center laptop:flex-col">
                    <Button
                      variant="hollow-submit2"
                      className="bg-white tablet:w-full"
                      onClick={() => navigate('/dashboard/quest')}
                    >
                      Create Post
                    </Button>
                    <Button
                      variant="hollow-submit2"
                      className="bg-white tablet:w-full"
                      onClick={() => navigate('/dashboard/profile/verification-badges')}
                    >
                      Add Badge
                    </Button>
                  </div>
                ) : (
                  <Button variant="hollow-submit2" className="bg-white" onClick={() => navigate('/guest-signup')}>
                    Sign up
                  </Button>
                )}
              </>
            )}

          {persistedUserInfo?.role === 'user' && location.pathname.startsWith('/dashboard/profile') && (
            <div className="flex w-fit max-w-[18.75rem] items-center gap-[15px] tablet:ml-[31px] tablet:w-full tablet:justify-center laptop:flex-col">
              <Button
                variant="hollow-submit2"
                className="bg-white tablet:w-full"
                onClick={() => navigate('/dashboard/treasury')}
              >
                Treasury
              </Button>
            </div>
          )}

          {persistedUserInfo?.role === 'user' && location.pathname.startsWith('/dashboard/treasury') && (
            <div className="flex w-fit max-w-[18.75rem] items-center gap-[15px] tablet:ml-[31px] tablet:w-full tablet:justify-center laptop:flex-col">
              <Button
                variant="hollow-submit2"
                className="bg-white tablet:w-full"
                onClick={() => navigate('/dashboard/profile')}
              >
                My Profile
              </Button>
            </div>
          )}
        </div>

        {/* Desktop Left Side */}
        <div className="left-0 top-0 hidden tablet:block laptop:absolute">
          <div
            className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] cursor-pointer rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]"
            onClick={() => navigate('/dashboard/treasury')}
          >
            <div className="flex items-center gap-[15px]">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
                alt="badge"
                className="size-[47px]"
              />
              <div className="flex h-[47px] flex-col justify-between">
                <h4 className="heading w-fit border-b-2">Treasury</h4>
                <p className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                  <span>{constants ? (constants.TREASURY_BALANCE * 1)?.toFixed(2) : 0} FDX</span>
                </p>
              </div>
            </div>
          </div>

          {!location.pathname.startsWith('/dashboard/quest') &&
            location.pathname !== '/dashboard/profile' &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/profile/hidden-posts' &&
            location.pathname !== '/dashboard/profile/shared-links' &&
            location.pathname !== '/dashboard/profile/user-settings' &&
            location.pathname !== '/dashboard/profile/feedback' &&
            location.pathname !== '/dashboard/profile/post-activity' &&
            location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/reward-schedule' &&
            location.pathname !== '/dashboard/treasury/buy-fdx' &&
            location.pathname !== '/dashboard/treasury/redemption-center' &&
            location.pathname !== '/dashboard/treasury/ledger' &&
            location.pathname !== '/quest/isfullscreen' &&
            location.pathname !== '/shared-links/result' &&
            location.pathname !== '/dashboard/help/about' &&
            location.pathname !== '/dashboard/help/faq' &&
            location.pathname !== '/dashboard/help/contact-us' &&
            location.pathname !== '/help/about' &&
            location.pathname !== '/help/faq' &&
            location.pathname !== '/help/contact-us' &&
            !location.pathname.startsWith('/p/') &&
            !location.pathname.startsWith('/l/') &&
            !location.pathname.startsWith('/dashboard/profile/postsbylist/') &&
            location.pathname !== '/shared-list-link/result' &&
            location.pathname !== '/dashboard/profile/verification-badges' &&
            location.pathname !== '/dashboard/profile/lists' && <SidebarLeft />}

          {location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/reward-schedule' &&
            location.pathname !== '/dashboard/treasury/buy-fdx' &&
            location.pathname !== '/dashboard/treasury/redemption-center' &&
            location.pathname !== '/dashboard/treasury/ledger' &&
            location.pathname !== '/dashboard/help/about' &&
            location.pathname !== '/dashboard/help/faq' &&
            location.pathname !== '/dashboard/help/contact-us' &&
            // location.pathname !== '/dashboard/quest' &&
            !location.pathname.startsWith('/dashboard/quest') &&
            location.pathname !== '/dashboard/profile' &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/profile/hidden-posts' &&
            location.pathname !== '/dashboard/profile/shared-links' &&
            location.pathname !== '/dashboard/profile/user-settings' &&
            location.pathname !== '/dashboard/profile/post-activity' &&
            location.pathname !== '/dashboard/profile/feedback' &&
            location.pathname !== '/shared-list-link/result' &&
            !location.pathname.startsWith('/dashboard/profile/postsbylist/') &&
            location.pathname !== '/dashboard/profile/verification-badges' &&
            location.pathname !== '/dashboard/profile/lists' && <SideNavbar />}

          {questUtilsState.isShowPlayer &&
            location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/reward-schedule' &&
            location.pathname !== '/dashboard/treasury/buy-fdx' &&
            location.pathname !== '/dashboard/treasury/redemption-center' &&
            location.pathname !== '/dashboard/treasury/ledger' &&
            location.pathname !== '/dashboard/help/about' &&
            location.pathname !== '/dashboard/help/faq' &&
            location.pathname !== '/dashboard/help/contact-us' &&
            // location.pathname !== '/dashboard/quest' &&
            !location.pathname.startsWith('/dashboard/quest') &&
            location.pathname !== '/dashboard/profile' &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/profile/hidden-posts' &&
            location.pathname !== '/dashboard/profile/shared-links' &&
            location.pathname !== '/dashboard/profile/user-settings' &&
            location.pathname !== '/dashboard/profile/feedback' && (
              <div className="ml-[31px] mt-[30px] hidden max-w-[285px] laptop:block">
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                    alt="mediaCloseIcon"
                    className="absolute -right-3 -top-3 h-6 w-6 cursor-pointer text-black tablet:-right-[14px] tablet:-top-[18px] tablet:size-[33px] dark:text-white"
                    onClick={() => {
                      dispatch(setIsShowPlayer(false));
                      dispatch(setPlayingPlayerId(''));
                    }}
                  />
                </div>
                <MediaControls />
              </div>
            )}

          {/* {canAddPost !== 'true' && location.pathname.startsWith('/dashboard/profile/postsbylist/') && <ManageList />} */}

          {/* HiddenPost Search */}
          {location.pathname === '/dashboard/profile/hidden-posts' && (
            <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
              <div className="relative">
                <div className="relative h-[45px] w-full">
                  <input
                    type="text"
                    id="floating_outlined"
                    className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                    value={hiddenSearch}
                    placeholder=""
                    onChange={handleHiddenPostSearch}
                  />
                  <label
                    htmlFor="floating_outlined"
                    className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
                  >
                    Search
                  </label>
                </div>
                {getHiddenPostFilters.searchData && (
                  <button
                    className="absolute right-3 top-4"
                    onClick={() => {
                      dispatch(updateSearch(''));
                    }}
                  >
                    <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
                  </button>
                )}
                {!getHiddenPostFilters.searchData && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                    alt="search"
                    className="absolute right-3 top-4 h-4 w-4"
                  />
                )}
              </div>
            </div>
          )}

          {/* SharedLinks Search */}
          {location.pathname === '/dashboard/profile/shared-links' && (
            <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
              <div className="relative">
                <div className="relative h-[45px] w-full">
                  <input
                    type="text"
                    id="floating_outlined"
                    className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                    value={sharedlinkSearch}
                    placeholder=""
                    onChange={handleSharedLinkSearch}
                  />
                  <label
                    htmlFor="floating_outlined"
                    className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
                  >
                    Search
                  </label>
                </div>
                {getSharedLinksFilters.searchData && (
                  <button
                    className="absolute right-3 top-4"
                    onClick={() => {
                      dispatch(updateSharedLinkSearch(''));
                    }}
                  >
                    <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
                  </button>
                )}
                {!getSharedLinksFilters.searchData && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                    alt="search"
                    className="absolute right-3 top-4 h-4 w-4"
                  />
                )}
              </div>
            </div>
          )}

          {/* Feedback Search */}
          {location.pathname === '/dashboard/profile/feedback' && (
            <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
              <div className="relative">
                <div className="relative h-[45px] w-full">
                  <input
                    type="text"
                    id="floating_outlined"
                    className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                    value={feedbackSearch}
                    placeholder=""
                    onChange={handleFeedbackSearch}
                  />
                  <label
                    htmlFor="floating_outlined"
                    className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
                  >
                    Search
                  </label>
                </div>
                {getFeedbackFilters.searchData && (
                  <button
                    className="absolute right-3 top-4"
                    onClick={() => {
                      dispatch(updateFeedbackSearch(''));
                    }}
                  >
                    <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
                  </button>
                )}
                {!getFeedbackFilters.searchData && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                    alt="search"
                    className="absolute right-3 top-4 h-4 w-4"
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {children}
        {/* Desktop Right Side */}
        <div className="right-0 top-0 hidden tablet:block laptop:absolute">
          <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
            {persistedUserInfo?.role !== 'user' ? (
              <div className="flex cursor-pointer items-center gap-[15px]">
                <div className="relative h-fit w-fit">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
                    alt="badge"
                    className="tablet:h-[47px] tablet:w-[38px]"
                  />
                  <p className="transform-center absolute z-50 pb-3 text-[20px] font-medium leading-normal text-white">
                    G
                  </p>
                </div>
                <div className="flex h-[47px] flex-col justify-between">
                  <h4 className="heading w-fit border-b-2">My Balance (Guest)</h4>
                  <div className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                    <p>{userInfoData && userInfoData.data?.balance ? userInfoData.data?.balance.toFixed(2) : 0} FDX</p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex cursor-pointer items-center gap-[15px]"
                onClick={() => {
                  navigate('/dashboard/profile');
                }}
              >
                <div className="relative flex size-[47px] items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                    alt="badge"
                    className="tablet:h-[47px] tablet:w-[38px]"
                  />
                  <p className="transform-center absolute z-50 pb-3 text-[20px] font-medium leading-normal text-[#7A7016]">
                    {userInfoData && userInfoData?.data?.badges?.length}
                  </p>
                </div>
                <div className="flex h-[47px] flex-col justify-between">
                  <h4 className="heading w-fit border-b-2">My Balance</h4>
                  <div className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                    <p>
                      {userInfoData && userInfoData?.data?.balance ? userInfoData?.data?.balance.toFixed(2) : 0} FDX
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!location.pathname.startsWith('/dashboard/quest') &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/profile/post-activity' &&
            location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/reward-schedule' &&
            location.pathname !== '/dashboard/treasury/buy-fdx' &&
            location.pathname !== '/dashboard/treasury/redemption-center' &&
            location.pathname !== '/dashboard/treasury/ledger' &&
            location.pathname !== '/dashboard/help/about' &&
            location.pathname !== '/dashboard/help/faq' &&
            location.pathname !== '/dashboard/help/contact-us' &&
            location.pathname !== '/help/about' &&
            location.pathname !== '/help/faq' &&
            location.pathname !== '/help/contact-us' && <SummarySidebar userData={userInfoData?.data} />}
        </div>
      </div>
      {/* Mobile Children */}
      {/* {(location.pathname === '/dashboard/treasury' || location.pathname === '/dashboard/treasury/ledger') && children} */}
    </div>
  );
}
