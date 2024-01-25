import React from 'react';
import { useSelector } from 'react-redux';

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
        label ? 'flex flex-col gap-[13px]' : 'flex flex-row items-center gap-[25px]'
      } ml-[22px] mr-[42px] tablet:ml-[60px] tablet:mr-[112px]`}
    >
      <div className="w-full">
        <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
          <div className="flex w-full items-center">
            <div className="flex h-full w-[11.39px] items-center justify-center rounded-l-[5.387px] border-y border-s border-[#DEE6F7] bg-[#DEE6F7] px-[0px] py-[6px] dark:bg-[#9E9E9E] tablet:w-[23.5px] tablet:rounded-l-[10px] tablet:border-y-[3px] tablet:border-s-[3px] tablet:pb-[13px] tablet:pt-[14px] laptop:min-w-[25.2px] laptop:w-[25.2px]">
              {dragable ? (
                persistedTheme === 'dark' ? (
                  <img src="/assets/svgs/dashboard/six-dots-dark.svg" alt="six dots" className="h-7" />
                ) : (
                  <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" className="h-7" />
                )
              ) : null}
            </div>
            <div className="flex h-[24.8px] w-full items-center justify-between rounded-r-[4.89px] border-y border-r border-[#DEE6F7] dark:border-[#0D1012] tablet:h-[51px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] laptop:h-[45px]">
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
                {trash && <img src="/assets/svgs/dashboard/trash2.svg" alt="trash" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreeDisagreeOptions;
