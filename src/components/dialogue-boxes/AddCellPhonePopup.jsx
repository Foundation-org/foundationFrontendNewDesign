import { toast } from 'sonner';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';
import { useMutation } from '@tanstack/react-query';
import { sendOtp } from '../../services/api/badgesApi';

const AddCellPhonePopup = ({ isPopup, title, logo, setOtpResp, handleClose, setIsOtpSent, handleVerificationOpen }) => {
  const [phone, setPhone] = useState();

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
      </PopUp>
    </div>
  );
};

export default AddCellPhonePopup;
