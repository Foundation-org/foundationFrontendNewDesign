import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddNewOption from "../../../components/AddNewOption";
import BasicModal from "../../../../../components/BasicModal";
import { SortableList, SortableItem } from "@thaddeusjiang/react-sortable-list";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
import SingleAnswerRankedChoice from "../../../components/SingleAnswerRankedChoice";
import { STDropHandler } from "../../../../../utils/STDropHandler";

const StartTest = ({
  title,
  answers,
  SingleAnswer,
  quests,
  handleToggleCheck,
  handleMultipleChoiceCC,
  whichTypeQuestion,
  handleSubmit,
  handleOpen,
  handleClose,
  btnText,
  open,
  usersAddTheirAns,
  setAnswerSelection,
  answersSelection,
  isCorrect,
  correctCount,
  multipleOption,
  rankedAnswers,
  setRankedAnswers,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  

  useEffect(() => {
    setRankedAnswers(
      answersSelection.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
      })),
    );
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

  const handleOnSortEnd = (sortedItems) => {
    setRankedAnswers(sortedItems.items);
  };

  return (
    <>
      <div className="mt-[26px] flex flex-col gap-[10px]">
        {title === "Yes/No" || title === "Agree/Disagree" ? (
          <>
            {title === "Yes/No" ? (
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
            )}
          </>
        ) : title === "Multiple Choice" ? (
          answersSelection.map((item, index) => (
            <SingleAnswerMultipleChoice
              key={index}
              number={"#" + (index + 1)}
              answer={item.label}
              editable={item.edit}
              deleteable={item.delete}
              title={title}
              multipleOption={multipleOption}
              setAddOptionLimit={setAddOptionLimit}
              answersSelection={answersSelection}
              setAnswerSelection={setAnswerSelection}
              isCorrect={isCorrect}
              correctCount={correctCount}
              checkInfo={true}
              handleMultipleChoiceCC={handleMultipleChoiceCC}
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
                  : (contend) => handleContendChangeSingle(index, contend)
              }
            />
          ))
        ) : (
          <SortableList
            items={rankedAnswers}
            setItems={setRankedAnswers}
            onSortEnd={handleOnSortEnd}
          >
            {({ items }) => (
              <div id="dragIcon2" className="flex flex-col gap-[11px]">
                {items.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    DragHandler={STDropHandler}
                  >
                    <SingleAnswerRankedChoice
                      number={"#" + (index + 1)}
                      editable={item.edit}
                      deleteable={item.delete}
                      answer={item.label}
                      answersSelection={answersSelection}
                      setAnswerSelection={setAnswerSelection}
                      title={title}
                      handleMultipleChoiceCC={handleMultipleChoiceCC}
                      checkInfo={false}
                      check={findLabelChecked(answersSelection, item.label)}
                      handleCheckChange={(check) =>
                        handleCheckChange(index, check)
                      }
                      setAddOptionLimit={setAddOptionLimit}
                    />
                  </SortableItem>
                ))}
              </div>
            )}
          </SortableList>
        )}

        {usersAddTheirAns && addOptionLimit === 0 ? (
          <div>
            {title === "Yes/No" ||
            title === "Agree/Disagree" ? null : btnText !== "change answer" ? (
              <button
                onClick={handleOpen}
                className="ml-[135px] mt-3 flex w-fit items-center gap-[11.37px] rounded-[10px] bg-[#D9D9D9] px-[21px] py-[10px] text-[18px] font-normal leading-normal text-[#435059] dark:bg-[#595C60] dark:text-[#BCBCBC]"
              >
                {persistedTheme === "dark" ? (
                  <img
                    src="/assets/svgs/dashboard/add-dark.svg"
                    alt="add"
                    className="h-[15.6px] w-[15.6px]"
                  />
                ) : (
                  <img
                    src="/assets/svgs/dashboard/add.svg"
                    alt="add"
                    className="h-[15.6px] w-[15.6px]"
                  />
                )}
                Add Option
              </button>
            ) : null}
          </div>
        ) : null}
        <BasicModal open={open} handleClose={handleClose}>
          <AddNewOption
            setAnswerSelection={setAnswerSelection}
            answersSelection={answersSelection}
            handleClose={handleClose}
            setAddOptionLimit={setAddOptionLimit}
          />
        </BasicModal>
      </div>
      <div className="mt-8 flex w-full justify-end">
        <div>
          <button
            className={` ${
              persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            } inset-0 mr-[30px]  w-[173px] rounded-[15px] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner dark:text-[#B6B6B6]`}
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
          <div className="mb-[23px] mr-[22px] mt-[38px] flex justify-end gap-2">
            {persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/dashboard/zoom-dark.svg"
                alt="zoom"
                className="h-[22px] w-[22px]"
              />
            ) : (
              <img
                src="/assets/svgs/dashboard/zoom.svg"
                alt="zoom"
                className="h-[22px] w-[22px]"
              />
            )}
            <h4 className="text-[16px] font-medium leading-normal text-[#438BBF] dark:text-[#B6B6B6]">
              Full Screen
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartTest;
