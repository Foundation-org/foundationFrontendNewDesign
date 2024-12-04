import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomepageBadgePopup from '../../components/dialogue-boxes/HomepageBadgePopup';
import { useSelector } from 'react-redux';

export default function ProfileCard({ profile }: any) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const getBadgeImageUrl = (badge: any): string | null => {
    const baseUrl = import.meta.env.VITE_S3_IMAGES_PATH;

    if (badge?.isAdded) {
      if (badge.type === 'personal') {
        return `${baseUrl}/assets/profile/personal.svg`;
      }
      if (badge.type === 'work') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`;
      }
      if (badge.type === 'cell-phone') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`;
      }
      if (badge.details?.provider === 'twitter') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`;
      }
      if (badge.details?.provider === 'linkedin') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`;
      }
      if (badge.details?.provider === 'facebook') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`;
      }
      if (badge.details?.provider === 'github') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`;
      }
      if (badge.details?.provider === 'farcaster') {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`;
      }
      if (badge.personal?.dateOfBirth) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`;
      }
      if (badge.personal?.currentCity) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`;
      }
      if (badge.personal?.homeTown) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`;
      }
      if (badge.personal?.relationshipStatus) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationship.svg`;
      }
      if (badge.personal?.education) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`;
      }
      if (badge.personal?.work) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`;
      }
      if (badge.personal?.sex) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`;
      }
      if (badge.personal?.geolocation) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Geolocation-2x-1.png`;
      }
      if (badge.personal?.identity) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/identity.svg`;
      }
      if (badge.web3) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Ethereum-Wallet-2x.png`;
      }
      if (badge.personal?.linkHub) {
        return `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/linkhub.svg`;
      }
    }

    return null;
  };

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
        <div className="flex flex-col gap-2 text-[#7C7C7C] dark:text-[#f1f1f1] tablet:gap-4">
          <div>
            <h1 className="text-[14px] font-semibold tablet:text-[20px]"> {profile?.domain.title}</h1>
            <p className="text-[12px] leading-normal tablet:text-[16px]"> {profile?.domain.name}.on.foundation</p>
            {/* <div className="mt-1 flex flex-wrap gap-1 tablet:mt-2 tablet:gap-2 mt-2 flex -space-x-4 rtl:space-x-reverse"> */}
            <div className="mt-1 flex flex-wrap gap-1 tablet:mt-2 tablet:gap-2">
              {persistedUserInfo?.badges
                ?.filter(
                  (badge: any) =>
                    !badge.pseudo &&
                    !badge.personal?.firstName &&
                    !badge.personal?.lastName &&
                    !badge.personal?.['security-question'] &&
                    !badge.domain
                )
                ?.map((badge: any, index: number) => {
                  const badgeImageUrl = getBadgeImageUrl(badge);

                  return (
                    <>
                      {badgeImageUrl && (
                        <img
                          key={badge._id || index}
                          src={badgeImageUrl}
                          alt={`${index}`}
                          className="size-4 rounded-full tablet:size-8"
                        />
                      )}
                    </>
                  );
                })}
            </div>
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
      <p className="text-[11px] leading-normal text-[#7C7C7C] dark:text-[#f1f1f1] tablet:text-[18px]">
        {profile?.domain.description}
      </p>
    </div>
  );
}
