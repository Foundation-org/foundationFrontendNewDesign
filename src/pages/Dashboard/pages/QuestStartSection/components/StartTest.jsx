import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import SingleAnswerMultipleChoice from "../../../../../components/question-card/options/SingleAnswerMultipleChoice";
import SingleAnswerRankedChoice from "../../../../../components/question-card/options/SingleAnswerRankedChoice";
import { getQuestionTitle } from "../../../../../utils/questionCard/SingleQuestCard";
import SingleAnswer from "../../../../../components/question-card/options/SingleAnswer";
import Loader from "../../../../../components/ui/Loader";

const StartTest = ({
  id,
  questStartData,
  title,
  answers,
  // SingleAnswer,
  quests,
  handleToggleCheck,
  whichTypeQuestion,
  handleSubmit,
  handleOpen,
  usersAddTheirAns,
  setAnswerSelection,
  answersSelection,
  multipleOption,
  rankedAnswers,
  setRankedAnswers,
  addOptionField,
  setStartTest,
  loading,
  expandedView,
  setIsSubmit,
  usersChangeTheirAns,
  viewResult,
  setViewResult,
  openResults,
  setOpenResults,
  startStatus,
  loadingDetail,
}) => {
  const navigate = useNavigate();
  const { isFullScreen } = useParams();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const uuidExists =
    answers &&
    answers?.some(
      (item) =>
        item.uuid === persistedUserInfo?.uuid || localStorage.getItem("uId"),
    );

  useEffect(() => {
    localStorage.setItem("usersChangeTheirAns", usersChangeTheirAns);
  }, [usersChangeTheirAns]);

  useEffect(() => {
    const updatedAnswersSelection = answers?.map((questAnswer) => ({
      label: questAnswer.question,
      check: false,
      contend: false,
      uuid: questAnswer.uuid,
    }));

    setAnswerSelection(updatedAnswersSelection);

    setRankedAnswers(
      updatedAnswersSelection?.map((item, index) => ({
        ...item,
        id: `unique-${index}`,
      })),
    );
  }, [answers]);

  useEffect(() => {
    // Trigger a re-render when answersSelection is updated
  }, [answersSelection]);

  const handleCheckChange = (index, check) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, check } : answer,
      ),
    );
  };

  const handleContendChange = (index, contend) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, contend } : answer,
      ),
    );
  };

  const handleCheckChangeSingle = (index) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index
          ? { ...answer, check: true, contend: false }
          : { ...answer, check: false },
      ),
    );
  };

  const handleContendChangeSingle = (index) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index
          ? { ...answer, contend: true, check: false }
          : { ...answer, contend: false },
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

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTypedValues = [...rankedAnswers];
    const [removed] = newTypedValues.splice(result.source.index, 1);
    newTypedValues.splice(result.destination.index, 0, removed);

    setRankedAnswers(newTypedValues);
  };

  const renderOptionsByTitle = () => {
    if (!loadingDetail) {
      if (
        getQuestionTitle(questStartData.whichTypeQuestion) === "Yes/No" ||
        getQuestionTitle(questStartData.whichTypeQuestion) ===
          "Agree/Disagree" ||
        getQuestionTitle(questStartData.whichTypeQuestion) === "Like/Dislike"
      ) {
        return (
          <>
            {title === "Yes/No" ? (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Yes"}
                  check={quests.yesNo.yes.check}
                  contend={quests.yesNo.yes.contend}
                  handleToggleCheck={handleToggleCheck}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"No"}
                  check={quests.yesNo.no.check}
                  contend={quests.yesNo.no.contend}
                  handleToggleCheck={handleToggleCheck}
                />
              </>
            ) : title === "Agree/Disagree" ? (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Agree"}
                  check={quests.agreeDisagree.agree.check}
                  contend={quests.agreeDisagree.agree.contend}
                  handleToggleCheck={handleToggleCheck}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"Disagree"}
                  check={quests.agreeDisagree.disagree.check}
                  contend={quests.agreeDisagree.disagree.contend}
                  handleToggleCheck={handleToggleCheck}
                />
              </>
            ) : (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Like"}
                  check={quests.likeDislike.like.check}
                  contend={quests.likeDislike.like.contend}
                  handleToggleCheck={handleToggleCheck}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"Dislike"}
                  check={quests.likeDislike.dislike.check}
                  contend={quests.likeDislike.dislike.contend}
                  handleToggleCheck={handleToggleCheck}
                />
              </>
            )}
          </>
        );
      }

      if (
        getQuestionTitle(questStartData.whichTypeQuestion) === "Multiple Choice"
      ) {
        return (
          <div className="flex flex-col overflow-auto">
            <div
              className={`${
                isFullScreen === undefined
                  ? "quest-scrollbar max-h-[187px] min-h-fit overflow-auto md:max-h-[366px]"
                  : ""
              } mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
            >
              {answersSelection &&
                [...answersSelection]?.map((item, index) => (
                  <SingleAnswerMultipleChoice
                    key={index}
                    number={"#" + (index + 1)}
                    answer={item.label}
                    addedAnswerUuid={item.uuid}
                    editable={item.edit}
                    deleteable={item.delete}
                    title={title}
                    multipleOption={multipleOption}
                    // setAddOptionLimit={setAddOptionLimit}
                    answersSelection={answersSelection}
                    setAnswerSelection={setAnswerSelection}
                    checkInfo={true}
                    check={findLabelChecked(answersSelection, item.label)}
                    contend={findLabelContend(answersSelection, item.label)}
                    whichTypeQuestion={questStartData.whichTypeQuestion}
                    handleCheckChange={
                      multipleOption === true
                        ? (check) => handleCheckChange(index, check)
                        : (check) => handleCheckChangeSingle(index, check)
                    }
                    handleContendChange={
                      multipleOption === true
                        ? (contend) => handleContendChange(index, contend)
                        : (contend) => handleContendChangeSingle(index, contend)
                    }
                    setIsSubmit={setIsSubmit}
                  />
                ))}
            </div>
          </div>
        );
      }

      if (
        getQuestionTitle(questStartData.whichTypeQuestion) === "Ranked Choice"
      ) {
        return (
          <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId={`rankedAnswers-${Date.now()}`}>
                {(provided) => (
                  <ul
                    className={`${
                      isFullScreen === undefined
                        ? "quest-scrollbar max-h-[187px] min-h-fit overflow-auto tablet:max-h-[366px]"
                        : ""
                    }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {rankedAnswers?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-full"
                          >
                            <SingleAnswerRankedChoice
                              snapshot={snapshot}
                              number={"#" + (index + 1)}
                              editable={item.edit}
                              deleteable={item.delete}
                              answer={item.label}
                              addedAnswerUuid={item.uuid}
                              answersSelection={answersSelection}
                              setAnswerSelection={setAnswerSelection}
                              title={title}
                              checkInfo={false}
                              check={findLabelChecked(
                                answersSelection,
                                item.label,
                              )}
                              handleCheckChange={(check) =>
                                handleCheckChange(index, check)
                              }
                              // setAddOptionLimit={setAddOptionLimit}
                              setIsSubmit={setIsSubmit}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        );
      }
    } else {
      <Loader />;
    }
  };

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]">
      {renderOptionsByTitle()}
    </div>
  );
};

export default StartTest;
