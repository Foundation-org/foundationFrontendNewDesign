import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { sendContactUsEmail } from '../../../../services/api/DialogueApis';
import { FaSpinner } from 'react-icons/fa';
import showToast from '../../../../components/ui/Toast';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

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
      showToast('success', 'supportRequest');
      setPayload({
        email: '',
        subject: 'Email Sent Through Contact Us Form',
        message: '',
      });
      setIsloading(false);
    },
    onError: (error) => {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      setIsloading(false);
    },
  });

  return (
    <div className="flex w-full flex-col gap-3 rounded-[10px] bg-white px-[14px] py-[15px] tablet:gap-[25px] tablet:px-[58px] tablet:pb-10 tablet:pt-[25px]">
      <h1 className="text-[14px] font-bold leading-none -tracking-[2%] text-[#707175] tablet:text-[20px]">
        Get in Touch With Us
      </h1>
      <input
        name="email"
        type="email"
        placeholder="Email Address*"
        className="autofill_text_color-contact-us w-full rounded-[7px] border-2 border-[#DEE6F7] bg-[#FDFDFD] p-[6px] text-[10px] font-normal leading-[13px] text-[#909090] focus:outline-none tablet:border-[3px] tablet:p-5 tablet:text-[18px] tablet:leading-[23px]"
        value={payload.email}
        onChange={handleChange}
      />
      <TextareaAutosize
        name="message"
        aria-label="message"
        minRows={3}
        placeholder="Your Message*"
        className="w-full rounded-[10px] border-2 border-[#DEE6F7] bg-[#FDFDFD] p-[6px] text-[10px] font-normal leading-[13px] text-[#909090] focus:outline-none tablet:border-[3px] tablet:p-5 tablet:text-[18px] tablet:leading-[23px]"
        value={payload.message}
        onChange={handleChange}
      />
      <Button
        variant="submit"
        className="w-fit tablet:py-5"
        onClick={() => {
          setIsloading(true);
          userSendEmail(payload);
        }}
      >
        {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
      </Button>
    </div>
  );
};

export default ContactUs;
