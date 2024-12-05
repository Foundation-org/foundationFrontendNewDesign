import { useState } from 'react';
import BadgeHubDetails from '../../components/dialogue-boxes/BadgeHubDetails';
import { contactBadges, personalBadges, socialBadges } from '../../constants/badge-hub';

export default function BadgeHub({ badges }: any) {
  const [isBadgeHubPopup, setIsBadgeHubPopup] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('');

  const linkBadgesArray = socialBadges
    ?.filter(
      (badge: any) => badges && badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded)
    )
    .map((badge: any) => {
      const userBadge = badges && badges?.find((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded);
      return {
        ...badge,
        userBadgeData: userBadge,
      };
    });

  const personalBadgesArray = contactBadges
    ?.filter(
      (badge: any) => badges && badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded)
    )
    .map((badge: any) => {
      const userBadge = badges && badges?.find((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded);
      return {
        ...badge,
        userBadgeData: userBadge,
      };
    });

  console.log(
    'first',
    personalBadgesArray.map((item) => item)
  );

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
        <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
          Social
        </h1>
        <div className="flex gap-2 tablet:gap-4">
          {linkBadgesArray?.map((badge: any) => (
            <button key={badge.id}>
              <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
        <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
          Contacts
        </h1>
        <div className="flex gap-2 tablet:gap-4">
          {personalBadgesArray &&
            personalBadgesArray?.map((badge: any) => (
              <a
                key={badge.id}
                href={
                  Array.isArray(badge.userBadgeData.details?.emails) && badge.userBadgeData.details.emails[0]?.value
                    ? `mailto:${badge.userBadgeData.details.emails[0].value}`
                    : '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  const emails = badge.userBadgeData.details?.emails;
                  if (Array.isArray(emails) && emails[0]?.value) {
                    console.log(emails[0].value); // Debug email
                  } else {
                    e.preventDefault(); // Prevent navigation if email is invalid
                    console.error('Email is missing or invalid');
                  }
                }}
              >
                <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
              </a>
            ))}
        </div>
      </div>
      <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
        <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
          Personal
        </h1>
        <div className="flex flex-wrap gap-2 tablet:gap-4">
          {personalBadges
            ?.filter((badge: any) =>
              badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded)
            )
            .map((badge: any) => (
              <button
                key={badge.id}
                onClick={() => {
                  setSelectedBadge(badge.type);
                  setIsBadgeHubPopup(true);
                }}
              >
                <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
              </button>
            ))}
        </div>
      </div>
      {isBadgeHubPopup && (
        <BadgeHubDetails
          handleClose={() => setIsBadgeHubPopup(false)}
          modalVisible={isBadgeHubPopup}
          title={'View Badge Info'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          selectedBadge={selectedBadge}
          badges={badges}
        />
      )}
    </div>
  );
}
