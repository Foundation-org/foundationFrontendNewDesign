import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import RankedResult from '../../../components/RankedResult';

const Result = (props) => {
  const { isFullScreen } = useParams();
  const [selectedOption, setSelectedOption] = useState(1);
  const [sortRankedAns, setSortRankedAns] = useState();

  function findSelectionContentionCheck(array, labelToFind) {
    const foundObject = array.find((obj) => obj.question === labelToFind);
    return !!foundObject;
  }

  const handleSortIconClick = () => {
    setSelectedOption((prevOption) => {
      // Toggle between 1, 2, and 3 for each click
      const nextOption = prevOption === 3 ? 1 : prevOption + 1;
      
      // Set the sorted data immediately after clicking
      if (nextOption === 1) {
        const rankedNewData = getRankedAnswers(props);
        setSortRankedAns(rankedNewData);
      } else if (nextOption === 2) {
        const rankedNewData = getSortedRankedAnswers(props, 'ascending');
        setSortRankedAns(rankedNewData);
      } else if (nextOption === 3) {
        const rankedNewData = getSortedRankedAnswers(props, 'descending');
        setSortRankedAns(rankedNewData);
      }
      
      return nextOption;
    });
  };
  
  const getRankedAnswers = (props) => {
    return props.questStartData.QuestAnswers.sort((a, b) => {
      const indexA = props.questStartData?.startQuestData?.data[
        props.questStartData?.startQuestData?.data.length - 1
      ].selected.findIndex((item) => item.question === a.question);

      const indexB = props.questStartData?.startQuestData?.data[
        props.questStartData?.startQuestData?.data.length - 1
      ].selected.findIndex((item) => item.question === b.question);

      return indexA !== -1 && indexB !== -1 ? indexA - indexB : 0;
    });
  };

  const getSortedRankedAnswers = (props, order) => {
    return props.questStartData.QuestAnswers.sort((a, b) => {
      const percentageA = parseFloat(
        props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1][
          a.question
        ]?.replace('%', ''),
      );
      const percentageB = parseFloat(
        props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1][
          b.question
        ]?.replace('%', ''),
      );

      if (order === 'ascending') {
        return percentageA - percentageB;
      } else {
        return percentageB - percentageA;
      }
    });
  };

  useEffect(() => {
    if (selectedOption === 1) {
      const rankedNewData = getRankedAnswers(props);
      setSortRankedAns(rankedNewData);
    }

    if (selectedOption === 2) {
      const rankedNewData = getSortedRankedAnswers(props, 'ascending');
      setSortRankedAns(rankedNewData);
    }

    if (selectedOption === 3) {
      const rankedNewData = getSortedRankedAnswers(props, 'descending');
      setSortRankedAns(rankedNewData);
    }
  }, [selectedOption, props.questStartData]);

  console.log('first', selectedOption, sortRankedAns);

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${props.cardSize}px ` }}>
      {props.title === 'Yes/No' || props.title === 'Agree/Disagree' || props.title === 'Like/Dislike' ? (
        <>
          {props.title === 'Yes/No' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Yes'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1].Yes
                    : null
                }
                check={props.questSelection['yes/no'].yes.check}
                contend={props.questSelection['yes/no'].yes.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
              <SingleAnswer
                number={'#2'}
                answer={'No'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1].No
                    : null
                }
                check={props.questSelection['yes/no'].no.check}
                contend={props.questSelection['yes/no'].no.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
            </>
          ) : props.title === 'Agree/Disagree' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Agree'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1]
                        .Agree
                    : null
                }
                check={props.questSelection['agree/disagree'].agree.check}
                contend={props.questSelection['agree/disagree'].agree.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Disagree'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1]
                        .Disagree
                    : null
                }
                check={props.questSelection['agree/disagree'].disagree.check}
                contend={props.questSelection['agree/disagree'].disagree.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
            </>
          ) : props.title === 'Like/Dislike' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Like'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1].Like
                    : null
                }
                check={props.questSelection['like/dislike'].like.check}
                contend={props.questSelection['like/dislike'].like.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Dislike'}
                checkInfo={true}
                percentage={
                  props.questStartData.selectedPercentage && props.questStartData?.selectedPercentage.length > 0
                    ? props.questStartData?.selectedPercentage[props.questStartData?.selectedPercentage.length - 1]
                        .Dislike
                    : null
                }
                check={props.questSelection['like/dislike'].dislike.check}
                contend={props.questSelection['like/dislike'].dislike.check}
                handleToggleCheck={props.handleToggleCheck}
                btnText={'Results'}
                questStartData={props.questStartData}
              />
            </>
          ) : null}
        </>
      ) : props.title === 'Multiple Choice' || props.title === 'Open Choice' ? (
        <div
          className={`${
            isFullScreen === undefined ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[336px]' : ''
          }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
        >
          {props.answers?.map((item, index) => (
            <div key={index + 1}>
              <SingleAnswerMultipleChoice
                number={'#' + (index + 1)}
                answer={item.question}
                addedAnswerUuid={item.uuid}
                title={props.title}
                checkInfo={true}
                selectedPercentages={
                  props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                    ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1]
                    : null
                }
                contendPercentages={
                  props.questStartData?.contendedPercentage && props.questStartData.contendedPercentage.length > 0
                    ? props.questStartData.contendedPercentage[props.questStartData.contendedPercentage.length - 1]
                    : null
                }
                check={findSelectionContentionCheck(
                  props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                    ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                        .selected
                    : [],
                  item.question,
                )}
                contend={findSelectionContentionCheck(
                  props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                    ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                        .contended
                    : [],
                  item.question,
                )}
                btnText={'Results'}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
              />
            </div>
          ))}
        </div>
      ) : props.title === 'Ranked Choice' ? (
        <div className="relative">
          <div className="absolute -top-4 right-[30px] flex gap-[34px] tablet:-top-7 tablet:right-20 tablet:gap-14">
            <img
              src="/assets/svgs/sortIcon.svg"
              alt="sortIcon"
              className="h-[11.561px] w-[7.593px] cursor-pointer tablet:h-5 tablet:w-[13.12px]"
              onClick={handleSortIconClick}
            />
            <img
              src="/assets/svgs/sortIcon.svg"
              alt="sortIcon"
              className="h-[11.561px] w-[7.593px] cursor-pointer tablet:h-5 tablet:w-[13.12px]"
            />
          </div>
          <div
            className={`${
              isFullScreen === undefined
                ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[336px]'
                : ''
            }  mr-[2px] flex flex-col gap-[5.7px] tablet:mr-1 tablet:gap-[10px]`}
          >
            {sortRankedAns?.map((item, index) => (
              <div key={index + 1}>
                <RankedResult
                  number={'#' + (index + 1)}
                  answer={item.question}
                  addedAnswerUuid={item.uuid}
                  answersSelection={props.answersSelection}
                  setAnswerSelection={props.setAnswerSelection}
                  title={props.title}
                  selectedPercentages={
                    props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                      ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1]
                      : null
                  }
                  contendPercentages={
                    props.questStartData?.contendedPercentage && props.questStartData.contendedPercentage.length > 0
                      ? props.questStartData.contendedPercentage[props.questStartData.contendedPercentage.length - 1]
                      : null
                  }
                  contend={findSelectionContentionCheck(
                    props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                      ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                          .contended
                      : [],
                    item.question,
                  )}
                  setAddOptionLimit={props.setAddOptionLimit}
                  btnText={'Results'}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Result;
