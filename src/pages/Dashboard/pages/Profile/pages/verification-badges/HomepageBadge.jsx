import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { homepageBadges, personal } from '../../../../../../constants/varification-badges';
import PersonalBadgesPopup from '../../../../../../components/dialogue-boxes/PersonalBadgesPopup';
import { toast } from 'sonner';
import api from '../../../../../../services/api/Axios';
import EducationBadgePopup from '../../../../../../components/dialogue-boxes/EducationBadgePopup';
import WorkBadgePopup from '../../../../../../components/dialogue-boxes/WorkBadgePopup';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { Button } from '../../../../../../components/ui/Button';
import { CanAdd } from './badgeUtils';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';

export default function HomepageBadge({
  fetchUser,
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

  const checkPersonalBadge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.personal?.hasOwnProperty(itemType) || false) || false;

  const handleClickPesonalBadges = async (type, edit) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      const timeRemaining = CanAdd(persistedUserInfo, type, 'personal');
      if (timeRemaining === true || checkPseudoBadge()) {
        if ((checkLegacyBadge() && !localStorage.getItem('legacyHash')) || (checkLegacyBadge() && getAskPassword))
          await handleOpenPasswordConfirmation();

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
      case 'firstName':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="First Name"
            type={'firstName'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/firstname.png`}
            placeholder="First Name Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'lastName':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Last Name"
            type={'lastName'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.png`}
            placeholder="Last Name Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'dateOfBirth':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Date of Birth"
            type={'dateOfBirth'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`}
            placeholder="MM/DD/YYYY"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'currentCity':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Current City"
            type={'currentCity'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`}
            placeholder="Current City here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'homeTown':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Home Town"
            type={'homeTown'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`}
            placeholder="Hometown Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'sex':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Sex"
            type={'sex'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`}
            placeholder="Sex Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'relationshipStatus':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Relationship Status"
            type={'relationshipStatus'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationship.svg`}
            placeholder="Relationship Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'work':
        return (
          <WorkBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Work"
            type={'work'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`}
            placeholder="Work Here"
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'education':
        return (
          <EducationBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Education"
            type={'education'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`}
            placeholder="Education Here"
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'id-passport':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="ID / Passport"
            type={'id-passport'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Identity-2x-1.png`}
            placeholder="ID / Passport Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'geolocation':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Geolocation"
            type={'geolocation'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`}
            placeholder="Geolocation"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'security-question':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Security Question"
            type={'security-question'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/securityquestion-a.png`}
            placeholder="Answer Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      default:
        return null;
    }
  };

  const PersonalItem = ({ item, persistedTheme, checkPersonalBadge, handleClickPesonalBadges }) => (
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
        variant={checkPersonalBadge(item.type) ? 'verification-badge-edit' : item.ButtonColor}
        onClick={() => {
          handleClickPesonalBadges(item.type, checkPersonalBadge(item.type) ? true : false);
        }}
        disabled={item.disabled}
      >
        {checkPersonalBadge(item.type) ? 'Edit' : item.ButtonText}
        {!checkPersonalBadge(item.type) && (
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
            checkPersonalBadge={checkPersonalBadge}
            handleClickPesonalBadges={handleClickPesonalBadges}
          />
        ))}
      </div>
    </>
  );
}
