import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import RankedResult from '../../../components/RankedResult';
import SortIcon from '../../../../../assets/SortIcon';

const Result = (props) => {
  const { isFullScreen } = useParams();
  const [selectedOption, setSelectedOption] = useState(1);
  const [contendedOption, setCcontendedOption] = useState(1);
  const [sortedAnswers, setSortedAnswers] = useState();

  function findSelectionContentionCheck(array, labelToFind) {
    const foundObject = array.find((obj) => obj.question === labelToFind);
    return !!foundObject;
  }

  const handleSortIconClick = () => {
    setCcontendedOption(1);
    setSelectedOption((prevOption) => {
      const nextOption = prevOption === 3 ? 1 : prevOption + 1;

      if (nextOption === 1) {
        if (
          props.questStartData?.whichTypeQuestion === 'multiple choise' ||
          props.questStartData?.whichTypeQuestion === 'open choice'
        ) {
          setSortedAnswers(props.questStartData?.QuestAnswers);
        } else {
          const rankedNewData = getRankedAnswers(props);
          setSortedAnswers(rankedNewData);
        }
      } else if (nextOption === 2) {
        const rankedNewData = sortAnswersByAscDesc(props, 'descending');
        setSortedAnswers(rankedNewData);
      } else if (nextOption === 3) {
        const rankedNewData = sortAnswersByAscDesc(props, 'ascending');
        setSortedAnswers(rankedNewData);
      }

      return nextOption;
    });
  };

  const handleContendedSortIconClick = () => {
    setSelectedOption(1);
    setCcontendedOption((prevOption) => {
      const nextOption = prevOption === 3 ? 1 : prevOption + 1;

      if (nextOption === 1) {
        if (
          props.questStartData?.whichTypeQuestion === 'multiple choise' ||
          props.questStartData?.whichTypeQuestion === 'open choice'
        ) {
          setSortedAnswers(props.questStartData?.QuestAnswers);
        } else {
          const rankedNewData = getRankedAnswers(props);
          setSortedAnswers(rankedNewData);
        }
      } else if (nextOption === 2) {
        const rankedNewData = sortContendedAnswersByAscDesc(props, 'descending');
        setSortedAnswers(rankedNewData);
      } else if (nextOption === 3) {
        const rankedNewData = sortContendedAnswersByAscDesc(props, 'ascending');
        setSortedAnswers(rankedNewData);
      }

      return nextOption;
    });
  };

  const getRankedAnswers = (props) => {
    const questAnswersCopy = [...props.questStartData.QuestAnswers];
    return questAnswersCopy.sort((a, b) => {
      const indexA = props.questStartData?.startQuestData?.data[
        props.questStartData?.startQuestData?.data.length - 1
      ].selected.findIndex((item) => item.question === a.question);

      const indexB = props.questStartData?.startQuestData?.data[
        props.questStartData?.startQuestData?.data.length - 1
      ].selected.findIndex((item) => item.question === b.question);

      return indexA !== -1 && indexB !== -1 ? indexA - indexB : 0;
    });
  };

  const sortAnswersByAscDesc = (data, order) => {
    const questAnswersCopy = [...data.questStartData.QuestAnswers];
    return questAnswersCopy.sort((a, b) => {
      const percentageA = parseFloat(
        data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
          a.question
        ]?.replace('%', '')
          ? data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
              a.question
            ]?.replace('%', '')
          : 0,
      );
      const percentageB = parseFloat(
        data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
          b.question
        ]?.replace('%', '')
          ? data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
              b.question
            ]?.replace('%', '')
          : 0,
      );

      if (order === 'ascending') {
        return percentageA - percentageB;
      } else {
        return percentageB - percentageA;
      }
    });
  };

  const sortContendedAnswersByAscDesc = (data, order) => {
    const questAnswersCopy = [...data.questStartData.QuestAnswers];
    return questAnswersCopy.sort((a, b) => {
      const percentageA = parseFloat(
        data.questStartData?.contendedPercentage[data.questStartData?.contendedPercentage.length - 1][
          a.question
        ]?.replace('%', '')
          ? data.questStartData?.contendedPercentage[data.questStartData?.contendedPercentage.length - 1][
              a.question
            ]?.replace('%', '')
          : 0,
      );
      const percentageB = parseFloat(
        data.questStartData?.contendedPercentage[data.questStartData?.contendedPercentage.length - 1][
          b.question
        ]?.replace('%', '')
          ? data.questStartData?.contendedPercentage[data.questStartData?.contendedPercentage.length - 1][
              b.question
            ]?.replace('%', '')
          : 0,
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
      if (
        props.questStartData?.whichTypeQuestion === 'multiple choise' ||
        props.questStartData?.whichTypeQuestion === 'open choice'
      ) {
        setSortedAnswers(props?.questStartData?.QuestAnswers);
      } else {
        const rankedNewData = getRankedAnswers(props);
        setSortedAnswers(rankedNewData);
      }
    }

    if (selectedOption === 2) {
      const rankedNewData = sortAnswersByAscDesc(props, 'descending');
      setSortedAnswers(rankedNewData);
    }

    if (selectedOption === 3) {
      const rankedNewData = sortAnswersByAscDesc(props, 'ascending');
      setSortedAnswers(rankedNewData);
    }
  }, [selectedOption, props.questStartData]);

  useEffect(() => {
    if (contendedOption === 1) {
      if (
        props.questStartData?.whichTypeQuestion === 'multiple choise' ||
        props.questStartData?.whichTypeQuestion === 'open choice'
      ) {
        setSortedAnswers(props?.questStartData?.QuestAnswers);
      } else {
        const rankedNewData = getRankedAnswers(props);
        setSortedAnswers(rankedNewData);
      }
    }

    if (contendedOption === 2) {
      const rankedNewData = sortContendedAnswersByAscDesc(props, 'descending');
      setSortedAnswers(rankedNewData);
    }

    if (contendedOption === 3) {
      const rankedNewData = sortContendedAnswersByAscDesc(props, 'ascending');
      setSortedAnswers(rankedNewData);
    }
  }, [contendedOption, props.questStartData]);

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${props.cardSize}px ` }}>
      {props.title === 'Yes/No' || props.title === 'Agree/Disagree' || props.title === 'Like/Dislike' ? (
        <>
          {props.title === 'Yes/No' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Yes'}
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
                postProperties={props.postProperties}
              />
              <SingleAnswer
                number={'#2'}
                answer={'No'}
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
                postProperties={props.postProperties}
              />
            </>
          ) : props.title === 'Agree/Disagree' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Agree'}
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
                postProperties={props.postProperties}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Disagree'}
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
                postProperties={props.postProperties}
              />
            </>
          ) : props.title === 'Like/Dislike' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Like'}
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
                postProperties={props.postProperties}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Dislike'}
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
                postProperties={props.postProperties}
              />
            </>
          ) : null}
        </>
      ) : props.title === 'Multiple Choice' || props.title === 'Open Choice' ? (
        <div className="relative">
          <div className="absolute -top-[21px] right-[73px] tablet:-top-7 tablet:right-[135px]">
            <button onClick={handleSortIconClick}>
              <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
            </button>
          </div>
          <div className="absolute -top-[21px] right-8 tablet:-top-7 tablet:right-[64px]">
            <button onClick={handleContendedSortIconClick}>
              <SortIcon
                type={'contended'}
                ass={contendedOption === 3 ? true : false}
                des={contendedOption === 2 ? true : false}
              />
            </button>
          </div>
          <div
            className={`${
              isFullScreen === undefined
                ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[336px]'
                : ''
            }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
          >
            {sortedAnswers?.map((item, index) => (
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
                  postProperties={props.postProperties}
                />
              </div>
            ))}
          </div>
        </div>
      ) : props.title === 'Ranked Choice' ? (
        <div className="relative">
          {/* <div className="absolute -top-4 right-[30px] flex gap-[34px] tablet:-top-7 tablet:right-20 tablet:gap-14"> */}
          <div className="absolute -top-[21px] right-[69px] tablet:-top-7 tablet:right-[145px]">
            <button onClick={handleSortIconClick}>
              <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
            </button>
          </div>
          <div className="absolute -top-[21px] right-6 tablet:-top-7 tablet:right-[70px]">
            <button onClick={handleContendedSortIconClick}>
              <SortIcon
                type={'contended'}
                ass={contendedOption === 3 ? true : false}
                des={contendedOption === 2 ? true : false}
              />
            </button>
          </div>
          <div
            className={`${
              isFullScreen === undefined
                ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[336px]'
                : ''
            }  mr-[2px] flex flex-col gap-[5.7px] tablet:mr-1 tablet:gap-[10px]`}
          >
            {sortedAnswers?.map((item, index) => (
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
                  postProperties={props.postProperties}
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
