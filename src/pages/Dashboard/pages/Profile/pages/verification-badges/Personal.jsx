import { useState } from 'react';
import { useSelector } from 'react-redux';
import { personal } from '../../../../../../constants/varification-badges';
import Button from '../../components/Button';
import PersonalBadgesPopup from '../../../../../../components/dialogue-boxes/PersonalBadgesPopup';
import WorkEducationBadgePopup from '../../../../../../components/dialogue-boxes/WorkEducationBadgePopup';

export default function Personal({ handleUserInfo, fetchUser }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [seletedPersonalBadge, setSelectedPersonalBadge] = useState('');

  // const checkPersonal = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);
  const checkPersonalBadge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.personal?.hasOwnProperty(itemType) || false) || false;

  const handleClickPesonalBadges = (type) => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    } else {
      setIsPersonalPopup(true);
      setSelectedPersonalBadge(type);
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
            logo="/assets/profile/firstname.png"
            placeholder="First Name here"
            handleUserInfo={handleUserInfo}
          />
        );

      case 'lastName':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Last Name"
            type={'lastName'}
            logo="/assets/profile/lastname.png"
            placeholder="Last Name here"
            handleUserInfo={handleUserInfo}
          />
        );

      case 'dateOfBirth':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Date of Birth"
            type={'dateOfBirth'}
            logo="/assets/profile/dob.svg"
            placeholder="MM/DD/YYYY"
            handleUserInfo={handleUserInfo}
          />
        );

      case 'currentCity':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Current City"
            type={'currentCity'}
            logo="/assets/profile/currentcity-1.png"
            placeholder="Current City here"
          />
        );

      case 'homeTown':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Home Town"
            type={'homeTown'}
            logo="/assets/profile/hometown.svg"
            placeholder="First Name here"
          />
        );

      case 'relationshipStatus':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Relationship Status"
            type={'relationshipStatus'}
            logo="/assets/profile/relationaship-1.png"
            placeholder="Relationship here"
          />
        );

      case 'work':
        return (
          <WorkEducationBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Work"
            type={'work'}
            logo="/assets/profile/work-a.png"
            placeholder="Relationship here"
          />
        );

      case 'education':
        return (
          <WorkEducationBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Education"
            type={'education'}
            logo="/assets/profile/education-1.png"
            placeholder="Relationship here"
          />
        );

      case 'id-passport':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="ID / Passport"
            type={'id-passport'}
            logo="/assets/profile/Identity-2x-1.png"
            placeholder="ID / Passport here"
          />
        );

      case 'geolocation':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Geolocation"
            type={'geolocation'}
            logo="/assets/profile/education-1.png"
            placeholder="Geolocation"
          />
        );

      case 'security-question':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Security Question"
            type={'security-question'}
            logo="/assets/profile/securityquestion-a.png"
            placeholder="Relationship here"
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderPersonalBadgesPopup()}
      <div className="flex flex-col gap-[7px] tablet:gap-4 laptop:gap-5">
        {personal.map((item, index) => (
          <div className={`flex items-center justify-center  ${item.disabled ? 'opacity-[60%]' : ''}`} key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } ml-[10px] mr-2 flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:mx-[30px] tablet:h-[3.48vw] tablet:w-[19.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
            >
              <h1>{item.title}</h1>
            </div>
            {/* {item.NoOfButton !== 1 ? (
        <div className="flex w-[19.9vw] justify-between  tablet:mr-[18.5px]">
          <button className="rounded-[1.31vw] h-[5.8vw] w-[45%] bg-[#FAD308] text-[1.38vw] text-white tablet:rounded-[12.6px] laptop:rounded-[23px] dark:bg-[#FAD308]">
            Edit
          </button>
          <button className="h-[5.8vw] w-[52%] rounded-[1.31vw]  bg-[#FF4057] text-[1.38vw] text-white tablet:rounded-[12.6px] laptop:rounded-[23px] dark:bg-[#C13232]">
            Remove
          </button>
        </div>
      ) : (
        <Button color={item.ButtonColor}>{item.ButtonText}</Button>
      )} */}
            <Button
              color={checkPersonalBadge(item.type) ? 'yellow' : item.ButtonColor}
              onClick={() => {
                handleClickPesonalBadges(item.type);
              }}
              disabled={checkPersonalBadge(item.type)}
            >
              {checkPersonalBadge(item.type) ? 'Added' : item.ButtonText}
              {!checkPersonalBadge(item.type) && (
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                  (+0.96 FDX)
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
