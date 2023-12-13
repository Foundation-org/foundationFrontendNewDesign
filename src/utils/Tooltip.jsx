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
              className="relative -right-[7px] top-[10px]  rounded-full bg-[#F34141] p-1 tablet:-right-4 tablet:top-[18px] tablet:p-2"
              onClick={() => {
                setTooltipStatusState("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white tablet:h-4 tablet:w-4 laptop:h-6 laptop:w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              {/* <svg
                className="color-[#F34141] relative right-0 top-1 h-2 w-2 translate-x-1/2 rounded-full border border-[#F34141] bg-white text-[#F34141] tablet:h-3.5 tablet:w-3.5"
                fill="#F34141"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xml:space="preserve"
                onClick={() => {
                  setTooltipStatusState("");
                }}
              >
                <g>
                  <g>
                    <polygon
                      points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 
			512,452.922 315.076,256 		"
                    />
                  </g>
                </g>
              </svg> */}
            </div>
            <div class="bottom-full right-0 w-[7.3rem] rounded-[15px] border-[0.533px] bg-[#FEDEDE] px-[0.35rem] py-[0.2rem] text-[0.3rem] font-normal text-[#F34141] dark:bg-[#3C1A20] dark:text-[#DB6262] tablet:w-[28rem] tablet:py-[18px] tablet:text-[1rem]">
              {tooltipStatus?.tooltipName}
              <svg
                class="absolute left-0 top-full h-2 w-full text-[#FEDEDE] dark:text-[#3C1A20] tablet:h-[28px]"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
                xml:space="preserve"
              >
                <polygon
                  class="fill-current"
                  points="0,0 127.5,127.5 255,0"
                  stroke="#F34141"
                  stroke-width="16"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
