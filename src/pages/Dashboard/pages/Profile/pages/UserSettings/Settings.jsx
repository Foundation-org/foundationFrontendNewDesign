import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { changeTheme } from '../../../../../../features/utils/utilsSlice';
import { signOut, updateUserSettings } from '../../../../../../services/api/userAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetFilters } from '../../../../../../features/sidebar/filtersSlice';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../../features/auth/authSlice';
import showToast from '../../../../../../components/ui/Toast';
import { getAskPassword, setAskPassword } from '../../../../../../features/profile/userSettingSlice';

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkState, setCheckState] = useState(localStorage.getItem('theme') === 'dark' ? true : false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [defaultSort, setDefaultSort] = useState(persistedUserInfo.userSettings.defaultSort || false);
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [askPasswordEverytime, setAskPasswordEverytime] = useState(getAskPasswordFromRedux);

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

  const { mutateAsync: handleSignout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      dispatch(resetFilters());
      dispatch(addUser(null));
      localStorage.clear();
      navigate('/signin');
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  const handleGuestSignout = async () => {
    navigate('/guest-signup');
  };

  const { mutateAsync: handleUserSettings } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']);
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  return (
    <>
      <div className="space-y-2 tablet:space-y-[15px]">
        {/* Change Theme */}
        <div className="mx-auto w-full">
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/display-settings.svg`}
                alt={'display settings'}
                className="h-[18.5px] w-[14.6px] tablet:h-[29px] tablet:w-6"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Display Settings
              </h1>
            </div>
          </div>
          <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
            <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
              <div>
                <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Dark Mode</h1>
                <p className="text-[8px] font-medium text-[#ACACAC] tablet:text-[16px]">Switch to Dark Mode</p>
              </div>
              <Switch
                checked={checkState}
                onChange={() => showToast('info', 'featureComingSoon')}
                // onChange={handleTheme}
                className={`${checkState ? 'bg-[#BEDEF4]' : 'bg-[#D9D9D9]'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    checkState
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
            </div>
          </div>
        </div>
        {/* Default Sort */}
        <div className="mx-auto w-full">
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/feed-settings.svg`}
                alt={'feed settings'}
                className="h-[18.5px] w-[14.6px] tablet:h-[29px] tablet:w-6"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Feed Settings
              </h1>
            </div>
          </div>
          <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
            <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
              <div className="">
                <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Default Sort</h1>
                <p className="text-[8px] font-medium text-[#ACACAC] tablet:text-[16px]">
                  Automatically sort results from highest to lowest
                </p>
              </div>
              <Switch
                checked={defaultSort}
                onChange={(e) => {
                  setDefaultSort(e);
                  handleUserSettings({ uuid: persistedUserInfo.uuid, darkMode: false, defaultSort: e });
                }}
                className={`${defaultSort ? 'bg-[#BEDEF4]' : 'bg-[#D9D9D9]'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${defaultSort ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'}`}
                />
              </Switch>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full">
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/encrypt.svg`}
                alt={'feed settings'}
                className="h-[18.5px] w-[14.6px] tablet:h-[29px] tablet:w-6"
              />
              <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
                Encryption Settings
              </h1>
            </div>
          </div>
          <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
            <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
              <div className="">
                <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Ask Password</h1>
                <p className="text-[8px] font-medium text-[#ACACAC] tablet:text-[16px]">
                  Ask for your password every time when encrypting or decrypting.
                </p>
              </div>
              <Switch
                checked={askPasswordEverytime}
                onChange={(e) => {
                  setAskPasswordEverytime(e);
                  dispatch(setAskPassword(e));
                }}
                className={`${askPasswordEverytime ? 'bg-[#BEDEF4]' : 'bg-[#D9D9D9]'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    askPasswordEverytime
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
      {/* Logout */}
      {persistedUserInfo.role === 'user' && (
        <Button
          variant="submit"
          className="mt-3 flex w-fit items-center gap-[5px] tablet:mt-4 tablet:gap-[10px]"
          onClick={() => {
            if (localStorage.getItem('isGuestMode')) {
              handleGuestSignout();
            } else {
              handleSignout();
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/logout-icon.svg`}
            alt="logout-icon"
            className="size-[14px] tablet:size-[25px]"
          />
          Logout
        </Button>
      )}
    </>
  );
};
