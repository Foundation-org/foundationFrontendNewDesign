import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userInfo, userInfoById } from '../../../services/api/userAuth';
import SidebarRight from './SidebarRight';
import { toast } from 'sonner';
import SidebarLeft from './SidebarLeft';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { hiddenPostFilters, updateSearch } from '../../../features/profile/hiddenPosts';
import { GrClose } from 'react-icons/gr';
import { sharedLinksFilters, updateSharedLinkSearch } from '../../../features/profile/sharedLinks';
import api from '../../../services/api/Axios';
import Anchor from '../../../components/Anchor';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('🚀 ~ DashboardLayout ~ location:', location);
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const getHiddenPostFilters = useSelector(hiddenPostFilters);
  const getSharedLinksFilters = useSelector(sharedLinksFilters);
  const [treasuryAmount, setTreasuryAmount] = useState(0);

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
  });

  const handleUserInfo = async () => {
    try {
      const resp = await getUserInfo();

      if (resp?.status === 200) {
        // Cookie Calling
        if (resp.data) {
          dispatch(addUser(resp?.data));
          localStorage.setItem('userData', JSON.stringify(resp?.data));
          // Set into local storage
          if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', resp.data.uuid);
          }
        }

        // LocalStorage Calling
        if (!resp.data) {
          const res = await userInfoById(localStorage.getItem('uuid'));
          dispatch(addUser(res?.data));
          if (res?.data?.requiredAction) {
            setModalVisible(true);
          }
        }

        if (resp?.data?.requiredAction) {
          setModalVisible(true);
        }
      }

      // setResponse(resp?.data);
    } catch (e) {
      console.log({ e });
      toast.error(e.response.data.message.split(':')[1]);
    }
  };

  const getTreasuryAmount = async () => {
    try {
      const res = await api.get(`/treasury/get`);
      if (res.status === 200) {
        localStorage.setItem('treasuryAmount', res.data.data);
        setTreasuryAmount(res.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  useEffect(() => {
    handleUserInfo();
    getTreasuryAmount();
  }, []);

  const handleGuestLogout = async () => {
    navigate('/guest-signup');
  };

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between laptop:flex-row">
        {/* Mobile TopBar */}
        {location.pathname !== '/dashboard' && (
          <div className="flex h-[43px] min-h-[43px] items-center justify-between bg-white px-5 tablet:hidden">
            <div className="h-fit rounded-[15px] bg-white dark:bg-[#000]">
              <div className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
                  alt="badge"
                  className="size-[25px]"
                />
                <div className="flex flex-col gap-1">
                  <h4 className="heading">Treasury</h4>
                  <p className="font-inter text-[8px] font-medium leading-[8px] text-[#616161] dark:text-[#D2D2D2]">
                    {treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX
                  </p>
                </div>
              </div>
            </div>

            <div className="h-fit rounded-[15px] bg-white dark:bg-[#000]">
              {persistedUserInfo.role !== 'user' ? (
                <div className="flex cursor-pointer items-center gap-2">
                  <div className="relative h-fit w-fit">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
                      alt="badge"
                      className="h-[25px] w-5"
                    />
                    <p className="transform-center absolute z-50 pb-[5px] text-[12px] font-medium leading-normal text-white tablet:pb-3 tablet:text-[20px]">
                      G
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="heading">Guest User</h4>
                    <p className="font-inter text-[8px] font-medium leading-[8px] text-[#616161] dark:text-[#D2D2D2]">
                      {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
                    </p>
                    {/* <div className="" onClick={handleGuestLogout}> */}
                    <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]" onClick={handleGuestLogout}>
                      Create Account
                    </Anchor>
                    {/* </div> */}
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
                      className="h-[25px] w-5"
                    />
                    <p className="absolute bottom-2 z-50 text-[9.5px] font-medium text-[#7A7016]">
                      {persistedUserInfo?.badges?.length}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="heading">My Balance</h4>
                    <p className="font-inter text-[8px] font-medium leading-[8px] text-[#616161] dark:text-[#D2D2D2]">
                      {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Desktop */}
        <div className="hidden tablet:block">
          <div className="my-5 ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
            <div className="flex items-center gap-[15px]">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
                alt="badge"
                className="size-[47px]"
              />
              <div className="flex flex-col gap-1">
                <h4 className="heading">Treasury</h4>
                <p className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                  <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span>
                </p>
              </div>
            </div>
          </div>
          {location.pathname !== '/dashboard/quest' &&
            location.pathname !== '/dashboard/profile' &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/profile/hidden-posts' &&
            location.pathname !== '/dashboard/profile/shared-links' &&
            location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/ledger' &&
            location.pathname !== '/quest/isfullscreen' &&
            location.pathname !== '/shared-links/result' &&
            !location.pathname.startsWith('/p/') && <SidebarLeft />}

          {/* HiddenPost Search */}
          {location.pathname === '/dashboard/profile/hidden-posts' && (
            <div className="my-5 ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
              <div className="relative">
                <div className="relative h-[45px] w-full">
                  <input
                    type="text"
                    id="floating_outlined"
                    className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                    value={getHiddenPostFilters.searchData}
                    placeholder=""
                    onChange={(e) => {
                      dispatch(updateSearch(e.target.value));
                    }}
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
            <div className="my-5 ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
              <div className="relative">
                <div className="relative h-[45px] w-full">
                  <input
                    type="text"
                    id="floating_outlined"
                    className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
                    value={getSharedLinksFilters.searchData}
                    placeholder=""
                    onChange={(e) => {
                      dispatch(updateSharedLinkSearch(e.target.value));
                    }}
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
        </div>

        {location.pathname !== '/dashboard/treasury' &&
          location.pathname !== '/dashboard/treasury/ledger' &&
          location.pathname !== '/dashboard/profile/ledger' &&
          children}
        {/* Right Side */}
        <div className="hidden tablet:block">
          <div className="mr-[31px] mt-5 hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] laptop:block dark:bg-[#000]">
            {persistedUserInfo.role !== 'user' ? (
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
                <div>
                  <h4 className="heading">Guest User</h4>
                  {persistedUserInfo?.balance && (
                    <div className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                      <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
                    </div>
                  )}
                  <div className="h-[10px]" onClick={handleGuestLogout}>
                    <Anchor className="cursor-pointer text-[#4A8DBD] dark:text-[#BAE2FF]">Create Account</Anchor>
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
                    {persistedUserInfo?.badges?.length}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="heading">My Balance</h4>
                  <div className="font-inter text-[10.79px] text-base font-medium text-[#616161] tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                    <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {location.pathname !== '/dashboard/quest' &&
            location.pathname !== '/dashboard/profile/ledger' &&
            location.pathname !== '/dashboard/treasury' &&
            location.pathname !== '/dashboard/treasury/ledger' && <SidebarRight />}
        </div>
      </div>
      {(location.pathname === '/dashboard/treasury' ||
        location.pathname === '/dashboard/treasury/ledger' ||
        location.pathname === '/dashboard/profile/ledger') &&
        children}
    </div>
  );
}
