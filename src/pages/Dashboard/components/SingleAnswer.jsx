import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { getQuests } from "../../../features/quest/questsSlice";

const SingleAnswer = (props) => {
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);

    const fetchSelectedPercentage = () => {
      const percentageKey =
        props.answer === "Yes" || props.answer === "Agree" ? "Yes" : "No";
  
      const selectedPercentage = props.percentages?.selectedPercentage?.[
        percentageKey
      ];
  
      if (selectedPercentage !== 0 && selectedPercentage!==undefined) {
        return selectedPercentage === 100
          ? <span className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}>100%</span>
          : <span className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}>
              {selectedPercentage + "%"}
            </span>;
      } else {
        return <span className={`w-[4ch] whitespace-nowrap ${
          persistedTheme === "dark" ? "text-white" : ""
        }`}>0%</span>;
      }
    };
  
    const fetchContendedPercentage = () => {
      const percentageKey =
        props.answer === "Yes" || props.answer === "Agree" ? "Yes" : "No";
    
      const contendedPercentage = props.percentages?.contendedPercentage?.[
        percentageKey
      ];
    
      if (contendedPercentage !== 0 && contendedPercentage!==undefined) {
        return contendedPercentage === 100 || contendedPercentage === 0
          ? <span className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}>{contendedPercentage + "%"}</span>
          : <span className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}>0%</span>;
      } else {
        return <span className={`w-[4ch] whitespace-nowrap ${
          persistedTheme === "dark" ? "text-white" : ""
        }`}>0%</span>;
      }
    };
    
  

  

  return (
    <div className="ml-[30px] mr-[36px] flex items-center gap-[14px] tablet:mx-[72px] tablet:gap-[25px] 2xl:mx-[85px]">
      <h1 className="min-w-[12px] text-[9.4px] font-[500] leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:w-[26px] tablet:min-w-[26px] tablet:text-[20px]">
        {props.number}
      </h1>
      <div className="flex w-full justify-between rounded-[4.73px] bg-white dark:bg-[#0D1012] tablet:rounded-[10px]">
        <div className="flex items-center">
          {!props.checkInfo && (
            <div className="h-full w-fit rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
              {persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/six-dots-dark.svg"
                  alt="six dots"
                />
              ) : (
                <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
              )}
            </div>
          )}
          <h1 className="ml-8 pb-[5.7px] pt-[5.6px] text-[8.52px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pb-[10px] tablet:pt-[12px] tablet:text-[19px] ">
            {props.answer}
          </h1>
        </div>
        {/* to show ranked and multiple choice options */}
        {!props.checkInfo ? (
          <div className="mr-[20.63px] flex items-center gap-[37px]">
            <img
              src="/assets/svgs/dashboard/edit.svg"
              alt="edit"
              className="h-[19.942px] w-[16px]"
            />
            <img
              src="/assets/svgs/dashboard/trash.svg"
              alt="trash"
              className="h-[19.942px] w-[16px]"
            />
          </div>
        ) : (
          <div className="mr-[20.63px] flex items-center gap-[10.3px] text-[9.2px] tablet:gap-[22px] tablet:text-[16px] ">
            <div
              className="flex h-[10.48px] w-[10.48px] cursor-pointer items-center justify-center rounded-full bg-[#0DD76A] tablet:h-[30px] tablet:w-[30px]"
              onClick={
                props.btnText === "Results"
                  ? null
                  : () => props.handleToggleCheck(props.answer, true, false)
              }
            >
              {props.check ? (
                <>
                  <FaCheck className="h-[8px] w-[10px] text-white tablet:h-[19.942px] tablet:w-[20px]" />
                </>
              ) : null}
            </div>
            {props.btnText === "Results" ? (
              <>{fetchSelectedPercentage()}</>
            ) : (
              <></>
            )}
            <div
              className="flex h-[10.48px] w-[10.48px] cursor-pointer items-center justify-center rounded-full bg-[#FFD600] tablet:h-[30px] tablet:w-[30px]"
              onClick={
                props.btnText === "Results"
                  ? null // or use an empty function: () => {}
                  : () => props.handleToggleCheck(props.answer, false, true)
              }
            >
              {props.contend ? (
                <>
                  <FaExclamation className="h-[7.73px] w-[10px] text-white tablet:h-[19.942px] tablet:w-[16px]" />
                </>
              ) : null}
            </div>
            {props.btnText === "Results" ? (
              <>{fetchContendedPercentage()}</>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswer;
