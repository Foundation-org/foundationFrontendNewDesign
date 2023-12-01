import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
// import { FaCheck } from "react-icons/fa";
// import { FaExclamation } from "react-icons/fa6";

const SingleAnswerMultipleChoice = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);

  useEffect(() => {
    setCheckState(props.check);
    setContendState(props.contend);
  }, [props.check, props.contend]);

  const handleCheckChange = () => {
    const checkedCount = props.answersSelection.filter((answer) => answer.check).length;
  
    // if (!props.multipleOption && checkedCount ===1) {
    //   // If multipleOption is off, unselect all other options
    //   props.answersSelection.forEach((answer) => {
    //     if (answer.label !== props.answer) {
    //       console.log("answer"+answer.label +"not equals"+"answer"+props.answer);
    //       props.handleCheckChange(answer.label, false);
    //     }
    //   });
    // }
  
    if (props.correctCount <= checkedCount) {
      if (props.isCorrect === "Selected" && !checkState) {
        toast.warning("You cannot select more than the correct answers");
        return;
      }
    }
  
    setCheckState((prevState) => {
      if (contendState) {
        setContendState(false);
        props.handleContendChange(false);
      }
  
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };
  

  const handleContendChange = () => {
    setContendState((prevState) => {
      if (checkState) {
        handleCheckChange(false);
        props.handleCheckChange(false);
      }

      props.handleContendChange(!prevState);
      return !prevState;
    });
  };

  console.log("first", props.title);

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
            {props.title === "Multiple Choice" ? (
              <div id="custom-checkbox" className="-mb-[7px] ">
                <input
                  id="small-checkbox"
                  type="checkbox"
                  className="checkbox rounded-[2px]"
                  checked={checkState}
                  onChange={handleCheckChange}
                />
              </div>
            ) : null}

            {props.btnText === "Results" ? (
              <>
                {props.percentages?.selectedPercentage[props.answer] ===
                undefined
                  ? "0%"
                  : props.percentages?.selectedPercentage[props.answer] + "%"}
              </>
            ) : (
              <></>
            )}

            {props.title === "Multiple Choice" ? (
              <>
                <div id="custom-yello-checkbox" className="-mb-[7px] ">
                  <input
                    id="small-yello-checkbox"
                    type="checkbox"
                    className="checkbox rounded-[2px]"
                    checked={contendState}
                    onChange={handleContendChange}
                  />
                </div>

                {props.btnText === "Results" ? (
                  <>
                    {props.percentages?.contendedPercentage[props.answer] ===
                    undefined
                      ? "0%"
                      : props.percentages?.contendedPercentage[props.answer] +
                        "%"}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswerMultipleChoice;
