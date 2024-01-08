import { useState } from "react";
import { calculateRemainingTime } from "../../../../../utils";

const QuestTimeRemaining = ({
  lastInteractedAt,
  howManyTimesAnsChanged,
  usersChangeTheirAns,
}) => {
  const [resultString, setResultString] = useState("");

  console.log(
    "hello",
    lastInteractedAt,
    howManyTimesAnsChanged,
    usersChangeTheirAns,
  );

  const handleClick = () => {
    const result = calculateRemainingTime(
      lastInteractedAt,
      howManyTimesAnsChanged,
      usersChangeTheirAns,
    );

    setResultString(result);
  };

  console.log({ usersChangeTheirAns });

  return (
    <div>
      {usersChangeTheirAns === "" ? (
        <h4 className="ml-[29px] text-[9px] font-medium leading-normal text-[#ACACAC] tablet:ml-[102.65px] tablet:text-[16.58px] laptop:text-[18px]">
          Your selection is final and cannot be changed.
        </h4>
      ) : (
        <h4
          className="ml-8 cursor-pointer text-[9px] font-medium leading-normal text-[#ACACAC] tablet:ml-[102.65px] tablet:text-[16.58px] laptop:text-[18px]"
          onClick={handleClick}
        >
          You can change your selection {usersChangeTheirAns}
          {resultString}.
        </h4>
      )}
    </div>
  );
};

export default QuestTimeRemaining;
