import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { changeTheme } from '../../../../../../features/utils/utilsSlice';
import { signOut, updateUserSettings } from '../../../../../../services/api/userAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetFilters } from '../../../../../../features/sidebar/filtersSlice';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../../features/auth/authSlice';
import showToast from '../../../../../../components/ui/Toast';
import { getAskPassword, setAskPassword } from '../../../../../../features/profile/userSettingSlice';
import SummaryCard from '../../../../../../components/SummaryCard';

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(persistedTheme === 'dark' ? true : false);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [defaultSort, setDefaultSort] = useState(persistedUserInfo.userSettings.defaultSort || false);
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [askPasswordEverytime, setAskPasswordEverytime] = useState(getAskPasswordFromRedux);

  const handleTheme = () => {
    dispatch(changeTheme());
    setCheckState((prevCheckState) => {
      handleUserSettings({ uuid: persistedUserInfo.uuid, darkMode: !prevCheckState });
      return !prevCheckState;
    });
  };

  const { mutateAsync: handleSignout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      dispatch(resetFilters());
      dispatch(addUser(null));
      localStorage.clear();
      // localStorage.setItem('userExist', 'true');
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
        <SummaryCard headerIcon="/assets/svgs/display-settings.svg" headerTitle="Display Settings">
          <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
            <div>
              <h1 className="text-[10px] font-semibold text-[#707175] dark:text-gray-300 tablet:text-[20px]">
                Dark Mode
              </h1>
              <p className="text-[8px] font-medium text-[#ACACAC] dark:text-gray-300 tablet:text-[16px]">
                Switch to Dark Mode
              </p>
            </div>
            <Switch
              checked={checkState}
              onChange={handleTheme}
              className={`${checkState ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`switch_base ${
                  checkState ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'
                }`}
              />
            </Switch>
          </div>
        </SummaryCard>
        <SummaryCard headerIcon="/assets/svgs/feed-settings.svg" headerTitle="Feed Settings">
          <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
            <div className="">
              <h1 className="text-[10px] font-semibold text-[#707175] dark:text-gray-300 tablet:text-[20px]">
                Default Sort
              </h1>
              <p className="text-[8px] font-medium text-[#ACACAC] dark:text-gray-300 tablet:text-[16px]">
                Automatically sort results from highest to lowest
              </p>
            </div>
            <Switch
              checked={defaultSort}
              onChange={(e) => {
                setDefaultSort(e);
                handleUserSettings({ uuid: persistedUserInfo.uuid, defaultSort: e });
              }}
              className={`${defaultSort ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`switch_base ${defaultSort ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'}`}
              />
            </Switch>
          </div>
        </SummaryCard>
        <SummaryCard headerIcon="/assets/svgs/encrypt.svg" headerTitle="Encryption Settings">
          <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
            <div className="">
              <h1 className="text-[10px] font-semibold text-[#707175] dark:text-gray-300 tablet:text-[20px]">
                Ask Password
              </h1>
              <p className="text-[8px] font-medium text-[#ACACAC] dark:text-gray-300 tablet:text-[16px]">
                Ask for your password every time when encrypting or decrypting.
              </p>
            </div>
            <Switch
              checked={askPasswordEverytime}
              onChange={(e) => {
                setAskPasswordEverytime(e);
                dispatch(setAskPassword(e));
              }}
              className={`${askPasswordEverytime ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
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
        </SummaryCard>
      </div>
      {/* Logout */}
      {(persistedUserInfo.role === 'user' || persistedUserInfo?.role === 'visitor') && (
        <Button
          variant="submit"
          className="mt-3 flex w-fit items-center gap-[5px] tablet:mt-4 tablet:gap-[10px]"
          onClick={() => {
            if (localStorage.getItem('isGuestMode')) {
              handleGuestSignout();
            } else {
              handleSignout(persistedUserInfo.uuid);
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
