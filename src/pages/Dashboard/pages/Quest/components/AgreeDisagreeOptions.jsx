import React from "react";
import { useSelector } from "react-redux";

const AgreeDisagreeOptions = ({
  number,
  title,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
  handleOptionSelect,
  isYes,
  allowInput,
  handleChange,
  typedValue,
  isSelected,
  optionsCount,
  removeOption,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label
          ? "flex flex-col gap-[13px]"
          : "flex flex-row items-center gap-[25px]"
      } ml-[21px] mr-[22.4px] tablet:ml-[51px] tablet:mr-[71px]`}
    >
      {label && (
        <h1 className="ml-[53px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          {label}
        </h1>
      )}
      {number && (
        <h1 className="text-[33px] font-[500] leading-normal text-[#435059] dark:text-[#D3D3D3]">
          {number}
        </h1>
      )}
      {!allowInput ? (
        <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
          <div className="flex w-full items-center">
            <div className="flex h-full w-[14.7px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] px-[7px] py-[6px] dark:bg-[#9E9E9E] tablet:w-[38px] tablet:rounded-l-[10px] tablet:pb-[13px] tablet:pt-[14px]">
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
            <div className="laptop:h-[75px] laptop:rounded-r-2xl flex h-[22.5px] w-full items-center justify-between rounded-r-[4.89px] border-b-[1px] border-r-[1px] border-t-[1px] border-[#ACACAC] tablet:h-[46.4px] tablet:rounded-r-[11.284px] ">
              <h1 className=" laptop:text-[30px] w-full pl-[15.44px] text-[10px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pl-[45px] tablet:text-[20.7px] ">
                {answer}
              </h1>
              <div className="flex gap-[55px]">
                {options && (
                  <div id="green-checkbox">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="h-10 w-10 rounded"
                      onChange={handleOptionChange}
                      checked={isSelected}
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
      ) : (
        <div className="flex items-center">
          <div className="laptop:h-[74px] laptop:w-[40px] flex h-[24.8px] w-[13.46px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] px-[7px] dark:bg-[#9E9E9E] tablet:mt-0 tablet:h-[49.6px] tablet:w-[28.2px] tablet:rounded-l-[10.3px] tablet:pb-[13px] tablet:pt-[14px]">
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
          <div className="relative w-full">
            <input
              className="laptop:py-[18px] laptop:text-[1.875rem] w-full border-y-[1px] border-[#ACACAC] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:text-[#7C7C7C] tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem]"
              onChange={(e) => handleChange(e.target.value)}
              value={typedValue}
            />
            <div className="absolute right-[60px] top-1/2 flex -translate-y-1/2 transform items-center">

            <h1 className="leading-0 ml-4 border-l-2 border-[#F3F3F3] px-6 text-[30px] font-semibold text-[#0FB063]">
                OK
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreeDisagreeOptions;
