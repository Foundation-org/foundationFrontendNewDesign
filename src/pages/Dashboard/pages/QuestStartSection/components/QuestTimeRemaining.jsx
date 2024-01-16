import { useState } from "react";
import { calculateRemainingTime } from "../../../../../utils";

const QuestTimeRemaining = ({
  lastInteractedAt,
  howManyTimesAnsChanged,
  usersChangeTheirAns,
  show,
}) => {
  const [resultString, setResultString] = useState("");

  const handleClick = () => {
    const result = calculateRemainingTime(
      lastInteractedAt,
      howManyTimesAnsChanged,
      usersChangeTheirAns,
    );

    setResultString(result);
  };

  return (
    <div>
      {show ? (
        <div>
          {usersChangeTheirAns === "" ? (
            <h4 className="cursor-pointer text-[9px] font-normal text-[#85898C] tablet:text-[16.58px] laptop:text-[1rem]">
              Your selection is final and cannot be changed.
            </h4>
          ) : (
            <h4
              className="cursor-pointer text-[9px] font-normal text-[#85898C] tablet:text-[16.58px] laptop:text-[1rem]"
              onClick={handleClick}
            >
              You can change your selection {usersChangeTheirAns}
              {resultString}.
            </h4>
          )}
        </div>
      ) : (
        <h4 className="cursor-pointer text-[9px] font-normal text-[#85898C] tablet:text-[16.58px] laptop:text-[1rem]">
          &#x200B;
        </h4>
      )}
    </div>
  );
};

export default QuestTimeRemaining;
