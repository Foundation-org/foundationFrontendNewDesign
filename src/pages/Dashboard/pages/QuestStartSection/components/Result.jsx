import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSeeMoreOptions } from '../../../../../features/quest/seeMoreOptionsSlice';
import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import SeeMoreOptions from '../../../../../components/see-more-options';
import RankedResult from '../../../components/RankedResult';
import ResultSortIcons from './ResultSortIcons';

const Result = (props) => {
  const showOptions = useSelector(getSeeMoreOptions);
  const { isFullScreen } = useParams();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedOption, setSelectedOption] = useState(1);
  const [contendedOption, setCcontendedOption] = useState(1);
  const [sortedAnswers, setSortedAnswers] = useState(
    props.questStartData?.QuestAnswers ? props.questStartData?.QuestAnswers : null,
  );

  useEffect(() => {
    if (props.questStartData?.QuestAnswers) {
      setSortedAnswers(props.questStartData?.QuestAnswers);
    }
  }, [props.questStartData?.QuestAnswers]);

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
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${props.cardSize}px` }}>
      {props.questStartData?.whichTypeQuestion === 'yes/no' ||
      props.questStartData?.whichTypeQuestion === 'like/dislike' ||
      props.questStartData?.whichTypeQuestion === 'agree/disagree' ? (
        <div
          className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]"
          style={{ minHeight: `${props.cardSize}px` }}
        >
          <ResultSortIcons
            questStartData={props.questStartData}
            handleSortIconClick={handleSortIconClick}
            selectedOption={selectedOption}
            isEmbedResults={props.isEmbedResults}
            postProperties={props.postProperties}
          />
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
              isEmbedResults={props.isEmbedResults}
            />
          ))}
        </div>
      ) : props.questStartData?.whichTypeQuestion === 'multiple choise' ||
        props.questStartData?.whichTypeQuestion === 'open choice' ? (
        <div className="relative">
          <ResultSortIcons
            questStartData={props.questStartData}
            handleSortIconClick={handleSortIconClick}
            selectedOption={selectedOption}
            contendedOption={contendedOption}
            isEmbedResults={props.isEmbedResults}
            postProperties={props.postProperties}
          />
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
                  title={props.questStartData?.whichTypeQuestion}
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
                  isEmbedResults={props.isEmbedResults}
                />
              ))}
            {showOptions.id !== props.questStartData._id &&
              sortedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={props.questStartData._id} />}
          </div>
        </div>
      ) : props.questStartData?.whichTypeQuestion === 'ranked choise' ? (
        <div className="relative">
          <ResultSortIcons
            questStartData={props.questStartData}
            handleSortIconClick={handleSortIconClick}
            selectedOption={selectedOption}
            contendedOption={contendedOption}
            isEmbedResults={props.isEmbedResults}
            postProperties={props.postProperties}
          />
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
                    title={props.questStartData?.whichTypeQuestion}
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
                    isEmbedResults={props.isEmbedResults}
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
