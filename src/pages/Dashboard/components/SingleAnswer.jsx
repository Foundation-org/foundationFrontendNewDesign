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

    const selectedPercentage =
      props.percentages?.selectedPercentage?.[percentageKey];

    if (selectedPercentage !== 0 && selectedPercentage !== undefined) {
      return selectedPercentage === 100 ? (
        <span
          className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}
        >
          100%
        </span>
      ) : (
        <span
          className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}
        >
          {selectedPercentage + "%"}
        </span>
      );
    } else {
      return (
        <span
          className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}
        >
          0%
        </span>
      );
    }
  };

  const fetchContendedPercentage = () => {
    const percentageKey =
      props.answer === "Yes" || props.answer === "Agree" ? "Yes" : "No";

    const contendedPercentage =
      props.percentages?.contendedPercentage?.[percentageKey];

    if (contendedPercentage !== 0 && contendedPercentage !== undefined) {
      return contendedPercentage === 100 || contendedPercentage === 0 ? (
        <span
          className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}
        >
          {contendedPercentage + "%"}
        </span>
      ) : (
        <span
          className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}
        >
          0%
        </span>
      );
    } else {
      return (
        <span
          className={`w-[4ch] whitespace-nowrap ${
            persistedTheme === "dark" ? "text-white" : ""
          }`}
        >
          0%
        </span>
      );
    }
  };

  return (
    <div className="ml-[30px] mr-[36px] flex items-center gap-[14px] 2xl:mx-[85px] tablet:mx-[72px] tablet:gap-[25px]">
      <div className="flex w-full justify-between rounded-[4.73px] bg-white dark:bg-[#0D1012] tablet:rounded-[10px]">
        <div className="flex items-center">
          <div className="flex h-full w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] dark:bg-[#9E9E9E] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px]"></div>
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
          <h1 className="ml-[15.8px] pb-[5.7px] pt-[5.6px] text-[8.52px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pb-[10px] tablet:pt-[12px] tablet:text-[19px] ">
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
          <div
            className={`mr-1 flex items-center gap-[10.3px] text-[9.2px] tablet:mr-[20.63px] tablet:gap-[22px] tablet:text-[16px] ${
              props.btnText === "Results" ? "pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-1 tablet:gap-3">
              <div id="custom-checkbox" className="flex h-full items-center">
                <input
                  id="small-checkbox"
                  type="checkbox"
                  className="checkbox h-[10.4px] w-[10.4px] rounded-[2px] tablet:h-5 tablet:w-5"
                  checked={props.check}
                  onChange={() =>
                    props.handleToggleCheck(props.answer, true, false)
                  }
                />
              </div>

              {props.btnText === "Results" ? (
                <>{fetchSelectedPercentage()}</>
              ) : null}
            </div>
            <div className="flex items-center gap-1 tablet:gap-3">
              <div
                id="custom-yello-checkbox"
                className="flex h-full items-center "
              >
                <input
                  id="small-yello-checkbox"
                  type="checkbox"
                  className="checkbox h-[10.4px] w-[10.4px] rounded-[2px] tablet:h-5 tablet:w-5"
                  checked={props.contend}
                  onChange={() =>
                    props.handleToggleCheck(props.answer, false, true)
                  }
                />
              </div>
              {props.btnText === "Results" ? (
                <>{fetchContendedPercentage()}</>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswer;
