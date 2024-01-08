import { useSelector } from "react-redux";
import { getQuests } from "../../../features/quest/questsSlice";

const SingleAnswer = (props) => {
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const fetchSelectedPercentage = () => {
    const percentageKey =
      props.answer === "Yes" || props.answer === "Agree" || props.answer==="Like" ? "Yes" : "No";

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
    props.answer === "Yes" || props.answer === "Agree" || props.answer==="Like" ? "Yes" : "No";

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
    <div className="mx-[2px] flex items-center 2xl:mx-[85px] tablet:mx-[52.65px]">
      <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]"></div>
      <div className="flex h-[26.05px] w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] tablet:h-[52.5px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] dark:bg-[#9E9E9E]">
        &#x200B;
      </div>
      <div className="flex w-full justify-between rounded-r-[4.73px] border-y border-r border-y-[#ACACAC] border-r-[#ACACAC] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012]">
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
          <h1 className="ml-[15.8px]  pb-[5.7px] pt-[5.6px] text-[8.52px] font-normal leading-normal text-[#435059] tablet:pb-[10px] tablet:pt-[12px] tablet:text-[19px] dark:text-[#D3D3D3] ">
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
            className={`flex items-center gap-[10.3px] pr-[10.63px] text-[9.2px] tablet:gap-[22px] tablet:pr-[20.63px] tablet:text-[16px] ${
              props.btnText === "Results" ? "pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-1 laptop:gap-[18px]">
              <div id="custom-checkbox" className="flex h-full items-center">
                <input
                  id="small-checkbox"
                  type="checkbox"
                  className="checkbox h-[11.4px] w-[11.4px] rounded-[2px] tablet:h-5 tablet:w-5"
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
            {/* <div className="flex items-center gap-1 tablet:gap-3">
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
            </div> */}
          </div>
        )}
      </div>
      <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]"></div>
    </div>
  );
};

export default SingleAnswer;
