import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import RankedResult from '../../../components/RankedResult';
import SortIcon from '../../../../../assets/SortIcon';
import { useSelector } from 'react-redux';
import SeeMoreOptions from '../../../../../components/see-more-options';
import { getSeeMoreOptions } from '../../../../../features/quest/seeMoreOptionsSlice';

const Result = (props) => {
  const { isFullScreen } = useParams();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedOption, setSelectedOption] = useState(1);
  const [contendedOption, setCcontendedOption] = useState(1);
  const [sortedAnswers, setSortedAnswers] = useState();
  const showOptions = useSelector(getSeeMoreOptions);

  const getAnswerData = (answer, type, index) => {
    const percentage =
      props.questStartData.selectedPercentage && props.questStartData.selectedPercentage.length > 0
        ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1][answer]
        : '0%';

    return {
      number: `#${index + 1}`,
      answer,
      percentage,
      check: props.questSelection[type][answer.toLowerCase()].check,
      contend: props.questSelection[type][answer.toLowerCase()].check,
    };
  };

  const getQuestionData = () => {
    switch (props.questStartData.whichTypeQuestion) {
      case 'yes/no':
        return ['Yes', 'No'].map((answer, index) => getAnswerData(answer, 'yes/no', index));
      case 'agree/disagree':
        return ['Agree', 'Disagree'].map((answer, index) => getAnswerData(answer, 'agree/disagree', index));
      case 'like/dislike':
        return ['Like', 'Dislike'].map((answer, index) => getAnswerData(answer, 'like/dislike', index));
      default:
        return [];
    }
  };

  const [answersData, setAnswersData] = useState(getQuestionData());

  function findSelectionContentionCheck(array, labelToFind) {
    const foundObject = array.find((obj) => obj.question === labelToFind);
    return !!foundObject;
  }

  const handleSortSingleType = () => {
    setCcontendedOption(1);
    setSelectedOption((prevOption) => {
      const nextOption = prevOption === 3 ? 1 : prevOption + 1;

      if (nextOption === 1) {
        const sortedNormalByPercentage = sortAnswersDataByPercentage(answersData, 'normal');
        setAnswersData(sortedNormalByPercentage);
      } else if (nextOption === 2) {
        const sortedDescendingByPercentage = sortAnswersDataByPercentage(answersData, 'descending');
        setAnswersData(sortedDescendingByPercentage);
      } else if (nextOption === 3) {
        const sortedAscendingByPercentage = sortAnswersDataByPercentage(answersData, 'ascending');
        setAnswersData(sortedAscendingByPercentage);
      }

      return nextOption;
    });
  };

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
      const indexA =
        props.questStartDat?.startQuestData.data.length >= 1
          ? props.questStartData?.startQuestData?.data[
              props.questStartData?.startQuestData?.data.length - 1
            ].selected.findIndex((item) => item.question === a.question)
          : [];

      const indexB =
        props.questStartData?.startQuestData?.data.length >= 1
          ? props.questStartData?.startQuestData?.data[
              props.questStartData?.startQuestData?.data.length - 1
            ].selected.findIndex((item) => item.question === b.question)
          : [];

      return indexA !== -1 && indexB !== -1 ? indexA - indexB : 0;
    });
  };

  const sortAnswersByAscDesc = (data, order) => {
    const questAnswersCopy = [...data.questStartData.QuestAnswers];
    return questAnswersCopy.sort((a, b) => {
      // const percentageA = parseFloat(
      //   data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
      //     a.question
      //   ]?.replace('%', '')
      //     ? data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
      //         a.question
      //       ]?.replace('%', '')
      //     : 0,
      // );
      // const percentageB = parseFloat(
      //   data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
      //     b.question
      //   ]?.replace('%', '')
      //     ? data.questStartData?.selectedPercentage[data.questStartData?.selectedPercentage.length - 1][
      //         b.question
      //       ]?.replace('%', '')
      //     : 0,
      // );
      const lastSelectedPercentage =
        data.questStartData?.selectedPercentage?.[data.questStartData.selectedPercentage.length - 1];

      const percentageA =
        lastSelectedPercentage && a.question in lastSelectedPercentage
          ? parseFloat(lastSelectedPercentage[a.question]?.replace('%', '') || 0)
          : 0;

      const percentageB =
        lastSelectedPercentage && b.question in lastSelectedPercentage
          ? parseFloat(lastSelectedPercentage[b.question]?.replace('%', '') || 0)
          : 0;

      if (order === 'ascending') {
        return percentageA - percentageB;
      } else {
        return percentageB - percentageA;
      }
    });
  };

  const sortContendedAnswersByAscDesc = (data, order) => {
    const questAnswersCopy = [...data.questStartData.QuestAnswers];

    const allZero = data.questStartData.contendedPercentage?.every((item) => {
      for (const key in item) {
        const percentage = parseFloat(item[key]?.replace('%', '') || '0');
        if (percentage !== 0) {
          return false;
        }
      }
      return true;
    });

    if (
      data.questStartData?.contendedPercentage.length > 0 &&
      data.questStartData?.contendedPercentage[0] !== null &&
      !allZero
    ) {
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
    } else {
      const data = getRankedAnswers(props);
      return data;
    }
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

      const sortedDescendingByPercentage = sortAnswersDataByPercentage(answersData, 'descending');
      setAnswersData(sortedDescendingByPercentage);
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

  function sortAnswersDataByPercentage(answersData, sortOrder) {
    const data = [...answersData];

    return data.sort((a, b) => {
      let percentageA = parseFloat(a.percentage === undefined ? '0%' : a.percentage);
      let percentageB = parseFloat(b.percentage === undefined ? '0%' : b.percentage);

      if (sortOrder === 'ascending') {
        return percentageA - percentageB;
      } else if (sortOrder === 'descending') {
        return percentageB - percentageA;
      } else {
        let val1 = parseInt(a.number.slice(1));
        let val2 = parseInt(b.number.slice(1));
        return val1 - val2;
      }
    });
  }

  useEffect(() => {
    setAnswersData(getQuestionData());

    if (selectedOption === 2) {
      const rankedNewData = sortAnswersByAscDesc(props, 'descending');
      setSortedAnswers(rankedNewData);

      const sortedDescendingByPercentage = sortAnswersDataByPercentage(getQuestionData(), 'descending');
      setAnswersData(sortedDescendingByPercentage);
    }
  }, [props.questStartData]);

  useEffect(() => {
    if (persistedUserInfo?.userSettings.defaultSort) {
      setSelectedOption(2);
    }
  }, [persistedUserInfo]);

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
            <button onClick={handleSortSingleType}>
              <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
            </button>
          </div>
          {answersData?.map((item) => (
            <SingleAnswer
              key={item.number}
              number={item.number}
              answer={item.answer}
              percentage={item.percentage}
              check={item.check}
              contend={item.check}
              handleToggleCheck={props.handleToggleCheck}
              btnText={'Results'}
              questStartData={props.questStartData}
              postProperties={props.postProperties}
            />
          ))}
        </div>
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
          <div className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]">
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
          <div className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]">
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
