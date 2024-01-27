import { useEffect, useState } from 'react';
import { calculateRemainingTime } from '../../../../../utils';

const QuestTimeRemaining = ({ show, questStartData }) => {
  const [resultString, setResultString] = useState('');

  const handleClick = () => {
    const result = calculateRemainingTime(
      questStartData?.updatedAt,
      questStartData?.startQuestData && questStartData?.startQuestData.data.length,
      questStartData.usersChangeTheirAns,
    );

    console.log("cal time function", result);

    setResultString(result);
  };

  useEffect(() => {
    handleClick();
  }, [questStartData?.updatedAt, questStartData.usersChangeTheirAns]);

  return (
    <div>
      {show ? (
        <div>
          {questStartData?.usersChangeTheirAns === '' ? (
            <h4 className="cursor-pointer text-[7.5px] font-normal text-[#85898C] tablet:text-[16.58px] laptop:text-[1rem]">
              Your selection is final and cannot be changed.
            </h4>
          ) : (
            <h4
              className="cursor-pointer text-[7.5px] font-normal text-[#85898C] tablet:text-[16.58px] laptop:text-[1rem]"
              // onClick={handleClick}
            >
              You can change your selection {questStartData.usersChangeTheirAns}
              {resultString}.
            </h4>
          )}
        </div>
      ) : (
        <h4 className="cursor-pointer text-[7.5px] font-normal text-[#85898C] tablet:text-[16.58px] laptop:text-[1rem]">
          &#x200B;
        </h4>
      )}
    </div>
  );
};

export default QuestTimeRemaining;
