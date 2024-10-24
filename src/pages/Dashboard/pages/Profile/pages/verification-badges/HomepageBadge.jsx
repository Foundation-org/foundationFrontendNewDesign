import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { homepageBadges } from '../../../../../../constants/varification-badges';
import PersonalBadgesPopup from '../../../../../../components/dialogue-boxes/PersonalBadgesPopup';
import { toast } from 'sonner';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { Button } from '../../../../../../components/ui/Button';
import { CanAdd } from './badgeUtils';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import api from '../../../../../../services/api/Axios';
import HomepageBadgePopup from '../../../../../../components/dialogue-boxes/HomepageBadgePopup';

export default function HomepageBadge({
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  handlePasskeyConfirmation,
  getAskPassword,
  checkPseudoBadge,
}) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);

  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [seletedPersonalBadge, setSelectedPersonalBadge] = useState('');
  const [edit, setEdit] = useState(false);

  //   const checkPersonalBadge = (itemType) =>
  //     persistedUserInfo?.badges?.some((badge) => badge?.personal?.hasOwnProperty(itemType) || false) || false;

  const checkDomainBadge = () => {
    return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
  };

  const handleClickPesonalBadges = async (type, edit) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      const timeRemaining = CanAdd(persistedUserInfo, type, 'personal');
      if (timeRemaining === true || checkPseudoBadge()) {
        // if ((checkLegacyBadge() && !localStorage.getItem('legacyHash')) || (checkLegacyBadge() && getAskPassword))
        //   await handleOpenPasswordConfirmation();

        if (edit) {
          setEdit(true);
        } else {
          setEdit(false);
        }
        setIsPersonalPopup(true);
        setSelectedPersonalBadge(type);
      } else {
        toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
      }
    }
  };

  const renderPersonalBadgesPopup = () => {
    if (!isPersonalPopup) {
      return null;
    }

    switch (seletedPersonalBadge) {
      case 'domainBadge':
        return (
          <HomepageBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Domain Badge"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
            edit={edit}
            setEdit={setEdit}
            fetchUser={persistedUserInfo}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      default:
        return null;
    }
  };

  const PersonalItem = ({ item, persistedTheme, handleClickPesonalBadges }) => (
    <div
      className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
    >
      <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
      <div
        className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
      >
        <h1 className="text-[2.11vw] font-medium leading-normal text-black dark:text-gray-400 tablet:text-[20px]">
          {item.title}
        </h1>
      </div>

      <Button
        variant={checkDomainBadge() ? 'verification-badge-edit' : item.ButtonColor}
        onClick={() => {
          handleClickPesonalBadges(item.type, checkDomainBadge() ? true : false);
        }}
        disabled={item.disabled}
      >
        {checkDomainBadge() ? 'Edit' : item.ButtonText}
        {!checkDomainBadge() && (
          <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
            (+{persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)
          </span>
        )}
      </Button>
    </div>
  );

  return (
    <>
      <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
        The more personal information you add, the stronger your data profile and the more FDX you earn.
      </h1>
      {renderPersonalBadgesPopup()}
      <div className="flex flex-col items-center justify-between gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {homepageBadges.map((item, index) => (
          <PersonalItem
            key={index}
            item={item}
            persistedTheme={persistedTheme}
            handleClickPesonalBadges={handleClickPesonalBadges}
          />
        ))}
      </div>
    </>
  );
}
