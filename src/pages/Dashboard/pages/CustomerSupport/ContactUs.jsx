import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { sendContactUsEmail } from '../../../../services/api/DialogueApis';
import { FaSpinner } from 'react-icons/fa';

const ContactUs = () => {
  const [loading, setIsloading] = useState(false);
  const [payload, setPayload] = useState({
    email: '',
    subject: 'Email Sent Through Contact Us Form',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const { mutateAsync: userSendEmail } = useMutation({
    mutationFn: sendContactUsEmail,
    onSuccess: (resp) => {
      toast.success(resp.data.message);
      setPayload({
        email: '',
        subject: 'Email Sent Through Contact Us Form',
        message: '',
      });
      setIsloading(false);
    },
    onError: (err) => {
      toast.error(err.response.data);
      setIsloading(false);
    },
  });

  return (
    <div className="w-full h-screen bg-white">
      <div className="flex flex-col gap-1 tablet:gap-2 bg-[#4A8DBD] text-[#E7E7E7] w-full py-3 tablet:py-[47px]">
        <p className="text-[7px] tablet:text-[11.77px] font-semibold text-center leading-none">Support</p>
        <h1 className="text-[12px] tablet:text-[35.3px] font-semibold text-center -tracking-[2%] leading-none">
          Get in Touch
        </h1>
        <p className="text-[8px] tablet:text-[14.71px] font-normal text-center leading-none">
          Have any questions? We're here to assist you.
        </p>
      </div>
      <div className="bg-white flex flex-col gap-10 laptop:gap-0 laptop:flex-row justify-center items-center py-[30px] px-6 tablet:px-7 tablet:py-12 laptop:p-[100px]">
        <div className="laptop:w-1/2 hidden tablet:block">
          <h1 className=" text-[14px] tablet:text-[40px] font-bold text-center -tracking-[2%] leading-none text-[#292929]">
            Get in Touch With Us
          </h1>
        </div>
        <div className="laptop:w-1/2 tablet:border border-[#CDCDCD] rounded-[15px] tablet:py-[58px] tablet:px-[55px]">
          <input
            name="email"
            type="email"
            placeholder="Email Address*"
            className="autofill_text_color-contact-us border-2 tablet:border-[3px] border-[#DEE6F7] rounded-[10px] text-[10px] tablet:text-[18px] font-normal text-[#909090] leading-[13px] tablet:leading-[23px] bg-[#FDFDFD] focus:outline-none p-[14px] tablet:p-5 w-full"
            value={payload.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message*"
            className="border-2 tablet:border-[3px] border-[#DEE6F7] rounded-[10px] text-[10px] tablet:text-[18px] font-normal text-[#909090] leading-[13px] tablet:leading-[23px] bg-[#FDFDFD] focus:outline-none p-[14px] tablet:p-5 w-full mt-3 tablet:mt-5"
            value={payload.message}
            onChange={handleChange}
          />
          <Button
            variant="submit"
            className="py-5 mt-[30px] tablet:mt-[50px]"
            onClick={() => {
              setIsloading(true);
              userSendEmail(payload);
            }}
          >
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
