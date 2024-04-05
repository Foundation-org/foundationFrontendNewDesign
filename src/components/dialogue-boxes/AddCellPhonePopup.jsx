import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useMutation } from '@tanstack/react-query';
import { sendOtp, verifyOtp } from '../../services/api/badgesApi';
import PopUp from '../ui/PopUp';

const AddCellPhonePopup = ({
  isPopup,
  title,
  logo,
  setOtpResp,
  handleClose,
  setIsOtpSent,
  handleVerificationOpen,
  otpResp,
}) => {
  const [phone, setPhone] = useState();
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

  const { mutateAsync: verifyOtpCode, isPending: verifyLoading } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (resp) => {
      toast.success('OTP verified Successfully');
      localStorage.removeItem('isOtpSent');
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: generateOtp, isPending } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (resp) => {
      setOtpResp(resp);
      toast.success('OTP sent Successfully');
      setIsOtpSent(true);
      handleVerificationOpen();
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  return (
    <div>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="pb-[15px] pt-2 tablet:py-[25px]">
          <div className=" px-5 tablet:px-[60px] laptop:px-[80px]">
            <p
              htmlFor="email"
              className="text-[9.28px] font-medium leading-[11.23px] text-[#7C7C7C] tablet:text-[20px] tablet:leading-[24.2px]"
            >
              {title}
            </p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={'Phone Number here'}
              className="mb-[10px] mt-1 w-full rounded-[8.62px] border border-[#DEE6F7] bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none tablet:mb-5 tablet:mt-[15px] tablet:rounded-[15px] tablet:border-[3px] tablet:py-[18px] tablet:text-[18px] tablet:leading-[21px]"
            />
            <div className="flex justify-end">
              <Button
                variant="submit"
                disabled={isPending}
                onClick={() => {
                  generateOtp(phone);
                }}
              >
                {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Send OTP'}
              </Button>
            </div>
          </div>
        </div>
        {/* 2nd Screen */}
        <div className="pb-[15px] pt-2 tablet:py-[25px]">
          <div className=" px-5 tablet:px-[60px] laptop:px-[80px]">
            <h1 className="text-[9.278px] font-medium leading-[9.278px] text-[#707175] tablet:text-[20px] tablet:font-semibold tablet:leading-[20px]">
              OTP Verification
            </h1>
            <p className="my-[10px] text-[9.28px] font-normal leading-[9.28px] text-[#707175] tablet:my-[15px] tablet:text-[18px] tablet:leading-[20px]">
              We Will send you a one time password on this{' '}
              <span className="font-semibold">{otpResp?.data?.data?.phoneNumber}</span>
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
            <div className="flex justify-end">
              <Button
                variant="submit"
                disabled={isPending}
                onClick={() => {
                  const otpString = otp.join('');
                  verifyOtpCode({ phone: otpResp?.data?.data?.phoneNumber, otpString });
                }}
              >
                {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </PopUp>
    </div>
  );
};

export default AddCellPhonePopup;
