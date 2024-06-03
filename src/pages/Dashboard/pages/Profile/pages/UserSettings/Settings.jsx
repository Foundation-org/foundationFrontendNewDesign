import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { changeTheme } from '../../../../../../features/utils/utilsSlice';
import { signOut, updateUserSettings } from '../../../../../../services/api/userAuth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetFilters } from '../../../../../../features/sidebar/filtersSlice';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../../features/auth/authSlice';

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkState, setCheckState] = useState(localStorage.getItem('theme') === 'dark' ? true : false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [defaultSort, setDefaultSort] = useState(persistedUserInfo.userSettings.defaultSort || false);

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
      toast.error(error.response.data.message.split(':')[1]);
    },
  });

  const handleGuestSignout = async () => {
    navigate('/guest-signup');
  };

  const { mutateAsync: handleUserSettings } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']);
      console.log('updateUserSettings', resp);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message.split(':')[1]);
    },
  });

  return (
    <div className="space-y-2 tablet:space-y-[15px]">
      <h1 className="text-[12px] font-semibold text-black tablet:text-[22px] tablet:font-medium">User Settings</h1>
      {/* Change Theme */}
      <div className="flex items-center justify-between rounded-[6.749px] border-[1.85px] border-[#DEE6F7] bg-[#FDFDFD] px-4 py-3 tablet:rounded-[15px] tablet:px-[30px] tablet:py-5">
        <div>
          <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Dark Mode</h1>
          <p className="hidden text-[16px] font-medium text-[#ACACAC] tablet:block">Switch to Dark Mode</p>
        </div>
        <Switch
          checked={checkState}
          onChange={() => toast.info('Feature coming soon.')}
          // onChange={handleTheme}
          className={`${checkState ? 'bg-[#BEDEF4]' : 'bg-[#D9D9D9]'} switch_basic_design`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${
              checkState ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'
            }
        pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out tablet:h-5 tablet:w-5`}
          />
        </Switch>
      </div>
      {/* Default Sort */}
      <div className="flex items-center justify-between rounded-[6.749px] border-[1.85px] border-[#DEE6F7] bg-[#FDFDFD] px-4 py-3 tablet:rounded-[15px] tablet:px-[30px] tablet:py-5">
        <div className="">
          <h1 className="text-[10px] font-semibold text-[#707175] tablet:text-[20px]">Default Sort</h1>
          <p className="hidden text-[16px] font-medium text-[#ACACAC] tablet:block">Enable Default Sort.</p>
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
            className={`${
              defaultSort ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'
            }
        pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out tablet:h-5 tablet:w-5`}
          />
        </Switch>
      </div>
      {/* Logout */}
      {persistedUserInfo.role === 'user' && (
        <Button
          variant="submit"
          className="flex items-center gap-[5px] tablet:gap-[10px]"
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
    </div>
  );
};
