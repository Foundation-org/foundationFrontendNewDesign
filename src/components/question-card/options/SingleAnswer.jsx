import { useSelector } from "react-redux";
import { getQuests } from "../../../features/quest/questsSlice";

const SingleAnswer = (props) => {
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const fetchSelectedPercentage = () => {
    const percentageKey =
      props.answer === "Yes" ||
      props.answer === "Agree" ||
      props.answer === "Like"
        ? "Yes"
        : "No";

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

  return (
    <div className="flex items-center pl-[3.94rem] pr-[6.3rem]">
      <div className="flex h-[26.05px] w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] tablet:h-[45px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:h-[45px] laptop:w-[25px] dark:bg-[#9E9E9E]">
        &#x200B;
      </div>
      <div className="flex w-full justify-between rounded-r-[4.73px] border-y border-r border-y-[#ACACAC] border-r-[#ACACAC] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012]">
        <div className="flex items-center">
          <h1 className="pb-[5.7px] pl-[18px] pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] tablet:py-3 tablet:text-[19px] dark:text-[#D3D3D3]">
            {props.answer}
          </h1>
        </div>
        <div
          className={`flex items-center gap-[10.3px] pr-[10px] text-[9.2px] tablet:gap-[22px] tablet:text-[16px] ${
            props.btnText === "Results" ? "pointer-events-none" : ""
          }`}
        >
          <div className="flex items-center gap-1 laptop:gap-[18px]">
            <div id="custom-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={
                  props.check
                  // props.btnText !== "Results"
                  //   ? quests.id === props.questStartData._id
                  //     ? props.check
                  //     : null
                  //   : quests.id === "" || quests.id === undefined
                  //     ? props.check
                  //     : null
                }
                onChange={() =>
                  props.handleToggleCheck(
                    props.questStartData.whichTypeQuestion,
                    props.answer,
                    !props.check,
                    props.questStartData._id,
                  )
                }
                // onChange={() =>
                //   props.handleToggleCheck(
                //     props.answer,
                //     true,
                //     false,
                //     props.questStartData._id,
                //   )
                // }
              />
            </div>
            {props.btnText === "Results" ? (
              <>{fetchSelectedPercentage()}</>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAnswer;
