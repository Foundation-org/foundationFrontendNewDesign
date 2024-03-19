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
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/firstname.png`}
            placeholder="First Name Here"
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
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.png`}
            placeholder="Last Name Here"
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
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`}
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
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`}
            placeholder="Current City here"
            handleUserInfo={handleUserInfo}
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
            handleUserInfo={handleUserInfo}
          />
        );

      case 'relationshipStatus':
        return (
          <PersonalBadgesPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Relationship Status"
            type={'relationshipStatus'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`}
            placeholder="Relationship Here"
            handleUserInfo={handleUserInfo}
          />
        );

      case 'work':
        return (
          <WorkEducationBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Work"
            type={'work'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`}
            placeholder="Work Here"
            handleUserInfo={handleUserInfo}
          />
        );

      case 'education':
        return (
          <WorkEducationBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Education"
            type={'education'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`}
            placeholder="Education Here"
            handleUserInfo={handleUserInfo}
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
            handleUserInfo={handleUserInfo}
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
            handleUserInfo={handleUserInfo}
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
            handleUserInfo={handleUserInfo}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="font-500 font-Inter my-[5px] text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
        Personal
      </h1>
      {renderPersonalBadgesPopup()}
      <div className="hidden flex-col justify-between gap-[7px] rounded-2xl border-[3px] border-[#DEE6F7] p-[17px] tablet:flex tablet:flex-row tablet:gap-5 laptop:gap-6">
        <div className="flex flex-col gap-[10px] tablet:gap-4 laptop:gap-5">
          {personal.slice(0, Math.ceil(personal.length / 2)).map((item, index) => (
            <div
              className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
              />
              <div
                className={`${
                  persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
              >
                <h1>{item.title}</h1>
              </div>

              <Button
                color={checkPersonalBadge(item.type) ? 'red' : item.ButtonColor}
                onClick={() => {
                  handleClickPesonalBadges(item.type);
                }}
                disabled={item.disabled || checkPersonalBadge(item.type)}
              >
                {checkPersonalBadge(item.type) ? 'Remove' : item.ButtonText}
                {!checkPersonalBadge(item.type) && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className="w-2 rounded-[16px] border-[3px] border-[#DEE6F7] bg-[#FDFDFD]" />
        <div className="flex flex-col gap-7 tablet:gap-4 laptop:gap-5">
          {personal.slice(Math.ceil(personal.length / 2)).map((item, index) => (
            <div
              className={`flex items-center justify-center gap-[10px] tablet:justify-end laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
              />
              <div
                className={`${
                  persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
              >
                <h1>{item.title}</h1>
              </div>

              <Button
                color={checkPersonalBadge(item.type) ? 'red' : item.ButtonColor}
                onClick={() => {
                  handleClickPesonalBadges(item.type);
                }}
                disabled={item.disabled || checkPersonalBadge(item.type)}
              >
                {checkPersonalBadge(item.type) ? 'Remove' : item.ButtonText}
                {!checkPersonalBadge(item.type) && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-[7px] tablet:hidden tablet:gap-4 laptop:gap-5">
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
              color={checkPersonalBadge(item.type) ? 'red' : item.ButtonColor}
              onClick={() => {
                handleClickPesonalBadges(item.type);
              }}
              disabled={item.disabled || checkPersonalBadge(item.type)}
            >
              {checkPersonalBadge(item.type) ? 'Remove' : item.ButtonText}
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

{
  /* {item.NoOfButton !== 1 ? (
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
      )} */
}
