// import React from "react";
import { useSelector } from "react-redux";
import "react-tooltip/dist/react-tooltip.css";
// import { Tooltip } from "react-tooltip";

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
  answerVerification,
  optionStatus,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label
          ? "flex flex-col gap-[13px]"
          : "flex flex-row  items-center gap-[25px]"
      } ml-[21px] mr-[22.4px] tablet:ml-[51px] tablet:mr-[71px]`}
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
        <div className="flex items-center">
          <div className="flex h-[23.9px] w-[13.46px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] px-[7px] dark:bg-[#9E9E9E] tablet:mt-0 tablet:h-[46.4px] tablet:w-[28.2px] tablet:rounded-l-[10px] tablet:pb-[13px] tablet:pt-[14px] xl:h-[74px] xl:w-[40px]">
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
          <div className="w-full">
            {/* <input
              type="text"
              placeholder="option"
              className="tablet:pr-45 w-full max-w-[838px] rounded-r-[5.387px] border-b-[1px] border-r-[1px] border-t-[1px] border-[#ACACAC] bg-white py-[4.56px] pl-[15.44px] pr-[55px] text-[10px] font-normal leading-[0px] text-[#435059] tablet:rounded-r-[11.284px] tablet:pb-[9.83px] tablet:pl-9 tablet:pt-[11.61px] tablet:text-[20.73px] xl:rounded-r-2xl xl:py-[18px] xl:text-[30px] "
              onChange={(e) => handleChange(e.target.value)}
              onBlur={(e) => e.target.value.trim() !== "" && answerVerification(e.target.value.trim())}
              value={typedValue}
            /> */}
            <div className="flex w-full">
              <input
                className="w-full rounded-l-[0.33rem] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:text-[#7C7C7C]"
                // className="input join-item input-bordered input-lg h-[4.7rem] w-full bg-white text-3xl text-black"
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) =>
                  e.target.value.trim() !== "" &&
                  answerVerification(e.target.value.trim())
                }
                value={typedValue}
              />
              <div className="relative">
                <button
                  id={`test${number}`}
                  data-tooltip-offset={-25}
                  className={`rounded-r-[0.33rem] bg-white text-[0.5rem] font-semibold dark:border-[#222325] text-[${optionStatus.color}]  py-[0.29rem]`}
                  // className={`join-item btn-lg h-[4.7rem] bg-white text-3xl font-semibold ${optionStatus.color}`}
                >
                  <div className="border-l-[0.7px] px-[1.25rem]">
                    {optionStatus.name}
                  </div>
                </button>
                {/* tooltip */}
                {optionStatus.name === "Fail" && (
                  <div className="absolute -top-[22px] left-1/2 -translate-x-1/2 transform">
                    <div class="relative mx-2">
                      <div class="bottom-full right-0 w-[7.3rem] rounded bg-[#3C1A20] px-[0.35rem] py-[0.2rem] text-[0.3rem] font-normal text-[#DB6262]">
                        {optionStatus.tooltipName}
                        <svg
                          class="absolute left-0 top-full h-2 w-full text-black"
                          x="0px"
                          y="0px"
                          viewBox="0 0 255 255"
                          xml:space="preserve"
                        >
                          <polygon
                            class="fill-current"
                            points="0,0 127.5,127.5 255,0"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

              {/* <div className={`tooltip ${optionStatus.tooltipStyle}`} data-tip={optionStatus.tooltipName}>
            <h1 className={`leading-0 border-none cursor-pointer px-6 text-[30px] font-semibold ${optionStatus.color}`}>
              {optionStatus.name}
            </h1>
          </div> */}
            </div>
            {/* <Tooltip
              anchorSelect={`#test${number}`}
              isOpen={optionStatus.name === "Fail" && true}
              border="1px solid red"
              style={{
                backgroundColor: "#fbdfe4",
                color: "#222",
                border: "red",
                width: "auto",
                marginRight: "3rem",
              }}
              place="top"
            >
              {optionStatus.tooltipName}
            </Tooltip> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceOptions;
