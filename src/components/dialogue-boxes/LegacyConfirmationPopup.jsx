import React, { useState } from 'react';
import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api/Axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LegacyConfirmationPopup = ({ isPopup, setIsPopup, title, logo, legacyPromiseRef, login, uuid }) => {
  const handleClose = () => setIsPopup(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = async () => {
    setIsLoading(true);
    setPassword('');
    if (login) {
      try {
        console.log('uuid', uuid);
        const infoc = await api.post('/user/runtimeSignInPassword', {
          infoc: password,
          userUuid: uuid,
        });
        if (infoc.status === 200) {
          console.log(infoc.data);
          localStorage.setItem('legacyHash', infoc.data.hash);
          localStorage.setItem('uuid', infoc.data.user.uuid);
          localStorage.setItem('userData', JSON.stringify(infoc.data.user));
          localStorage.removeItem('isGuestMode');
          dispatch(addUser(infoc.data.user));
          navigate('/dashboard');
          if (legacyPromiseRef.current) {
            setIsPopup(false);
            setIsLoading(false);
            legacyPromiseRef.current();
          }
        }
      } catch (e) {
        toast.error(e.response.data.message.split(':')[0]);
        setIsLoading(false);
      }
    } else {
      try {
        const infoc = await api.post('user/infoc', {
          infoc: password,
        });
        if (infoc.status === 200) {
          if (localStorage.getItem('legacyHash')) {
            if (infoc.data.data !== localStorage.getItem('legacyHash')) {
              toast.error('Wrong Password');
              setIsLoading(false);
              return;
            }
          } else {
            localStorage.setItem('legacyHash', infoc.data.data);
          }
          if (legacyPromiseRef.current) {
            setIsPopup(false);
            setIsLoading(false);
            legacyPromiseRef.current();
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <div className="flex flex-col gap-[14px] tablet:gap-[25px]">
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

            <div className=" flex justify-end gap-[15px] tablet:gap-[35px]">
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
