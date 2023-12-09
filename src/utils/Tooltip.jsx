import { useEffect, useState } from "react";

export const Tooltip = ({ optionStatus }) => {

  const [tooltipStatus, setTooltipStatusState] = useState(optionStatus);

  useEffect(() => {
    setTooltipStatusState(optionStatus)
  }, [optionStatus])

  return (
    <div>
      {tooltipStatus.name === "Fail" && (
        <div className={`absolute ${tooltipStatus.duplication ? "-top-[26px]" : "-top-[36px]"} left-1/2 -translate-x-1/2 transform ${tooltipStatus.duplication ? "tablet:-top-[42px]" : "tablet:-top-[82px]"}`}>
          <div class="relative mx-2 flex flex-col items-end">
            <svg
              className="relative top-1 right-0 translate-x-1/2 tablet:h-3.5 tablet:w-3.5 h-2 w-2 text-[#F34141] color-[#F34141] border border-[#F34141] rounded-full bg-white"
              fill="#F34141"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              xml:space="preserve"
              onClick={() => {setTooltipStatusState("")}}
            >
              <g>
                <g>
                  <polygon
                    points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 
			512,452.922 315.076,256 		"
                  />
                </g>
              </g>
            </svg>
            <div class="bottom-full right-0 w-[7.3rem] rounded border-[0.533px] bg-[#FEDEDE] px-[0.35rem] py-[0.2rem] text-[0.3rem] font-normal text-[#F34141] dark:bg-[#3C1A20] dark:text-[#DB6262] tablet:w-[28rem] tablet:text-[1.25rem]">
              {tooltipStatus.tooltipName}
              <svg
                class="absolute left-0 top-full h-2 w-full text-[#FEDEDE] dark:text-[#3C1A20]"
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
