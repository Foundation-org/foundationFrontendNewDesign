import { useSelector } from "react-redux";

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
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label
          ? "flex flex-col gap-[13px]"
          : "flex flex-row items-center gap-[25px]"
      } absolute -top-6 left-[21px] w-[95%] tablet:left-[57px] tablet:top-[-74px] tablet:w-[88%]`}
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
        <div className="flex">
          <div className="mt-[1px] flex h-[22.6px] w-[13.4px] items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[2.31px] pb-[6.4px] pt-[6.7px] dark:bg-[#9E9E9E] tablet:h-[46.4px] tablet:w-[28px] tablet:px-[7px] tablet:pb-[13px] tablet:pt-[14px] xl:h-[74px] xl:w-[38px]">
            {dragable ? (
              persistedTheme === "dark" ? (
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
              )
            ) : null}
          </div>
          <div className="relative h-[75px] w-full">
            <input
              type="text"
              placeholder="option"
              className="w-full max-w-[90%] rounded-r-[4.898px] border-[1px] border-l-0 border-[#ACACAC] bg-white py-[4.26px] pl-[15.4px] pr-[70px] text-[10px] font-normal leading-[0px] text-[#435059] focus-visible:outline-none tablet:rounded-r-[11.284px] tablet:pb-[9.8px] tablet:pl-9 tablet:pr-44 tablet:pt-[11.6px] tablet:text-[20.7px] xl:max-w-[838px] xl:rounded-r-2xl xl:py-[18px] xl:text-[30px]"
              onChange={(e) => handleChange(e.target.value)}
              value={typedValue}
            />
            <div
              className={`${
                optionsCount > 2
                  ? "absolute left-[208px] tablet:left-[42rem]"
                  : "absolute left-[221px] tablet:left-[24rem] xl:left-[44rem]"
              } -top-[22px] flex w-fit items-center tablet:-top-[46px] xl:-top-[74px]`}
            >
              {title === "RankChoice" && trash ? (
                <>
                  {optionsCount > 2 && (
                    <div
                      onClick={() => {
                        removeOption(number);
                      }}
                      className="flex items-center"
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
                        className="h-[36px] cursor-pointer"
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

export default Options;
