import React from "react";
import { useSelector } from "react-redux";

const MultipleChoiceOptions = ({
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
  number,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label
          ? "flex flex-col gap-[13px]"
          : "flex flex-row  items-center gap-[25px]"
      } mx-[21px] mr-[22.4px] tablet:ml-[51px] tablet:mr-[71px]`}
    >
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
            <div className="flex h-[22.5px] w-full items-center justify-between rounded-r-[4.89px] border-b-[1px] border-r-[1px] border-t-[1px] border-[#ACACAC] tablet:h-[46.4px] tablet:rounded-r-[11.284px] xl:h-[75px] xl:rounded-r-2xl ">
              <h1 className=" w-full pl-[15.44px] text-[10px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pl-[45px] tablet:text-[20.7px] xl:text-[30px] ">
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
        <div className="flex">
          <div className="mt-[1px] flex h-[22.8px] w-[13.46px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] px-[7px] dark:bg-[#9E9E9E] tablet:mt-0 tablet:h-[46.4px] tablet:w-[28.2px] tablet:rounded-l-[10px] tablet:pb-[13px] tablet:pt-[14px] xl:h-[74px] xl:w-[40px]">
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
              type="text"
              placeholder="option"
              className="tablet:pr-45 w-full max-w-[838px] rounded-r-[5.387px] border-b-[1px] border-r-[1px] border-t-[1px] border-[#ACACAC] bg-white py-[4.56px] pl-[15.44px] pr-[55px] text-[10px] font-normal leading-[0px] text-[#435059] tablet:rounded-r-[11.284px] tablet:pb-[9.83px] tablet:pl-9 tablet:pt-[11.61px] tablet:text-[20.73px] xl:rounded-r-2xl xl:py-[18px] xl:text-[30px] "
              onChange={(e) => handleChange(e.target.value)}
              value={typedValue}
            />
            <div className="absolute right-[2px] top-[14px] flex -translate-y-1/2 transform items-center tablet:right-0 tablet:top-1/2">
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
              {title === "RankChoice" && trash ? (
                <>
                  {optionsCount > 0 && (
                    <div
                      onClick={() => {
                        removeOption(number);
                      }}
                    >
                      <img
                        src="/assets/svgs/dashboard/trash2.svg"
                        alt="trash"
                        className="h-[13.2px] cursor-pointer tablet:h-[36px]"
                      />
                    </div>
                  )}
                </>
              ) : title === "MultipleChoice" && trash ? (
                <>
                  {optionsCount > 2 && (
                    <div
                      onClick={() => {
                        removeOption(number);
                      }}
                    >
                      <img
                        src="/assets/svgs/dashboard/trash2.svg"
                        alt="trash"
                        className="h-[13.2px] cursor-pointer tablet:h-[36px]"
                      />
                    </div>
                  )}
                </>
              ) : null}
              <h1 className="leading-0 border-l-2 border-[#F3F3F3] px-[7px] text-[8px] font-semibold text-[#0FB063] tablet:pr-[26px] tablet:text-[17.54px] xl:pl-6 xl:pr-9 xl:text-[30px]">
                OK
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceOptions;
