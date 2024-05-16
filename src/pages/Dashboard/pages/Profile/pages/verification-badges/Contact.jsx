import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { contacts } from '../../../../../../constants/varification-badges';
import VerificationPopups from '../../components/VerificationPopups';
import Button from '../../components/Button';
import AddCellPhonePopup from '../../../../../../components/dialogue-boxes/AddCellPhonePopup';

export default function Contact({ fetchUser, handleRemoveBadgePopup }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPopup, setIsPopup] = useState(false);
  const [seletedBadge, setSelectedBadge] = useState('');
  const handleClose = () => {
    setIsPopup(false);
  };

  const checkContact = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);
  const checkPrimary = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType && i.primary === true);

  const handleGuestBadgeAdd = () => {
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
  };

  const handleClickContactBadgeEmail = (type, title, image) => {
    if (persistedUserInfo?.role === 'guest') {
      handleGuestBadgeAdd();
    } else {
      if (!checkContact(type)) {
        setIsPopup(true);
        setSelectedBadge(type);
      } else if (checkContact(type) && !checkPrimary(type)) {
        handleRemoveBadgePopup({
          title: title,
          image: image,
          type: type,
          badgeType: 'contact',
        });
      }
    }
  };

  const ContactItem = ({ item, index, persistedTheme, checkContact, checkPrimary, handleClickContactBadgeEmail }) => {
    return (
      <div
        className={`relative flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled && 'opacity-[60%]'}`}
        key={index}
      >
        <div className="absolute -left-5 tablet:-left-[42px]">
          {checkPrimary(item.type) && (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
              alt="primary"
              className="size-[15px] tablet:size-[30px]"
            />
          )}
        </div>
        <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
        <div
          className={`${
            persistedTheme === 'dark' ? 'dark-shadow-input' : ''
          } flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
        >
          <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
            {item.title}
          </h1>
        </div>
        <Button
          color={checkContact(item.type) ? (checkPrimary(item.type) ? 'yellow' : 'red') : item.ButtonColor}
          onClick={() => item.ButtonColor !== 'gray' && handleClickContactBadgeEmail(item.type, item.title, item.image)}
          disabled={checkPrimary(item.type)}
        >
          {checkContact(item.type) ? (checkPrimary(item.type) ? 'Added' : 'Remove') : item.ButtonText}
          <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
            {checkContact(item.type) ? '' : '(+0.96 FDX)'}
          </span>
        </Button>
      </div>
    );
  };

  // useEffect(() => {
  //   if (localStorage.getItem('isOtpSent') === 'true') {
  //     const timeout = setTimeout(() => {
  //       localStorage.removeItem('isOtpSent');
  //     }, 10000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [localStorage.getItem('isOtpSent')]);

  const renderContactBadgesPopup = () => {
    if (!isPopup) {
      return null;
    }

    switch (seletedBadge) {
      case 'personal':
        return (
          <VerificationPopups
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Personal Email"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`}
            placeholder="Personal email here"
            selectedBadge={seletedBadge}
          />
        );

      case 'work':
        return (
          <VerificationPopups
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Work Email"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`}
            placeholder="Work email here"
            selectedBadge={seletedBadge}
          />
        );

      case 'education':
        return (
          <VerificationPopups
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Education Email"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`}
            placeholder="Educational Email here"
            selectedBadge={seletedBadge}
          />
        );

      case 'cell-phone':
        return (
          <>
            <AddCellPhonePopup
              isPopup={isPopup}
              setIsPopup={setIsPopup}
              title="Phone Number"
              logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`}
              selectedBadge={seletedBadge}
              handleClose={handleClose}
              type={'cell-phone'}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="font-Inter mb-2 text-[9.74px] font-medium text-black tablet:mb-4 tablet:text-[22px] tablet:leading-[18px] dark:text-white">
        Contact
      </h1>
      <div className="flex flex-col items-center justify-between rounded-[16.068px] border-[#DEE6F7] bg-[#FDFDFD] tablet:border-[3px] tablet:py-[22px]">
        {renderContactBadgesPopup()}

        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {contacts.map((item, index) => (
            <ContactItem
              item={item}
              index={index}
              persistedTheme={persistedTheme}
              checkContact={checkContact}
              checkPrimary={checkPrimary}
              handleClickContactBadgeEmail={handleClickContactBadgeEmail}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
