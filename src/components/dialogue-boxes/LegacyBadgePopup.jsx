import React, { useState } from 'react';
import BadgeRemovePopup from './badgeRemovePopup';
import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import bcrypt from 'bcryptjs';
import PasswordStrengthBar from 'react-password-strength-bar';

const LegacyBadgePopup = ({
  isPopup,
  setIsPopup,
  type,
  title,
  logo,
  placeholder,
  edit,
  fetchUser,
  setIsPersonalPopup,
}) => {
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const handleClose = () => setIsPopup(false);
  const handleBadgesClose = () => setModalVisible(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const [reTypePassword, setReTypePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const cnfmPassInputType = showCnfmPassword ? 'text' : 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCnfmPasswordVisibility = () => {
    setShowCnfmPassword(!showCnfmPassword);
  };

  const addPasswordBadge = async () => {
    setIsLoading(true);
    console.log(password, reTypePassword);
    if (password === reTypePassword) {
      setPassword('');
      setReTypePassword('');
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      localStorage.setItem('legacyHash', hashPassword);
      console.log(hashPassword);
      setIsLoading(false);
    } else {
      toast.warning('Password does not match');
      setIsLoading(false);
    }
  };

  return (
    <>
      {modalVisible && (
        <BadgeRemovePopup
          handleClose={handleBadgesClose}
          modalVisible={modalVisible}
          title={deleteModalState?.title}
          image={deleteModalState?.image}
          type={deleteModalState?.type}
          badgeType={deleteModalState?.badgeType}
          fetchUser={fetchUser}
          setIsPersonalPopup={setIsPersonalPopup}
          setIsLoading={setRemoveLoading}
          loading={RemoveLoading}
        />
      )}
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
            <div className="my-[5px] w-full ">
              <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                Password
              </p>
              <div className="relative grid w-full grid-cols-[1fr] items-center">
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={inputType}
                  className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
                  placeholder="Password"
                />
                {!showPassword ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              <div className="relative -top-1 mx-2 mt-1 h-[19px]">
                {password && <PasswordStrengthBar password={password} />}
              </div>
            </div>

            <div className="w-full">
              <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                Confirm Password
              </p>
              <div className="h-[50px] xl:h-[66px]">
                <div className="relative grid w-full grid-cols-[1fr] items-center">
                  <input
                    onChange={(e) => {
                      setReTypePassword(e.target.value);
                    }}
                    placeholder="Re-type Password"
                    type={cnfmPassInputType}
                    className="w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
                  />
                  {!showCnfmPassword ? (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                      alt="blind"
                      className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                      onClick={toggleCnfmPasswordVisibility}
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                      alt="blind"
                      className="absolute right-2 h-[17px] w-[17px] cursor-pointer  2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                      onClick={toggleCnfmPasswordVisibility}
                    />
                  )}
                </div>
              </div>

              <div className="relative -top-2.5 mx-2 mt-1 h-[19px]">
                {reTypePassword && <PasswordStrengthBar password={reTypePassword} />}
              </div>
            </div>

            <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
              {/* {edit && (
              <Button
                variant="badge-remove"
                onClick={() => {
                  handleRemoveBadgePopup({
                    title: title,
                    type: type,
                    badgeType: 'legacy',
                    image: logo,
                  });
                }}
              >
                {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
              </Button>
            )} */}

              <Button variant="submit" onClick={addPasswordBadge}>
                {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default LegacyBadgePopup;
