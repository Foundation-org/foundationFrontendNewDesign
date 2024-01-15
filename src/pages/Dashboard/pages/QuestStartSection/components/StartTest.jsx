import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
import SingleAnswerRankedChoice from "../../../components/SingleAnswerRankedChoice";
import QuestTimeRemaining from "./QuestTimeRemaining";

import { FaSpinner } from "react-icons/fa";
import { MdFullscreen } from "react-icons/md";

const StartTest = ({
  id,
  title,
  answers,
  SingleAnswer,
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

  return (
    <>
      <div
        className={`mx-1 mt-[2px] flex flex-col gap-[5.7px] tablet:gap-[10px] ${
          title === "Yes/No" ||
          title === "Agree/Disagree" ||
          title === "Like/Dislike"
            ? "mt-[24px] tablet:mt-[53px]"
            : ""
        }`}
      >
        {title === "Yes/No" ||
        title === "Agree/Disagree" ||
        title === "Like/Dislike" ? (
          <>
            {title === "Yes/No" ? (
              loadingDetail === true ? (
                <Loader />
              ) : (
                <>
                  <SingleAnswer
                    number={"#1"}
                    answer={"Yes"}
                    checkInfo={true}
                    check={quests.yesNo.yes.check}
                    contend={quests.yesNo.yes.contend}
                    handleToggleCheck={handleToggleCheck}
                  />
                  <SingleAnswer
                    number={"#2"}
                    answer={"No"}
                    checkInfo={true}
                    check={quests.yesNo.no.check}
                    contend={quests.yesNo.no.contend}
                    handleToggleCheck={handleToggleCheck}
                  />
                </>
              )
            ) : title === "Agree/Disagree" ? (
              loadingDetail === true ? (
                <Loader />
              ) : (
                <>
                  <SingleAnswer
                    number={"#1"}
                    answer={"Agree"}
                    checkInfo={true}
                    check={quests.agreeDisagree.agree.check}
                    contend={quests.agreeDisagree.agree.contend}
                    handleToggleCheck={handleToggleCheck}
                  />
                  <SingleAnswer
                    number={"#2"}
                    answer={"Disagree"}
                    checkInfo={true}
                    check={quests.agreeDisagree.disagree.check}
                    contend={quests.agreeDisagree.disagree.contend}
                    handleToggleCheck={handleToggleCheck}
                  />
                </>
              )
            ) : loadingDetail === true ? (
              <Loader />
            ) : (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Like"}
                  checkInfo={true}
                  check={quests.likeDislike.like.check}
                  contend={quests.likeDislike.like.contend}
                  handleToggleCheck={handleToggleCheck}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"Dislike"}
                  checkInfo={true}
                  check={quests.likeDislike.dislike.check}
                  contend={quests.likeDislike.dislike.contend}
                  handleToggleCheck={handleToggleCheck}
                />
              </>
            )}
          </>
        ) : title === "Multiple Choice" ? (
          loadingDetail === true ? (
            <Loader />
          ) : (
            <div className="flex flex-col overflow-auto ">
              {multipleOption ? (
                <h4 className=" mb-[8px]  ml-8 text-[9px] font-medium leading-normal text-[#ACACAC] tablet:mb-[4px] tablet:ml-[6.37rem] tablet:mt-[20px] tablet:text-[16.58px] laptop:text-[18px]">
                  You can select multiple options.
                </h4>
              ) : (
                <h4 className="mb-[9px] ml-8 text-[9px] font-medium leading-normal  text-[#ACACAC] tablet:mb-[4px] tablet:ml-[6.37rem] tablet:mt-[20px] tablet:text-[16.58px] laptop:text-[18px]">
                  &#x200B;
                </h4>
              )}
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
                      whichTypeQuestion={whichTypeQuestion}
                      handleCheckChange={
                        multipleOption === true
                          ? (check) => handleCheckChange(index, check)
                          : (check) => handleCheckChangeSingle(index, check)
                      }
                      handleContendChange={
                        multipleOption === true
                          ? (contend) => handleContendChange(index, contend)
                          : (contend) =>
                              handleContendChangeSingle(index, contend)
                      }
                      setIsSubmit={setIsSubmit}
                    />
                  ))}
              </div>
            </div>
          )
        ) : loadingDetail === true ? (
          <Loader />
        ) : (
          <div className=" flex flex-col gap-[5.7px] tablet:gap-[10px]">
            <h4 className="mb-[7px] ml-9 text-[9px] font-medium leading-normal  text-[#ACACAC] tablet:mb-[6px] tablet:ml-[108.65px] tablet:mt-[20px] tablet:text-[16.58px] laptop:text-[18px]">
              You can drag and drop options in your order of preference.
            </h4>
            <div className="-mt-1 flex flex-col gap-[5.7px] tablet:-mt-3 tablet:gap-[10px]">
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
          </div>
        )}
      </div>

      {/* Conditional Text + Full Screen */}
      <div className="mr-[22px] mt-[15px] flex items-center justify-between tablet:mr-[46px]">
        <QuestTimeRemaining
          lastInteractedAt={localStorage.getItem("lastInteractedAt")}
          howManyTimesAnsChanged={localStorage.getItem(
            "howManyTimesAnsChanged",
          )}
          usersChangeTheirAns={localStorage.getItem("usersChangeTheirAns")}
        />
        {((isFullScreen === undefined && answersSelection?.length > 6) ||
          (isFullScreen === undefined && rankedAnswers?.length > 6)) && (
          <div
            className="flex cursor-pointer items-center justify-end gap-1 text-[#435059] tablet:gap-[14px] dark:text-[#ACACAC] "
            onClick={() => {
              navigate(`/quest/${id}/isfullscreen`);
            }}
          >
            <MdFullscreen className="text-[17px] tablet:text-[32px]" />
            <p className="text-[9px] font-medium tablet:text-[16px] ">
              Full Screen
            </p>
          </div>
        )}
      </div>

      {/* Add Options && Cancel && Submit Button */}
      <div className="ml-[20px] mr-[28px] mt-[13px] flex items-center justify-between tablet:ml-[100px] tablet:mr-[46px]">
        {usersAddTheirAns && uuidExists === false ? (
          <div>
            {title === "Yes/No" ||
            title === "Agree/Disagree" ||
            title === "Like/Dislike" ? null : (
              <button
                onClick={handleOpen}
                className="addoption-boxShadow ml-4 flex h-[23.48px] w-[81.8px] items-center gap-[5.8px] rounded-[7.1px] bg-[#D9D9D9] px-[10px] py-[3.4px] text-[8.52px] font-normal leading-normal text-[#435059] tablet:ml-0 tablet:mt-0 tablet:h-[52px] tablet:w-[173px] tablet:gap-[11.37px] tablet:rounded-[15px] tablet:px-[21px] tablet:py-[10px] tablet:text-[18px] dark:bg-[#595C60] dark:text-[#BCBCBC]"
              >
                {persistedTheme === "dark" ? (
                  <img
                    src="/assets/svgs/dashboard/add-dark.svg"
                    alt="add"
                    className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                  />
                ) : (
                  <img
                    src="/assets/svgs/dashboard/add.svg"
                    alt="add"
                    className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                  />
                )}
                Add Option
              </button>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div
        className={`${
          title === "Multiple Choice"
            ? "mt-4 tablet:mt-5"
            : addOptionField === 1
              ? "mt-[4rem] tablet:mt-[10rem]"
              : "mt-4 tablet:mt-5"
        } flex w-full justify-end gap-2 tablet:gap-10`}
      >
        <div className="mr-[14.4px] flex gap-2 tablet:mr-[30px] tablet:gap-10">
          {!expandedView ? (
            <button
              className={` ${
                persistedTheme === "dark"
                  ? "bg-[#F4F4F4] text-[#707175]"
                  : "bg-[#707175] text-white"
              } inset-0 h-[23.48px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal shadow-inner tablet:h-[52px] tablet:w-[173px]  tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
              onClick={() => {
                setStartTest(null);
              }}
            >
              Go Back
            </button>
          ) : null}
          {startStatus === "change answer" &&
            viewResult === null &&
            openResults === false && (
              <button
                className={` ${
                  persistedTheme === "dark"
                    ? "bg-[#F4F4F4] text-[#707175]"
                    : "bg-[#707175] text-white"
                } inset-0 w-[82.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#EAEAEA] shadow-inner tablet:w-[173px]  tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:text-[#B6B6B6]`}
                onClick={() => {
                  setViewResult(id);
                  setOpenResults(true);
                }}
              >
                Go Back
              </button>
            )}
          <button
            className={`relative ${
              persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            } flex h-[23.48px] w-[81.8px] items-center justify-center rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-[#EAEAEA] shadow-inner tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:text-[#B6B6B6]`}
            onClick={() => handleSubmit()}
            disabled={loading === true ? true : false}
          >
            {loading === true ? (
              <FaSpinner className="animate-spin text-[#EAEAEA]" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default StartTest;
