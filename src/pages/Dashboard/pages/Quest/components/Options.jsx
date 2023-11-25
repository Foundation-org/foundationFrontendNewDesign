import React from "react";
import { useSelector } from "react-redux";

const Options = ({
  number,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
  isYes,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label
          ? "flex flex-col gap-[13px]"
          : "flex flex-row  items-center gap-[25px]"
      } ml-[51px] mr-[71px] `}
    >
      {label && (
        <h1 className="text-[#C5C5C5] text-[25px] font-normal leading-normal ml-[53px]">
          {label}
        </h1>
      )}
      {number && (
        <h1 className="text-[#435059] dark:text-[#D3D3D3] text-[33px] font-[500] leading-normal">
          {number}
        </h1>
      )}
      <div className="bg-white dark:bg-[#0D1012] rounded-[10px] w-full flex justify-between">
        <div className="flex items-center w-full">
          <div className="rounded-l-[10px] h-full w-[38px] bg-[#DEE6F7] dark:bg-[#9E9E9E] px-[7px] pt-[14px] pb-[13px] flex items-center justify-center">
            {dragable ? (
              persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/six-dots-dark.svg"
                  alt="six dots"
                  className="h-7"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/six-dots.svg"
                  alt="six dots"
                  className="h-7"
                />
              )
            ) : null}
          </div>
          <div className="flex justify-between items-center w-full pr-[45px]">
            <h1 className="text-[#435059] dark:text-[#D3D3D3] text-[30px] font-normal leading-normal py-[18px] pl-[45px] ">
              {answer}
            </h1>
            <div className="flex gap-[55px]">
              {options && (
                <div id="green-checkbox">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    className="w-10 h-10 rounded"
                    onChange={handleOptionChange}
                    checked={isYes}
                  />
                </div>
              )}
              {trash && (
                <img src="/assets/svgs/dashboard/trash2.svg" alt="trash" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
