import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Reorder } from 'framer-motion';

import { getQuestionTitle } from '../../../../../utils/questionCard/SingleQuestCard';

import Loader from '../../../../../components/ui/Loader';
import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerRankedChoice from '../../../../../components/question-card/options/SingleAnswerRankedChoice';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';

const StartTest = ({
  questStartData,
  handleToggleCheck,
  answersSelection,
  setAnswerSelection,
  rankedAnswers,
  setRankedAnswers,
  loadingDetail,
  setAddOptionField,
  questSelection,
  cardSize,
  checkOptionStatus,
  setCheckOptionStatus,
  postProperties,
}) => {
  const { isFullScreen } = useParams();
  const [dragId, setDragId] = useState(null);

  const handleCheckChange = (index, check) => {
    setAnswerSelection((prevAnswers) => prevAnswers.map((answer, i) => (i === index ? { ...answer, check } : answer)));
  };

  const handleContendChangeRanked = (index, contend) => {
    setRankedAnswers((prevAnswers) => prevAnswers.map((answer, i) => (i === index ? { ...answer, contend } : answer)));
  };

  const handleContendChange = (index, contend) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) => (i === index ? { ...answer, contend } : answer)),
    );
  };

  const handleCheckChangeSingle = (index) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, check: !answer.check, contend: false } : { ...answer, check: false },
      ),
    );
  };

  const handleContendChangeSingle = (index, contend) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, contend: contend, check: false } : { ...answer, contend: false },
      ),
    );
  };

  function findLabelChecked(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    return labelFound[0]?.check === true;
  }

  function findLabelContend(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    return labelFound[0]?.contend === true;
  }

  const renderOptionsByTitle = () => {
    const listContainerRef = useRef(null);

    useEffect(() => {
      let listlength = answersSelection.length;

      if (answersSelection[listlength - 1]?.addedOptionByUser && listContainerRef.current) {
        listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
      }
    }, [answersSelection]);

    if (!loadingDetail) {
      if (
        getQuestionTitle(questStartData.whichTypeQuestion) === 'Yes/No' ||
        getQuestionTitle(questStartData.whichTypeQuestion) === 'Agree/Disagree' ||
        getQuestionTitle(questStartData.whichTypeQuestion) === 'Like/Dislike'
      ) {
        return (
          <>
            {getQuestionTitle(questStartData.whichTypeQuestion) === 'Yes/No' ? (
              <>
                <SingleAnswer
                  number={'#1'}
                  answer={'Yes'}
                  check={questSelection['yes/no'].yes.check}
                  contend={questSelection['yes/no'].yes.check}
                  handleToggleCheck={handleToggleCheck}
                  questStartData={questStartData}
                  postProperties={postProperties}
                />
                <SingleAnswer
                  number={'#2'}
                  answer={'No'}
                  check={questSelection['yes/no'].no.check}
                  contend={questSelection['yes/no'].no.check}
                  handleToggleCheck={handleToggleCheck}
                  questStartData={questStartData}
                  postProperties={postProperties}
                />
              </>
            ) : getQuestionTitle(questStartData.whichTypeQuestion) === 'Agree/Disagree' ? (
              <>
                <SingleAnswer
                  number={'#1'}
                  answer={'Agree'}
                  check={questSelection['agree/disagree'].agree.check}
                  contend={questSelection['agree/disagree'].agree.check}
                  handleToggleCheck={handleToggleCheck}
                  questStartData={questStartData}
                  postProperties={postProperties}
                />
                <SingleAnswer
                  number={'#2'}
                  answer={'Disagree'}
                  check={questSelection['agree/disagree'].disagree.check}
                  contend={questSelection['agree/disagree'].disagree.check}
                  handleToggleCheck={handleToggleCheck}
                  questStartData={questStartData}
                  postProperties={postProperties}
                />
              </>
            ) : (
              <>
                <SingleAnswer
                  number={'#1'}
                  answer={'Like'}
                  check={questSelection['like/dislike'].like.check}
                  contend={questSelection['like/dislike'].like.check}
                  handleToggleCheck={handleToggleCheck}
                  questStartData={questStartData}
                  postProperties={postProperties}
                />
                <SingleAnswer
                  number={'#2'}
                  answer={'Dislike'}
                  check={questSelection['like/dislike'].dislike.check}
                  contend={questSelection['like/dislike'].dislike.check}
                  handleToggleCheck={handleToggleCheck}
                  questStartData={questStartData}
                  postProperties={postProperties}
                />
              </>
            )}
          </>
        );
      }
      if (
        getQuestionTitle(questStartData.whichTypeQuestion) === 'Multiple Choice' ||
        getQuestionTitle(questStartData.whichTypeQuestion) === 'Open Choice'
      ) {
        return (
          <div className="flex flex-col overflow-auto">
            <div
              ref={listContainerRef}
              className={`${
                isFullScreen === undefined
                  ? 'quest-scrollbar max-h-[178.2px] min-h-fit overflow-auto md:max-h-[336px]'
                  : ''
              } mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
            >
              {answersSelection &&
                [...answersSelection]?.map((item, index) => (
                  <SingleAnswerMultipleChoice
                    questStartData={questStartData}
                    id={index}
                    key={index}
                    number={'#' + (index + 1)}
                    answer={item.label}
                    addedAnswerUuid={item.uuid}
                    editable={item.edit}
                    deleteable={item.delete}
                    title={getQuestionTitle(questStartData.whichTypeQuestion)}
                    multipleOption={questStartData.userCanSelectMultiple}
                    answersSelection={answersSelection}
                    setAnswerSelection={setAnswerSelection}
                    checkInfo={true}
                    check={findLabelChecked(answersSelection, item.label)}
                    contend={findLabelContend(answersSelection, item.label)}
                    whichTypeQuestion={questStartData.whichTypeQuestion}
                    handleCheckChange={
                      questStartData.userCanSelectMultiple === true
                        ? (check) => handleCheckChange(index, check)
                        : (check) => handleCheckChangeSingle(index, check)
                    }
                    handleContendChange={
                      questStartData.userCanSelectMultiple === true
                        ? (contend) => handleContendChange(index, contend)
                        : (contend) => handleContendChangeSingle(index, contend)
                    }
                    setAddOptionField={setAddOptionField}
                    checkOptionStatus={checkOptionStatus}
                    setCheckOptionStatus={setCheckOptionStatus}
                    postProperties={postProperties}
                  />
                ))}
            </div>
          </div>
        );
      }
      if (getQuestionTitle(questStartData.whichTypeQuestion) === 'Ranked Choice') {
        return (
          <Reorder.Group
            axis="y"
            onReorder={setRankedAnswers}
            values={rankedAnswers}
            className="flex flex-col gap-[5.7px] tablet:gap-[10px]"
          >
            {rankedAnswers?.map((item, index) => (
              <SingleAnswerRankedChoice
                key={item.id}
                setDragId={setDragId}
                isDragging={dragId === item.id ? true : false}
                questStartData={questStartData}
                id={index}
                item={item}
                number={index + 1}
                editable={item.edit}
                deleteable={item.delete}
                answer={item.label}
                addedAnswerUuid={item.uuid}
                answersSelection={answersSelection}
                setAnswerSelection={setAnswerSelection}
                rankedAnswers={rankedAnswers}
                title={getQuestionTitle(questStartData.whichTypeQuestion)}
                checkInfo={false}
                check={findLabelChecked(rankedAnswers, item.label)}
                contend={findLabelContend(rankedAnswers, item.label)}
                handleCheckChange={(check) => handleCheckChange(index, check)}
                handleContendChange={(contend) => handleContendChangeRanked(index, contend)}
                setAddOptionField={setAddOptionField}
                checkOptionStatus={checkOptionStatus}
                setCheckOptionStatus={setCheckOptionStatus}
                postProperties={postProperties}
              />
            ))}
          </Reorder.Group>
        );
      }
    } else {
      <Loader />;
    }
  };

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${cardSize}px ` }}>
      {renderOptionsByTitle()}
    </div>
  );
};

export default StartTest;
