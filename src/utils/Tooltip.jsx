import { useEffect, useState } from 'react';

export const Tooltip = ({ optionStatus }) => {
  const [tooltipStatus, setTooltipStatusState] = useState(optionStatus);

  useEffect(() => {
    setTooltipStatusState(optionStatus);
  }, [optionStatus]);

  return (
    <div>
      {tooltipStatus?.name === 'Rejected' && (
        <div
          className={`absolute w-32 sm:w-[186px] md:w-52 xl:w-48 ${
            tooltipStatus?.duplication ? '-top-[31px]' : '-top-[55px]'
          } left-0 -translate-x-1/2 transform tablet:-left-[12px] laptop:left-1/2 ${
            tooltipStatus?.duplication ? 'tablet:-top-[100px]' : 'tablet:-top-[127px]'
          }`}
        >
          <div className="relative mx-2 flex flex-col items-end text-center">
            <div
              className="relative -right-[7px] top-[10px] rounded-full bg-[#F34141] p-[2px] tablet:-right-4 tablet:top-[18px] tablet:p-2"
              onClick={() => {
                setTooltipStatusState('');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[8px] w-[8px] text-white tablet:h-4 tablet:w-4 laptop:h-6 laptop:w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="bottom-full right-0 w-[11rem] rounded-md border-[0.533px] bg-[#FEDEDE] px-[0.32rem] py-[0.2rem] text-[0.5rem] font-normal text-[#F34141] tablet:w-[28rem] tablet:rounded-[15px] tablet:py-[18px] tablet:text-[1rem] dark:bg-[#3C1A20] dark:text-[#DB6262]">
              {tooltipStatus?.tooltipName}
              <svg
                className="absolute left-[27px] top-full -mt-[1px] h-2 w-full text-[#FEDEDE] tablet:left-[65px] tablet:h-[28px] laptop:left-[0px] dark:text-[#3C1A20]"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
                xmlSpace="preserve"
              >
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" stroke="#F34141" strokeWidth="10" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {tooltipStatus?.name === 'Duplicate' && (
        <div
          className={`absolute w-32 sm:w-[186px] md:w-52 xl:w-48 ${
            tooltipStatus?.duplication ? '-top-[31px]' : '-top-[55px]'
          } left-0 -translate-x-1/2 transform tablet:-left-[12px] laptop:left-1/2 ${
            tooltipStatus?.duplication ? 'tablet:-top-[100px]' : 'tablet:-top-[127px]'
          }`}
        >
          <div className="relative mx-2 flex flex-col items-end text-center">
            <div
              className="relative -right-[7px] top-[10px] rounded-full bg-[#C89E0A] p-[2px] tablet:-right-4 tablet:top-[18px] tablet:p-2"
              onClick={() => {
                setTooltipStatusState('');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[8px] w-[8px] text-white tablet:h-4 tablet:w-4 laptop:h-6 laptop:w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="bottom-full right-0 rounded-md border-[0.533px] bg-[#FCF324] py-[0.2rem] text-[0.5rem] font-normal text-[#9B7A06] w-fit px-4 tablet:rounded-[15px] tablet:py-[18px] tablet:text-[1rem] dark:bg-[#FCF324] dark:text-[#9B7A06]">
              {tooltipStatus?.tooltipName}
              <svg
                className="absolute left-[27px] top-full -mt-[1px] h-2 w-full text-[#FCF324] tablet:left-[65px] tablet:h-[28px] laptop:left-[0px] dark:text-[#FCF324]"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
                xmlSpace="preserve"
              >
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" stroke="#9B7A06" strokeWidth="10" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// FEDEDE
