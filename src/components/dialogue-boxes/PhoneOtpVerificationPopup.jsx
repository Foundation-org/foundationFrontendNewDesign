import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useErrorBoundary } from 'react-error-boundary';
import { Button } from '../ui/Button';
import api from '../../services/api/Axios';
import PopUp from '../ui/PopUp';

const PhoneOtpVerificationPopup = ({ isPopup, setIsPopup, title, logo, selectedBadge, handleUserInfo }) => {
  const { showBoundary } = useErrorBoundary();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const handleClose = () => {
    setIsPopup(false);
  };

  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const refs = Array.from({ length: 6 }).map(() => useRef());

  const handleChange = (index, e) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    if (value === '') {
      if (index > 0) {
        refs[index - 1].current.focus();
      }
    } else {
      if (index < 5) {
        refs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      refs[index - 1].current.focus();
    }
  };

  // Handle Add Contact Badge
  const handleAddContactBadge = async ({ provider, data, legacy }) => {
    setLoading(true);
    try {
      let addBadge;
      if (legacy) {
        if (email === '') return toast.warning('Please enter your email address');
        addBadge = await api.post(`/addBadge/contact`, {
          legacy,
          email,
          uuid: localStorage.getItem('uuid'),
          type: selectedBadge,
        });
      } else {
        data['provider'] = provider;
        data['type'] = selectedBadge;
        data['uuid'] = localStorage.getItem('uuid');
        addBadge = await api.post(`/addBadge/contact`, {
          ...data,
        });
      }
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleClose();
        handleUserInfo();
        setEmail('');
      }
      if (addBadge.status === 201) {
        toast.success('Please check your Email to verify');
        handleClose();
        handleUserInfo();
        setEmail('');
      }
    } catch (error) {
      showBoundary(error);
      toast.error(error.response.data.message.split(':')[1]);
      handleClose();
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="pb-[15px] pt-2 tablet:py-[25px]">
          <div className=" px-5 tablet:px-[60px] laptop:px-[80px]">
            <h1 className="text-[9.278px] font-medium leading-[9.278px] text-[#707175] tablet:text-[20px] tablet:font-semibold tablet:leading-[20px]">
              OTP Verification
            </h1>
            <p className="my-[10px] text-[9.28px] font-normal leading-[9.28px] text-[#707175] tablet:my-[15px] tablet:text-[18px] tablet:leading-[20px]">
              We Will send you a one time password on this <span className="font-semibold">+923007065077</span>
            </p>
            <div className="flex flex-col space-y-16">
              <div className="flex w-full flex-row items-center gap-2 tablet:gap-[15px]">
                {otp.map((digit, index) => (
                  <div key={index} className="size-[26.7px] tablet:size-[57px]">
                    <input
                      ref={refs[index]}
                      className="flex h-full w-full flex-col items-center justify-center rounded-[6px] border border-[#DEE6F7] bg-[#FBFBFB] text-center text-[14px] outline-none focus:ring-0 tablet:rounded-[15px] tablet:border-[3px] tablet:text-[26px]"
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <h1 className="mt-2 text-[9.278px] font-semibold leading-[9.278px] text-[#707175] tablet:text-[20px] tablet:leading-[20px]">
              00:39
            </h1>
            <p className="my-[6] text-[8px] font-normal leading-[20px] text-[#707175] tablet:my-[15px] tablet:text-[18px]">
              Do not Receive OTP ? <span className="cursor-pointer font-semibold text-[#4A8DBD]">Send OTP</span>
            </p>
            <div className="flex justify-end" onClick={() => handleAddContactBadge({ legacy: true })}>
              <Button variant="submit" disabled={loading}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </div>
  );
};

export default PhoneOtpVerificationPopup;
