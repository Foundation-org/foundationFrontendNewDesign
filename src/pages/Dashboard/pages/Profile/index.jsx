import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from '../../../../features/utils/utilsSlice';
import Topbar from '../../components/Topbar';
import Tabs from './components/Tabs';
import { toast } from 'sonner';
import api from '../../../../services/api/Axios';
import FallBack from '../../../ErrorBoundry/FallBack';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import { useMutation } from '@tanstack/react-query';
import { userInfo } from '../../../../services/api/userAuth';
import { addUser } from '../../../../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const { showBoundary } = useErrorBoundary();

  const [checkState, setCheckState] = useState(localStorage.getItem('theme') === 'dark' ? true : false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedTab, setSelectedTab] = useState(pathname);
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  // const [treasuryAmount, setTreasuryAmount] = useState(0);

  useEffect(() => {
    setSelectedTab(pathname);
  }, [pathname]);

  useEffect(() => {
    if (persistedTheme === 'light') {
      setCheckState(false);
      localStorage.setItem('theme', 'light');
    } else {
      setCheckState(true);
      localStorage.setItem('theme', 'dark');
    }
  }, [persistedTheme]);

  const handleTheme = () => {
    dispatch(changeTheme());
    setCheckState((prevCheckState) => !prevCheckState);
  };

  const handleSelectedTab = (id) => setSelectedTab(id);

  // const getTreasuryAmount = async () => {
  //   try {
  //     const res = await api.get(`/treasury/get`);
  //     if (res.status === 200) {
  //       localStorage.setItem('treasuryAmount', res.data.data);
  //       setTreasuryAmount(res.data.data);
  //     }
  //   } catch (error) {
  //     showBoundary(error);
  //     toast.error(error.response.data.message.split(':')[1]);
  //   }
  // };
  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
    onSuccess: (resp) => {
      if (resp?.status === 200) {
        if (resp.data) {
          dispatch(addUser(resp.data));
        }
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

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
    getUserInfo();
    getTreasuryAmount();
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={FallBack}
      onError={(error, errorInfo) => {
        console.log(error);
      }}
    >
      <div className="h-[calc(100vh-58px)] w-full overflow-y-scroll bg-[#F3F3F3] tablet:h-[calc(100vh-70px)] dark:bg-[#242424]">
        <div className="mx-[18px] mt-[10px] flex items-center justify-between tablet:mx-8 tablet:mt-[25px] laptop:mx-[110px]">
          <div className="flex w-full items-center justify-between gap-[5.16px] tablet:gap-[15px] laptop:gap-[19.4px]">
            <div className="flex items-center gap-[5.16px] tablet:gap-[15px]">
              <div
                style={{
                  background:
                    persistedUserInfo.role !== 'user'
                      ? 'url(/assets/svgs/dashboard/guestBadge.svg)'
                      : 'url(/assets/svgs/dashboard/MeBadge.svg)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                }}
                className="relative flex h-[25px] w-5 items-center justify-center bg-cover bg-no-repeat tablet:h-12 tablet:w-10 laptop:h-16 laptop:w-[51px]"
              >
                <p className="transform-center absolute z-50 pb-[7px] text-[11px] font-medium leading-normal text-[#7A7016] tablet:pb-3 tablet:text-[25px]">
                  {persistedUserInfo?.badges?.length}
                </p>
              </div>
              <div className="flex flex-col gap-0 tablet:gap-[5px]">
                <h4 className="heading">My Balance</h4>
                <div className="font-inter mt-[-4px] flex gap-1 text-[10px] font-medium text-[#616161] tablet:text-[18px] tablet:text-base dark:text-[#D2D2D2]">
                  <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
                </div>
              </div>
            </div>
            <div className="flex gap-[5.16px] tablet:gap-[15px]">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
                alt="badge"
                className="h-[26px] w-[26px] tablet:h-12 tablet:w-12 laptop:h-16  laptop:w-16"
              />
              <div className="flex flex-col justify-center">
                <h4 className="heading">Treasury</h4>
                <p className="whitespace-nowrap text-[8px] font-normal leading-[8px] text-[#616161] tablet:text-[15px] tablet:leading-[15px] laptop:text-[18px] laptop:leading-[18px] dark:text-white">
                  <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span>
                </p>
              </div>
            </div>

            {/* <div>
              <h4 className="heading">My Profile</h4>
              <div className="flex items-center gap-1 tablet:gap-[13px]">
                <p className="text-[8px] font-medium leading-none text-[#7C7C7C] tablet:text-[15px] laptop:text-[18px] dark:text-white">
                  Version 1.6.98
                </p>
               <p className="text-[8px] dark:text-white tablet:text-[16px]">Light</p>
              <Switch
                checked={checkState}
                onChange={handleTheme}
                className={`${checkState ? 'bg-[#CBCCCD]' : 'bg-[#BEDEF4]'}
      relative inline-flex h-[10.78px] w-[20.53px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 tablet:h-[25px] tablet:w-12`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    checkState
                      ? 'translate-x-[9px] bg-[#565D62] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#4A8DBD]'
                  }
        pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out tablet:h-5 tablet:w-5`}
                />
              </Switch>
              <p className="text-[8px] dark:text-white tablet:text-[16px]">Dark</p> 
              </div>
            </div> */}
          </div>
          {/* <div className="flex gap-[5.16px] tablet:gap-[15px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
              alt="badge"
              className="h-[26px] w-[26px] tablet:h-12 tablet:w-12 laptop:h-16  laptop:w-16"
            />
            <div className="flex flex-col justify-center">
              <h4 className="heading">Treasury</h4>
              <p className="whitespace-nowrap text-[8px] font-normal leading-[8px] text-[#616161] tablet:text-[15px] tablet:leading-[15px] laptop:text-[18px] laptop:leading-[18px] dark:text-white">
                <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span>
              </p>
            </div>
          </div> */}
        </div>
        <Tabs handleSelectedTab={handleSelectedTab} active={selectedTab} />
        <Outlet />
      </div>
    </ErrorBoundary>
  );
};

export default Profile;
