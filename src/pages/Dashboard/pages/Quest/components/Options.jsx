import { useSelector } from "react-redux";
import { Tooltip } from "../../../../../utils/Tooltip";

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
      } w-full`}
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
        <div className="flex w-full items-center justify-center">
          <div className="mx-[21px] flex w-full rounded-r-[0.33rem] bg-transparent tablet:ml-[54px] tablet:mr-[70px] tablet:w-full tablet:rounded-[10.3px] laptop:rounded-2xl">
            <div className="dragIconWrapper">
              {persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/six-dots-dark.svg"
                  alt="six dots"
                  className="h-[8.8px] tablet:h-7"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/six-dots.svg"
                  alt="six dots"
                  className="h-[8.8px] tablet:h-7"
                />
              )}
            </div>
            <div className="h-[25.19px] w-9 border-y-[1px] border-[#ACACAC] bg-white dark:border-[#0D1012] dark:bg-[#0D1012] tablet:h-[50.19px] laptop:h-[74px]"></div>
            <input
              className="h-[25.19px] w-full border-y-[1px] border-[#ACACAC] bg-white py-[0.35rem] pr-[9.24px] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:h-[50.19px] tablet:py-[11.6px] tablet:pr-11 tablet:text-[1.296rem] laptop:h-[74px] laptop:py-[18px] laptop:text-[1.875rem]"
              onChange={(e) => handleChange(e.target.value)}
              onBlur={(e) =>
                e.target.value.trim() !== "" &&
                answerVerification(e.target.value.trim())
              }
              value={typedValue}
              placeholder="Add your own option"
            />
            <div
              id={`test${number}`}
              className={`relative flex h-[25.19px] items-center rounded-r-[0.33rem] border-y-[1px] border-r-[1px] border-[#ACACAC] bg-white text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] tablet:h-[50.19px] tablet:rounded-r-[10.3px] tablet:text-[17.54px] laptop:h-[74px] laptop:rounded-r-2xl laptop:text-[1.875rem] ${optionStatus.color}`}
            >
              <div className="flex w-[50px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[166px]">
                <span>{optionStatus.name}</span>
              </div>
              <Tooltip optionStatus={optionStatus} />
            </div>
            {(title === "RankChoice" || title === "MultipleChoice") &&
              trash && (
                <div
                  id={`test${number}`}
                  className={`flex h-[25.19px] items-center text-[0.5rem] font-semibold dark:bg-[#141618] xl:text-[1.875rem] tablet:h-[50.19px] tablet:text-[17.54px] laptop:h-[74px] ${optionStatus?.color} py-[0.29rem]`}
                >
                  <div className="flex w-5 items-center justify-center tablet:w-[52.78px]">
                    <>
                      {optionsCount > 3 && (
                        <div
                          onClick={() => {
                            removeOption(number);
                          }}
                        >
                          <img
                            src="/assets/svgs/dashboard/trash2.svg"
                            alt="trash"
                            className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
                          />
                        </div>
                      )}
                    </>
                  </div>
                </div>
              )}
          </div>

          <div
            className={`${
              optionsCount > 2
                ? "absolute left-[208px] tablet:left-[42rem]"
                : "absolute left-[221px] tablet:left-[24rem] laptop:left-[44rem]"
            } -top-[22px] flex w-fit items-center tablet:-top-[46px] laptop:-top-[74px]`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Options;
