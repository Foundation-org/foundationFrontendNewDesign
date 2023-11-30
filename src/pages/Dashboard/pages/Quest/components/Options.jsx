import React from "react";
import { useSelector } from "react-redux";

const Options = ({
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
          : "flex flex-row  items-center gap-[25px]"
      } ml-[51px] mr-[71px] `}
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
            <div className="flex h-full w-[38px] items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
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
            <div className="flex w-full items-center justify-between pr-[45px]">
              <h1 className="py-[18px] pl-[45px] text-[30px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] ">
                {answer}
              </h1>
              <div className="flex gap-[55px]">
                {options && (
                  <div id="green-checkbox">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="h-10 w-10 rounded"
                      onChange={handleOptionSelect}
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
          <div className="flex h-[74px] w-[38px] items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
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
              className="w-full max-w-[838px] rounded-r-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-28 text-[30px] font-normal leading-[0px] text-[#435059]"
              onChange={(e) => handleChange(e.target.value)}
              value={typedValue}
            />
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 transform items-center">
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
                        className="h-[36px] cursor-pointer"
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
                        className="h-[36px] cursor-pointer"
                      />
                    </div>
                  )}
                </>
              ) : null}
              {/* {trash && optionsCount > 2 && (
                <div
                  onClick={() => {
                    removeOption(number);
                  }}
                >
                  <img
                    src="/assets/svgs/dashboard/trash2.svg"
                    alt="trash"
                    className="h-[36px] cursor-pointer"
                  />
                </div>
              )} */}

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

export default Options;
