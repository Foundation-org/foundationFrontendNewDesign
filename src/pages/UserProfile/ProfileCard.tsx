import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';
import HomepageBadgePopup from '../../components/dialogue-boxes/HomepageBadgePopup';

export default function ProfileCard({ profile }: any) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);

  return (
    <div className="relative mx-auto flex w-full max-w-[730px] flex-col items-center gap-[14px] rounded-[13.84px] border-2 border-[#D9D9D9] bg-white p-[18px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-4 tablet:p-5">
      <div className="flex w-full items-center gap-[14px] tablet:gap-6">
        <div>
          <div
            className="relative flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-[5px] border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px]"
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
              className="size-[50px] rounded-full object-cover tablet:size-[175px]"
            />
          </div>
          <div>
            <p className="whitespace-nowrap text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#f1f1f1] tablet:text-[16px]">
              Profile Viewers
            </p>
            <p className="text-center text-[8px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#f1f1f1] tablet:text-[16px]">
              {profile?.domain.viewers}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[#7C7C7C] dark:text-[#f1f1f1] tablet:gap-4">
          <div>
            <h1 className="text-[12px] font-semibold tablet:text-[20px]"> {profile?.domain.title}</h1>
            <p className="text-[10px] leading-normal tablet:text-[16px]"> {profile?.domain.name}</p>
          </div>
          <p className="text-[11px] leading-normal tablet:text-[18px]">{profile?.domain.description}</p>
        </div>
        {!isPublicProfile && (
          <>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/editIcon.svg`}
              alt="Edit Icon"
              className="absolute right-4 top-4 h-[12px] w-[12px] cursor-pointer tablet:h-[23px] tablet:w-[23px]"
              onClick={() => {
                setIsPersonalPopup(true);
              }}
            />
            {isPersonalPopup && (
              <HomepageBadgePopup
                isPopup={isPersonalPopup}
                setIsPopup={setIsPersonalPopup}
                title="Domain Badge"
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
      {!isPublicProfile && (
        <div className="flex w-full items-center justify-end">
          <Link to={`/h/${profile?.domain.name}`}>
            <Button variant="submit">View as public</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
