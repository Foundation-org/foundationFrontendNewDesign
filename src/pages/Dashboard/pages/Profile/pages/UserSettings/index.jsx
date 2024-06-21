import React from 'react';
import { Settings } from './Settings';
import NotificationSettings from './NotificationSettings';
import { useSelector } from 'react-redux';

const UserSettings = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="mx-4 space-y-2 pb-6 tablet:mx-6 tablet:space-y-[15px]">
      {/* Summary Section */}
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/settings-logo.svg`}
              alt={'badge'}
              className="h-[18.5px] w-[14.6px] tablet:h-[29px] tablet:w-6"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">User Settings</h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Customize your data organization with various sorting options and switch between dark/light themes for
            optimal viewing. Manage and personalize notifications to stay updated without distractions.
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <NotificationSettings />
      <Settings />
    </div>
  );
};

export default UserSettings;
