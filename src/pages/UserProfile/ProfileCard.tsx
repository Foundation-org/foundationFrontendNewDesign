import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomepageBadgePopup from '../../components/dialogue-boxes/HomepageBadgePopup';

export default function ProfileCard({ profile }: any) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);

  return (
    <div className="relative mx-auto flex w-full max-w-[730px] flex-col gap-[14px] rounded-[13.84px] border-2 border-[#D9D9D9] bg-white p-[18px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-4 tablet:p-5">
      <div className="flex w-full items-center gap-[14px] tablet:gap-6">
        <div
          className="relative flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-2 border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px] tablet:border-[5px]"
          onClick={() => {
            setIsPersonalPopup(true);
          }}
        >
          {!isPublicProfile && (
            <button className="absolute bottom-0 flex h-[40%] w-full items-center justify-center rounded-b-full bg-[#FBFBFB]/50">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/camera.svg`}
                alt="save icon"
                className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[45px]"
              />
            </button>
          )}
          <img
            src={profile?.domain.s3Urls[0]}
            alt="s3 image url"
            className="size-full rounded-full object-cover tablet:size-[175px]"
          />
        </div>
        <div className="text-gray-1 flex flex-col gap-2 dark:text-[#f1f1f1] tablet:gap-4">
          <div>
            <h1 className="text-[14px] font-semibold tablet:text-[20px]"> {profile?.domain.title}</h1>
            <p className="text-[12px] leading-normal tablet:text-[16px]"> {profile?.domain.name}.on.foundation</p>
          </div>
        </div>
        {!isPublicProfile && (
          <>
            {isPersonalPopup && (
              <HomepageBadgePopup
                isPopup={isPersonalPopup}
                setIsPopup={setIsPersonalPopup}
                title="Domain"
                logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
                edit={true}
                setIsPersonalPopup={setIsPersonalPopup}
                handleSkip={null}
                onboarding={null}
                progress={null}
              />
            )}
          </>
        )}
      </div>
      <p className="text-gray-1 text-[11px] leading-normal dark:text-[#f1f1f1] tablet:text-[18px]">
        {profile?.domain.description}
      </p>
    </div>
  );
}
