import { useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { legacy } from '../../../../../../constants/varification-badges';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { useState } from 'react';
import LegacyBadgePopup from '../../../../../../components/dialogue-boxes/LegacyBadgePopup';

const Privacy = ({ checkLegacyBadge, handleRemoveBadgePopup }) => {
  const persistedContants = useSelector(getConstantsValues);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);

  return (
    <div>
      <LegacyBadgePopup
        isPopup={isPersonalPopup}
        setIsPopup={setIsPersonalPopup}
        title="Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        placeholder="Answer Here"
        fetchUser={persistedUserInfo}
        setIsPersonalPopup={setIsPersonalPopup}
      />
      <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
        Add Privacy Badge to secure your foundation account.
      </h1>
      <div className="flex flex-col items-center justify-between pt-[10px] tablet:pt-[18.73px]">
        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {legacy.map((item, index) => (
            <div
              className="relative flex items-center justify-between gap-[8.5px] laptop:gap-2 desktop:gap-5"
              key={index}
            >
              <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
                {checkLegacyBadge() && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/secondary.svg`}
                    alt="primary"
                    className="size-[15px] tablet:size-[30px]"
                  />
                )}
              </div>
              <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
              <div
                className={` flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
              >
                <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                  {item.title}
                </h1>
              </div>
              <Button
                variant={checkLegacyBadge() ? 'verification-badge-remove' : 'submit'}
                // color={checkLegacyBadge() ? 'red' : 'blue'}
                disabled={item.disabled}
                onClick={() => {
                  checkLegacyBadge()
                    ? handleRemoveBadgePopup({
                        title: 'Password',
                        type: 'password',
                        image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
                        badgeType: 'password',
                      })
                    : setIsPersonalPopup(true);
                }}
              >
                {checkLegacyBadge() ? 'Remove' : 'Add'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkLegacyBadge() ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
