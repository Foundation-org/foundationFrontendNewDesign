import { useEffect, useState } from "react";

export const Tooltip = ({ optionStatus }) => {
  const [tooltipStatus, setTooltipStatusState] = useState(optionStatus);

  useEffect(() => {
    setTooltipStatusState(optionStatus);
  }, [optionStatus]);

  return (
    <div>
      {tooltipStatus?.name === "Fail" && (
        <div
          className={`absolute ${
            tooltipStatus?.duplication ? "-top-[26px]" : "-top-[36px]"
          } left-0 -translate-x-1/2 transform laptop:left-1/2 ${
            tooltipStatus?.duplication
              ? "tablet:-top-[42px]"
              : "tablet:-top-[127px]"
          }`}
        >
          <div class="relative mx-2 flex flex-col items-end">
            <div
              className="relative -right-[7px] top-[10px] rounded-full bg-[#F34141] p-1 tablet:-right-4 tablet:top-[18px] tablet:p-2"
              onClick={() => {
                setTooltipStatusState("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[5px] w-[5px] text-white tablet:h-4 tablet:w-4 laptop:h-6 laptop:w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div class="bottom-full right-0 w-[7.3rem] rounded-md border-[0.533px] bg-[#FEDEDE] px-[0.35rem] py-[0.2rem] text-[0.4rem] font-normal text-[#F34141] dark:bg-[#3C1A20] dark:text-[#DB6262] tablet:w-[28rem] tablet:rounded-[15px] tablet:py-[18px] tablet:text-[1rem]">
              {tooltipStatus?.tooltipName}
              <svg
                class="absolute left-0 top-full -mt-[1px] h-2 w-full text-[#FEDEDE] dark:text-[#3C1A20] tablet:h-[28px]"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
                xml:space="preserve"
              >
                <polygon
                  class="fill-current"
                  points="0,0 127.5,127.5 255,0"
                  stroke="#F34141"
                  stroke-width="10"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// FEDEDE
