import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { sendContactUsEmail } from '../../../../services/api/DialogueApis';
import { FaSpinner } from 'react-icons/fa';
import Topbar from '../../components/Topbar';

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
      toast.success('Support request received!');
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
    <div>
      <Topbar />
      <div className="h-[calc(100dvh-58px)] w-full bg-white tablet:h-[calc(100dvh-96px)] laptop:h-[calc(100dvh-70px)]">
        <div className="flex w-full flex-col gap-1 bg-[#4A8DBD] py-3 text-[#E7E7E7] tablet:gap-2 tablet:py-[47px]">
          <p className="text-center text-[7px] font-semibold leading-none tablet:text-[11.77px]">Support</p>
          <h1 className="text-center text-[12px] font-semibold leading-none -tracking-[2%] tablet:text-[35.3px]">
            Get in Touch
          </h1>
          <p className="text-center text-[8px] font-normal leading-none tablet:text-[14.71px]">
            Have any questions? We're here to assist you.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-10 bg-white px-6 py-[30px] tablet:px-7 tablet:py-12 laptop:flex-row laptop:gap-0 laptop:p-[100px]">
          <div className="hidden tablet:block laptop:w-1/2">
            <h1 className=" text-center text-[14px] font-bold leading-none -tracking-[2%] text-[#292929] tablet:text-[40px]">
              Get in Touch With Us
            </h1>
          </div>
          <div className="rounded-[15px] border-[#CDCDCD] tablet:border tablet:px-[55px] tablet:py-[58px] laptop:w-1/2">
            <input
              name="email"
              type="email"
              placeholder="Email Address*"
              className="autofill_text_color-contact-us w-full rounded-[10px] border-2 border-[#DEE6F7] bg-[#FDFDFD] p-[14px] text-[10px] font-normal leading-[13px] text-[#909090] focus:outline-none tablet:border-[3px] tablet:p-5 tablet:text-[18px] tablet:leading-[23px]"
              value={payload.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your Message*"
              className="mt-3 w-full rounded-[10px] border-2 border-[#DEE6F7] bg-[#FDFDFD] p-[14px] text-[10px] font-normal leading-[13px] text-[#909090] focus:outline-none tablet:mt-5 tablet:border-[3px] tablet:p-5 tablet:text-[18px] tablet:leading-[23px]"
              value={payload.message}
              onChange={handleChange}
            />
            <Button
              variant="submit"
              className="mt-[30px] py-5 tablet:mt-[50px]"
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
    </div>
  );
};

export default ContactUs;
