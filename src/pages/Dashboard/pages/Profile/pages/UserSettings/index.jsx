import React from 'react';
import { Settings } from './Settings';
import NotificationSettings from './NotificationSettings';
import { useSelector } from 'react-redux';

const UserSettings = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-[15px]">
      {/* Summary Section */}
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/settings-logo.svg`}
              alt={'badge'}
              className="h-[18.5px] w-[14.6px] tablet:h-[29px] tablet:w-[15px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Settings</h1>
          </div>
          {/* <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            3/10
          </h1> */}
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Customize your data organization with various sorting options and switch between dark/light themes for
            optimal viewing. Manage and personalize notifications to stay updated without distractions.
          </h1>
          {/* <div className="mt-[10px] flex items-center justify-center gap-2 tablet:mt-4 tablet:gap-6">
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Posts You’ve Shared
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">3</h5>
            </div>
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Total Shared Link Clicks
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">10</h5>
            </div>
            <div>
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Total post engagement
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">10</h5>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <NotificationSettings />
      <Settings />
    </div>
  );
};

export default UserSettings;
