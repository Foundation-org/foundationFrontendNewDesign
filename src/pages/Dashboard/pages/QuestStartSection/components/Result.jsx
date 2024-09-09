import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSeeMoreOptions } from '../../../../../features/quest/seeMoreOptionsSlice';
import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import SeeMoreOptions from '../../../../../components/see-more-options';
import RankedResult from '../../../components/RankedResult';
import SortIcon from '../../../../../assets/SortIcon';

const Result = (props) => {
  const showOptions = useSelector(getSeeMoreOptions);
  const { isFullScreen } = useParams();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedOption, setSelectedOption] = useState(1);
  const [contendedOption, setCcontendedOption] = useState(1);
  const [sortedAnswers, setSortedAnswers] = useState(
    props.questStartData?.QuestAnswers ? props.questStartData?.QuestAnswers : null,
  );

  function findSelectionContentionCheck(array, labelToFind) {
    const foundObject = array.find((obj) => obj.question === labelToFind);
    return !!foundObject;
  }

  const sortAnswers = (order = 'normal', isSelection = true) => {
    const dataKey = isSelection ? 'selectedPercentage' : 'contendedPercentage';
    const percentages = props.questStartData?.[dataKey]?.[props.questStartData?.[dataKey].length - 1];

    const sorted = _.sortBy([...sortedAnswers], (answer) => {
      const percentage = percentages?.[answer.question];
      return percentage ? parseInt(percentage) : -1;
    });

    if (order === 'desc') {
      setSortedAnswers([..._.reverse(sorted)]);
    } else if (order === 'asc') {
      setSortedAnswers(sorted);
    } else {
      setSortedAnswers([...props.questStartData?.QuestAnswers]);
    }
  };

  const handleSortIconClick = (isSelection) => {
    const setOption = isSelection ? setSelectedOption : setCcontendedOption;
    setOption((prevOption) => {
      const nextOption = prevOption === 3 ? 1 : prevOption + 1;

      const order = nextOption === 1 ? 'normal' : nextOption === 2 ? 'desc' : 'asc';
      sortAnswers(order, isSelection);

      return nextOption;
    });
  };

  useEffect(() => {
    if (persistedUserInfo?.userSettings?.defaultSort) {
      sortAnswers('desc', true);
      setSelectedOption(2);
    }
  }, [persistedUserInfo?.userSettings?.defaultSort]);

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${props.cardSize}px ` }}>
      {props.title === 'Yes/No' || props.title === 'Agree/Disagree' || props.title === 'Like/Dislike' ? (
        <div
          className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]"
          style={{ minHeight: `${props.cardSize}px ` }}
        >
          <div
            className={`absolute -top-[21px] tablet:-top-7 ${props.questStartData.type === 'embed' ? 'right-[52px] tablet:right-[98px]' : 'right-[73px] tablet:right-[135px]'}`}
          >
            <button
              onClick={() => {
                handleSortIconClick(true);
              }}
            >
              <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
            </button>
          </div>
          {sortedAnswers?.map((item) => (
            <SingleAnswer
              key={item._id}
              answer={item.question}
              percentage={
                props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                  ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1][
                      item.question
                    ]
                  : null
              }
              check={findSelectionContentionCheck(
                props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                  ? [
                      {
                        question:
                          props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                            .selected,
                      },
                    ]
                  : [],
                item.question,
              )}
              handleToggleCheck={props.handleToggleCheck}
              btnText={'Results'}
              questStartData={props.questStartData}
              postProperties={props.postProperties}
            />
          ))}
        </div>
      ) : props.title === 'Multiple Choice' || props.title === 'Open Choice' ? (
        <div className="relative">
          <div className="absolute -top-[21px] right-[70px] tablet:-top-7 tablet:right-[135px]">
            <button
              onClick={() => {
                handleSortIconClick(true);
              }}
            >
              <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
            </button>
          </div>
          <div className="absolute -top-[21px] right-6 tablet:-top-7 tablet:right-[64px]">
            <button
              onClick={() => {
                handleSortIconClick(false);
              }}
            >
              <SortIcon
                type={'contended'}
                ass={contendedOption === 3 ? true : false}
                des={contendedOption === 2 ? true : false}
              />
            </button>
          </div>
          <div
            className={`relative flex flex-col gap-[5.7px] tablet:gap-[10px] ${props.questStartData.type === 'embed' && sortedAnswers?.length >= 10 ? 'h-[284px] overflow-scroll no-scrollbar tablet:h-[580px]' : ''}`}
          >
            {sortedAnswers
              ?.slice(
                0,
                showOptions.isShow && showOptions.id === props.questStartData._id
                  ? sortedAnswers.length
                  : isFullScreen || location.pathname.startsWith('/p')
                    ? sortedAnswers.length
                    : 10,
              )
              .map((item, index) => (
                <SingleAnswerMultipleChoice
                  key={index + 1}
                  questStartData={props.questStartData}
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
              ))}
            {showOptions.id !== props.questStartData._id &&
              sortedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={props.questStartData._id} />}
          </div>
        </div>
      ) : props.title === 'Ranked Choice' ? (
        <div className="relative">
          <div className="absolute -top-[21px] right-[69px] tablet:-top-7 tablet:right-[145px]">
            <button
              onClick={() => {
                handleSortIconClick(true);
              }}
            >
              <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
            </button>
          </div>
          <div className="absolute -top-[21px] right-7 tablet:-top-7 tablet:right-[70px]">
            <button
              onClick={() => {
                handleSortIconClick(false);
              }}
            >
              <SortIcon
                type={'contended'}
                ass={contendedOption === 3 ? true : false}
                des={contendedOption === 2 ? true : false}
              />
            </button>
          </div>
          <div
            className={`relative flex flex-col gap-[5.7px] tablet:gap-[10px] ${props.questStartData.type === 'embed' && sortedAnswers?.length >= 10 && 'h-[284px] overflow-scroll no-scrollbar tablet:h-[580px]'}`}
          >
            {sortedAnswers
              ?.slice(
                0,
                showOptions.isShow && showOptions.id === props.questStartData._id
                  ? sortedAnswers.length
                  : isFullScreen || location.pathname.startsWith('/p')
                    ? sortedAnswers.length
                    : 10,
              )
              .map((item, index) => (
                <div key={index + 1}>
                  <RankedResult
                    number={'#' + (index + 1)}
                    originalOrder={props.questStartData.selectedPercentage}
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
            {showOptions.id !== props.questStartData._id &&
              sortedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={props.questStartData._id} />}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Result;
