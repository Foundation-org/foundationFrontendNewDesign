import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendEmail } from "../../../services/api/DialogueApis";

const EmailDialogue = ({ handleClose, id }) => {
  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/quest/${id}`;
  const [payload, setPayload] = useState({
    email: "",
    subject: "",
    message: `Here is the link ${url} of the quest. Please feel free to engage with the quest`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const { mutateAsync: userSendEmail } = useMutation({
    mutationFn: sendEmail,
    onSuccess: (resp) => {
      toast.success(resp.data.message);
      setPayload({
        email: "",
        subject: "",
        message: "",
      });
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  return (
    <div className="relative w-[90vw] pb-[17px] pt-[25px] tablet:pb-[75px] tablet:pt-[74px] laptop:w-[52.6rem]">
      <img
        src="/assets/svgs/close.svg"
        alt="close icon"
        className="absolute right-[11px] top-[10px] h-[0.48rem] w-[0.48rem] cursor-pointer tablet:right-[20px] tablet:top-[17px] tablet:h-[1.37rem] tablet:w-[1.37rem] laptop:right-[26px] laptop:top-[29px]"
        onClick={handleClose}
      />
      <div className="mx-[19px] flex flex-col gap-[10.76px] tablet:mx-[40px] tablet:gap-[27px] laptop:mx-[81px] ">
        <div className="flex w-full rounded-[10px] bg-[#F3F3F3] px-[16.6px] py-[13px] text-[12px] font-normal text-[#435059] tablet:rounded-[26px] tablet:px-[43px] tablet:py-[36px] tablet:text-[26px] laptop:w-[681px]">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-[26px] bg-[#F3F3F3] pl-[33px] outline-none tablet:pl-[102px]"
            value={payload.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex w-full rounded-[10px] bg-[#F3F3F3] px-[16.6px] py-[13px] text-[12px] font-normal text-[#435059] tablet:rounded-[26px] tablet:px-[43px] tablet:py-[36px] tablet:text-[26px] laptop:w-[681px]">
          <label htmlFor="Subject">Subject:</label>
          <input
            name="subject"
            type="text"
            className="w-full rounded-[26px] bg-[#F3F3F3] pl-[22px] outline-none tablet:pl-[80px]"
            value={payload.subject}
            onChange={handleChange}
          />
        </div>
        <div className="flex w-full rounded-[10px] bg-[#F3F3F3] px-[16.6px] py-[13px] text-[12px] font-normal text-[#435059] tablet:rounded-[26px] tablet:px-[43px] tablet:py-[36px] tablet:text-[26px] laptop:w-[681px]">
          <label htmlFor="Subject">Message:</label>
          <textarea
            name="message"
            type="text"
            rows={4}
            className="w-full rounded-[26px] bg-[#F3F3F3] pl-4 outline-none tablet:pl-[60px]"
            value={payload.message}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="mt-[21px] w-[99px] rounded-[8.66px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[12px] font-semibold leading-normal text-white tablet:mt-6 tablet:w-[246px] tablet:rounded-[21.33px] tablet:px-5 tablet:py-[11.38px] tablet:text-[28.44px]"
            onClick={() => {
              userSendEmail(payload);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDialogue;
