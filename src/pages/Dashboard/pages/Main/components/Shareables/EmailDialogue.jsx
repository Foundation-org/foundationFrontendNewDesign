import React from "react";

const EmailDialogue = ({ handleClose }) => {
  return (
    <div className="relative pb-[75px] pt-[37px]">
      <img
        src="/assets/svgs/close.svg"
        alt="close icon"
        className="absolute right-[26px] top-[29px] cursor-pointer"
        onClick={handleClose}
      />
      <div className="mx-[81px] mt-[41px] flex flex-col gap-[27px] ">
        <div className="flex w-[681px] rounded-[26px] bg-[#F3F3F3] px-[43px] py-[36px]">
          <label
            htmlFor="email"
            className="text-[26px] font-normal text-[#435059]"
          >
            Email:
          </label>
          <input
            type="email"
            className="w-full rounded-[26px] bg-[#F3F3F3] pl-[102px] text-[26px] font-normal text-[#435059] outline-none"
          />
        </div>
        <div className="flex w-[681px] rounded-[26px] bg-[#F3F3F3] px-[43px] py-[36px]">
          <label
            htmlFor="Subject"
            className="text-[26px] font-normal text-[#435059]"
          >
            Subject:
          </label>
          <input
            type="text"
            className="w-full rounded-[26px] bg-[#F3F3F3] pl-[80px] text-[26px] font-normal text-[#435059] outline-none"
          />
        </div>
        <div className="flex w-[681px] rounded-[26px] bg-[#F3F3F3] px-[43px] py-[36px]">
          <label
            htmlFor="Subject"
            className="text-[26px] font-normal text-[#435059]"
          >
            Message:
          </label>
          <textarea
            type="text"
            rows={4}
            className="w-full rounded-[26px] bg-[#F3F3F3] pl-[60px] text-[26px] font-normal text-[#435059] outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button className="mt-[16.2px] w-[246px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:mt-6 tablet:rounded-[21.33px] tablet:px-5 tablet:py-[11.38px] tablet:text-[28.44px]">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDialogue;
