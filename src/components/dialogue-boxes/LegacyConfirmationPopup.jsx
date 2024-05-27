import React, { useState } from 'react';
import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import bcrypt from 'bcryptjs';

const LegacyConfirmationPopup = ({ isPopup, setIsPopup, title, logo, legacyPromiseRef }) => {
  const handleClose = () => setIsPopup(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = async () => {
    setIsLoading(true);
    setPassword('');
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    localStorage.setItem('legacyHash', hashPassword);
    if (legacyPromiseRef.current) {
      setIsPopup(false);
      setIsLoading(false);
      legacyPromiseRef.current();
    }
  };

  return (
    <>
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
            </div>

            <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
              <Button variant="submit" onClick={validatePassword}>
                {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default LegacyConfirmationPopup;
