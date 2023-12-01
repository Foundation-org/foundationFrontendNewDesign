import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { useEffect } from "react";
import { useState } from "react";
// import { getQuests } from "../../../features/quest/questsSlice";

const SingleAnswerRankedChoice = (props) => {
  //   const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);

  useEffect(() => {
    setCheckState(props.check);
  }, [props.check]);

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  //   const selectedPercentageValue =
  //     props.percentages?.selectedPercentage[
  //       props.answer === "Agree" ? "Yes" : "No"
  //     ];

  //   const contenedPercentageValue =
  //     props.percentages?.contendedPercentage[
  //       props.answer === "Disagree" ? "Yes" : "No"
  //     ];

  return (
    <div className="mx-[72px] flex items-center gap-[25px] 2xl:mx-[85px]">
      <h1 className="w-[26px] min-w-[26px] text-[20px] font-[500] leading-normal text-[#435059] dark:text-[#D3D3D3]">
        {props.number}
      </h1>
      <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
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
          <h1 className="ml-8 pb-[10px] pt-[12px] text-[19px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] ">
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
          <div className="mr-[20.63px] flex items-center gap-[19px] ">
            {/* <div id="custom-checkbox" className="-mb-[7px] ">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox rounded-[2px]"
                checked={checkState}
                onChange={handleCheckChange}
              />
            </div> */}
            {props.btnText === "Results" ? (
              <>
                {props.percentages?.selectedPercentage[props.answer] ===
                undefined
                  ? "0%"
                  : props.percentages?.selectedPercentage[props.answer] + "%"}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswerRankedChoice;
