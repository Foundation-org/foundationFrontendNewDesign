import React from "react";

const QuestionCard = ({
  img,
  alt,
  badgeCount,
  title,
  question,
  correctAnswers,
}) => {
  return (
    <div className="bg-[#212224] border-[1px] border-[#E4E9FF] rounded-[26px]">
      <div className="flex items-center justify-between px-[22px] py-[17px]">
        <div className="w-fit h-fit relative">
          <img src={img} alt={alt} className="w-[48px] h-[60px]" />
          <p className="absolute transform-center pb-5 z-50 font-[400] text-[#F6F6F6] text-[17px] leading-normal">
            {badgeCount}
          </p>
        </div>
        <h1 className="text-[22px] font-semibold leading-normal text-[#CFCFCF]">
          {title}
        </h1>
        <img
          src="/assets/svgs/dashboard/save.svg"
          alt="save icon"
          className="w-9 h-7"
        />
      </div>
      <h1 className="text-[#969899] text-[25px] font-semibold leading-normal ml-[52.65px] mt-[5px]">
        {question}
      </h1>
      <div className="flex items-center mb-7">
        {correctAnswers && (
          <p className="mt-12 rounded-[15px] bg-[#303030] ml-6 pt-2 pb-[7px] px-[14px] text-[#737373] text-[18px] font-semibold leading-normal min-w-[12rem] w-fit">
            2 Correct Answers
          </p>
        )}
        <div className="w-full flex gap-[42px] justify-end mr-[30px] mb-1">
          <button className="bg-[#494C52] shadow-inner inset-0  rounded-[15px] py-2 px-5 text-[#EAEAEA] text-[20px] font-semibold leading-normal mt-12 ml-[18px] w-[173px]">
            Start
          </button>
          <button className="rounded-[15px] py-2 px-5 text-[#EAEAEA] text-[20px] font-semibold leading-normal mt-12 ml-[18px] w-[173px] border-[3px] border-[#7C7C7C]">
            Result
          </button>
        </div>
      </div>
      <div className="bg-[#282828] rounded-[10px] w-[114px] h-[26px] flex gap-1 items-center justify-center ml-[26px] mb-[23px]">
        <img
          src="/assets/svgs/dashboard/clock-outline.svg"
          alt="clock"
          className="h-4 w-4"
        />
        <p className="text-[18px] font-[400] leading-normal text-[#9C9C9C]">
          5 min ago
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;
