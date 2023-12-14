import { useSelector } from "react-redux";
import { Tooltip } from "../../../../../utils/Tooltip";
// import "react-tooltip/dist/react-tooltip.css";
// import { Tooltip } from "react-tooltip";

const Options = ({
  title,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
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
          : "flex flex-row items-center gap-[25px]"
        // }  w-[95%] tablet:w-[88%] laptop:w-[87%]`}
      } mr-[0px] w-[95%] tablet:mr-[70.4px] `}
    >
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
          <div className="w-full">
            <div className="w-[calc(100%-51.55px] mr-[22.4px] flex tablet:ml-0 tablet:mr-0 tablet:w-full">
              <input
                className="w-full border-y-[1px] border-[#ACACAC] bg-white py-[0.35rem] pl-6 pr-[9.24px] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem] laptop:py-[18px] laptop:text-[1.875rem]"
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) =>
                  e.target.value.trim() !== "" &&
                  answerVerification(e.target.value.trim())
                }
                value={typedValue}
                placeholder="Add you own option"
              />
              {(title === "RankChoice" || title === "MultipleChoice") &&
                trash && (
                  <button
                    id={`test${number}`}
                    className={`border-y-[1px] border-[#ACACAC]  bg-white text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] xl:text-[1.875rem] tablet:text-[17.54px] ${optionStatus?.color} py-[0.29rem]`}
                  >
                    <div className="pr-[1.25rem] tablet:pr-[2.4rem]">
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
                              className="min-w-[.6rem] cursor-pointer tablet:min-w-[1.5rem]"
                            />
                          </div>
                        )}
                      </>
                    </div>
                  </button>
                )}
              <button
                id={`test${number}`}
                className={`relative rounded-r-[0.33rem] border-y-[1px] border-r-[1px] border-[#ACACAC] bg-white text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:text-[17.54px] laptop:rounded-r-2xl laptop:text-[1.875rem] ${optionStatus.color}`}
              >
                <div className="border-l-[0.7px] px-[1.25rem] tablet:px-[2.4rem]">
                  <span>{optionStatus.name}</span>
                </div>
                <Tooltip optionStatus={optionStatus} />
              </button>
            </div>
            <div
              className={`${
                optionsCount > 2
                  ? "absolute left-[208px] tablet:left-[42rem]"
                  : "absolute left-[221px] tablet:left-[24rem] laptop:left-[44rem]"
              } -top-[22px] flex w-fit items-center tablet:-top-[46px] laptop:-top-[74px]`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
