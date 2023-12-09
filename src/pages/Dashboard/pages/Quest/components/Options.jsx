import { useSelector } from "react-redux";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

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
  optionStatus
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label
          ? "flex flex-col gap-[13px]"
          : "flex flex-row  items-center gap-[25px]"
      } absolute left-[56px] top-[-74px] w-[88%]`}
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
          <div className="relative h-[75px] w-full">
            {/* <input
              type="text"
              placeholder="option"
              className="w-full max-w-[838px] rounded-r-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-44 text-[30px] font-normal leading-[0px] text-[#435059] focus-visible:outline-none"
              onChange={(e) => handleChange(e.target.value)}
              onBlur={(e) => e.target.value.trim() !== "" && answerVerification(e.target.value.trim())}
              value={typedValue}
            /> */}
            <div className="join w-full">
              <input 
                className="input input-bordered input-lg w-full join-item bg-white text-black text-3xl h-[4.7rem]"
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => e.target.value.trim() !== "" && answerVerification(e.target.value.trim())}
                value={typedValue}
              />
              <button id={`test${number}`} data-tooltip-offset={-25} className={`btn-lg join-item bg-white text-3xl font-semibold h-[4.7rem] ${optionStatus.color}`}>{optionStatus.name}</button>
            </div>
            <div
              className={`${
                optionsCount > 2
                  ? "absolute left-[42rem]"
                  : "absolute left-[44rem]"
              } -top-[74px] flex w-fit items-center`}
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
              {/* <h1 className={`leading-0 ml-4 border-l-2 border-[#F3F3F3] pr-9 pl-6 text-[30px] font-semibold ${optionStatus?.color}`}>
                {optionStatus?.name}
              </h1> */}
              {/* <div className={`tooltip mt-8 ${optionStatus.tooltipStyle}`} data-tip={optionStatus.tooltipName}>
                <h1 className={`leading-0 border-none cursor-pointer ml-4 px-6 text-[30px] font-semibold ${optionStatus.color}`}>
                  {optionStatus.name}
                </h1>
              </div> */}
            </div>
              <Tooltip anchorSelect={`#test${number}`} isOpen={optionStatus.name === "Fail" && true} border="1px solid red" style={{ backgroundColor: "#fbdfe4", color: "#222", border: "red", width: 'auto', marginRight: "3rem" }} place="top">
            {/* <span className="indicator-item cursor-pointer" onClick={() => setCheckQuestionStatus(reset)}>
              <button className="btn btn-xs btn-circle" onClick={() => setCheckQuestionStatus(reset)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>  */}
            {optionStatus.tooltipName}
          </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
