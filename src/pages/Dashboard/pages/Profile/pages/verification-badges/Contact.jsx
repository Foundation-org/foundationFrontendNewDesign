import { toast } from 'sonner';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { contacts } from '../../../../../../constants/varification-badges';
import VerificationPopups from '../../components/VerificationPopups';
import Button from '../../components/Button';
import AddCellPhonePopup from '../../../../../../components/dialogue-boxes/AddCellPhonePopup';
import PhoneOtpVerificationPopup from '../../../../../../components/dialogue-boxes/PhoneOtpVerificationPopup';

export default function Contact({ fetchUser, handleUserInfo, handleRemoveBadgePopup }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPopup, setIsPopup] = useState(false);
  const [seletedBadge, setSelectedBadge] = useState('');

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
        className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled && 'opacity-[60%]'}`}
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
          } flex h-[7.3vw] w-[24vw] items-center  justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000] tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
        >
          <h1>{item.title}</h1>
        </div>
        <Button
          color={checkContact(item.type) ? (checkPrimary(item.type) ? 'yellow' : 'red') : item.ButtonColor}
          onClick={() => item.ButtonColor !== 'gray' && handleClickContactBadgeEmail(item.type, item.title, item.image)}
          disabled={checkPrimary(item.type)}
        >
          {checkContact(item.type) ? (checkPrimary(item.type) ? 'Added' : 'Remove') : item.ButtonText}
          <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
            {checkContact(item.type) ? '' : '(+0.96 FDX)'}
          </span>
        </Button>
      </div>
    );
  };

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
            handleUserInfo={handleUserInfo}
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
            handleUserInfo={handleUserInfo}
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
            handleUserInfo={handleUserInfo}
          />
        );

      case 'cell-phone':
        return (
          // <AddCellPhonePopup
          //   isPopup={isPopup}
          //   setIsPopup={setIsPopup}
          //   title="Phone Number"
          //   logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`}
          //   selectedBadge={seletedBadge}
          //   handleUserInfo={handleUserInfo}
          // />
          <PhoneOtpVerificationPopup
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Phone Number"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`}
            selectedBadge={seletedBadge}
            handleUserInfo={handleUserInfo}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-between ">
      {renderContactBadgesPopup()}
      <div className="flex flex-col gap-[7px] tablet:gap-4 laptop:gap-5">
        <h1 className="font-500 font-Inter mb-[3px] text-[9.74px] font-medium text-[#000] tablet:text-[1.7vw] dark:text-white">
          Contact
        </h1>

        <div className="hidden flex-col justify-between rounded-2xl border-[3px] border-[#DEE6F7] py-[17px] tablet:flex tablet:flex-row">
          <div className="flex w-full flex-col items-center gap-[10px] tablet:gap-4 laptop:gap-5">
            {contacts.slice(0, Math.ceil(contacts.length / 2)).map((item, index) => (
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
          <div className="w-2 rounded-[16px] border-[3px] border-[#DEE6F7] bg-[#FDFDFD]" />
          <div className="flex w-full flex-col items-center gap-[10px] tablet:gap-4 laptop:gap-5">
            {contacts.slice(Math.ceil(contacts.length / 2)).map((item, index) => (
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

        <div className="flex flex-col gap-[7px] tablet:hidden tablet:gap-4 laptop:gap-5">
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
