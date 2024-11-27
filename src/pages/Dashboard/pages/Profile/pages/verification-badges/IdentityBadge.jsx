import { useState } from 'react';
import { useSelector } from 'react-redux';
import { identityBadge } from '../../../../../../constants/varification-badges';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { Button } from '../../../../../../components/ui/Button';
import { CanAdd } from './badgeUtils';
import { toast } from 'sonner';
import IdentityBadgePopup from '../../../../../../components/dialogue-boxes/IdentityBadgePopup';

export default function IdentityBadge({
  isVerificationBadge = true,
  handleRemoveBadgePopup,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  getAskPassword,
  checkPseudoBadge,
  handleSkip,
  onboarding,
}) {
  const persistedContants = useSelector(getConstantsValues);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const checkSecondary = (itemType) =>
    persistedUserInfo?.badges?.some((i) => i.type === itemType && i.secondary === true);

  const [isPopup, setIsPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const checkIdentityBadge = (itemType) =>
    persistedUserInfo?.badges?.some((badge) => badge?.identity?.hasOwnProperty(itemType) || false) || false;

  return (
    <>
      <IdentityBadgePopup
        isPopup={isPopup}
        setIsPopup={setIsPopup}
        title={popupData?.title}
        logo={popupData?.logo}
        handleSkip={handleSkip}
        onboarding={onboarding}
      />
      {isVerificationBadge && (
        <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
          Linking your identity badge offers additional FDX transaction options.
        </h1>
      )}
      <div className="flex flex-col items-center gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {identityBadge.map((item, index) => (
          <div
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-[60%]' : ''}`}
            key={index}
          >
            {checkSecondary(item.type) && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/secondary.svg`}
                alt="secondary"
                className="size-[15px] tablet:size-[30px]"
              />
            )}
            <img
              src={item.image}
              alt={item.title}
              className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]"
            />
            <div
              className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-black dark:text-gray-400 tablet:text-[20px]">
                {item.title}
              </h1>
            </div>
            <Button
              variant={checkIdentityBadge(item.type) ? 'verification-badge-remove' : item.ButtonColor}
              onClick={async () => {
                if (
                  (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                  (checkLegacyBadge() && getAskPassword)
                ) {
                  const timeRemaining = CanAdd(persistedUserInfo, item.type, 'identity');
                  if (timeRemaining === true || checkPseudoBadge()) {
                    await handleOpenPasswordConfirmation();
                  } else {
                    toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
                    return;
                  }
                }

                if (checkIdentityBadge(item.type)) {
                  handleRemoveBadgePopup({
                    title: item.title,
                    image: item.image,
                    type: item.type,
                    badgeType: 'identity',
                  });
                } else {
                  setPopupData({
                    title: item.title,
                    logo: item.image,
                  });
                  setIsPopup(true);
                }
              }}
              disabled={item.disabled}
            >
              {checkIdentityBadge(item.type) ? 'Remove Badge' : item.ButtonText}
              {!checkIdentityBadge(item.type) && (
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                  (+{persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
