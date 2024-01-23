import React from "react";
import { useSelector } from "react-redux";

const YesNoOptions = ({
  number,
  title,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
  handleOptionSelect,
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
      } ml-[21px] mr-[41px] tablet:mx-[60px]`}
    >
      {!allowInput ? (
        <div className="w-full">
          {/* <p className="mb-[10px] w-full pl-[15.44px] text-[10px] font-normal leading-none text-[#85898C] dark:text-[#D3D3D3] tablet:pl-6 tablet:text-[20.7px] laptop:text-[16px]">
            Option {number} #
          </p> */}
          <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
            <div className="flex w-full items-center">
              <div className="flex h-full w-[11.39px] items-center justify-center rounded-l-[5.387px] border-y-[3px] border-s-[3px] border-[#DEE6F7] bg-[#DEE6F7] px-[0px] py-[6px] dark:bg-[#9E9E9E] tablet:w-[23.5px] tablet:rounded-l-[10px] tablet:pb-[13px] tablet:pt-[14px] laptop:w-[25.2px]">
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
              <div className="flex h-[24.8px] w-full items-center justify-between rounded-r-[4.89px] border-y-[3px] border-r-[3px] border-[#DEE6F7] dark:border-[#0D1012] tablet:h-[51px] tablet:rounded-r-[10px] laptop:h-[45px]">
                <h1 className="w-full pl-[15.44px] text-[10px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pl-5 tablet:text-[20.7px] laptop:text-[18px]">
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
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex h-[24.8px] w-[13.46px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] px-[7px] dark:bg-[#9E9E9E] tablet:mt-0 tablet:h-[49.6px] tablet:w-[28.2px] tablet:rounded-l-[10.3px] tablet:pb-[13px] tablet:pt-[14px] laptop:h-[74px] laptop:w-[40px]">
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
              className="w-full border-y-[1px] border-[#ACACAC] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:text-[#7C7C7C] tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem] laptop:py-[18px] laptop:text-[1.875rem]"
              onChange={(e) => handleChange(e.target.value)}
              value={typedValue}
            />
            <div className="absolute right-[60px] top-1/2 flex -translate-y-1/2 transform items-center">
              {options && (
                <div id="green-checkbox" className="-mb-[7px] mr-6">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    className="h-10 w-[38px] rounded"
                    onChange={handleOptionSelect}
                    checked={isSelected}
                  />
                </div>
              )}

              <h1 className="leading-0 ml-4 border-l-2 border-[#F3F3F3] px-6 text-[30px] font-semibold text-[#0FB063]">
                Go Back
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YesNoOptions;
