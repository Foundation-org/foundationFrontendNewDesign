import { useState } from 'react';
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import api from '../../services/api/Axios';
import PasswordStrengthBar from 'react-password-strength-bar';

const LegacyBadgePopup = ({ isPopup, setIsPopup, title, logo, handleSkip, onboarding, progress }) => {
  const handleClose = () => setIsPopup(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPassword] = useState(false);
  const [reTypePassword, setReTypePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const cnfmPassInputType = showCnfmPassword ? 'text' : 'password';
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCnfmPasswordVisibility = () => {
    setShowCnfmPassword(!showCnfmPassword);
  };

  const addPasswordBadge = async () => {
    setIsLoading(true);
    if (password === reTypePassword) {
      setPassword('');
      setReTypePassword('');

      try {
        const infoc = await api.post('user/infoc', {
          infoc: password,
        });
        if (infoc.status === 200) {
          localStorage.setItem('legacyHash', infoc.data.data);
          try {
            const resp = await api.post('/addPasswordBadgesUpdate', {
              uuid: localStorage.getItem('uuid'),
              eyk: infoc.data.data,
            });
            if (resp.status === 200) {
              showToast('success', 'badgeAdded');
              handleClose();
              setIsLoading(false);
              queryClient.invalidateQueries(['userInfo']);
            }
          } catch (err) {
            console.log(err);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      showToast('error', 'passwordMismatched');
      setIsLoading(false);
    }
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="pb-5 text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:pb-[25px] tablet:text-[16px] tablet:leading-normal">
          Data encryption keeps your information private and secure. Your personal data will remain protected and
          completely inaccessible to anyone, including Foundation.
        </h1>
        <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
          <div className="flex flex-col tablet:gap-5">
            <div className="w-full">
              <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                Password
              </p>
              <div className="relative grid w-full grid-cols-[1fr] items-center">
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={inputType}
                  className="verification_badge_input"
                  placeholder="Password"
                />
                {!showPassword ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              <div className="relative -top-1 mx-2 mt-1 h-[19px]">
                {password && <PasswordStrengthBar password={password} />}
              </div>
            </div>

            <div className="w-full">
              <div className="relative grid w-full grid-cols-[1fr] items-center">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  Confirm Password
                </p>
                <div className="relative grid w-full grid-cols-[1fr] items-center">
                  <input
                    onChange={(e) => {
                      setReTypePassword(e.target.value);
                    }}
                    placeholder="Re-type Password"
                    type={cnfmPassInputType}
                    className="verification_badge_input"
                  />
                  {!showCnfmPassword ? (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                      alt="blind"
                      className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                      onClick={toggleCnfmPasswordVisibility}
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                      alt="blind"
                      className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                      onClick={toggleCnfmPasswordVisibility}
                    />
                  )}
                </div>
              </div>
              <div className="relative -top-1 mx-2 mt-1 h-[19px]">
                {reTypePassword && <PasswordStrengthBar password={reTypePassword} />}
              </div>
            </div>
          </div>

          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
            <Button variant="submit" onClick={addPasswordBadge}>
              {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
            </Button>
          </div>
        </div>
      </div>
      {onboarding && (
        <>
          {/* Progress Bar */}
          <div className="px-5 tablet:px-[60px] laptop:px-[80px]">
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: '#4caf50',
                height: '10px',
                borderRadius: '5px',
              }}
            ></div>
            <p>{`Progress: ${progress}%`}</p>
          </div>
          <div className="flex flex-col items-center pb-[15px] tablet:pb-[25px]">
            <Button variant="submit" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </>
      )}
    </PopUp>
  );
};

export default LegacyBadgePopup;
