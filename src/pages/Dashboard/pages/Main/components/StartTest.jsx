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
  const [temp, setTemp] = useState("");

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

  // to add new option
  const handleInputChange = (e) => {
    setTemp(e.target.value);
  };

  const handleAddOption = () => {
    if (temp.trim() === "") {
      toast.error("Option cannot be empty");
      return;
    }

    const newOption = {
      label: temp.trim(),
      check: true,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
    };

    setAnswerSelection([...answersSelection, newOption]);

    setTemp("");
    setAddOptionLimit(1);
    handleClose();
  };

  return (
    <>
      <div className="mt-[11.66px] flex flex-col gap-[5.7px] tablet:mt-[26px] tablet:gap-[10px]">
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
              <div
                id="dragIcon2"
                className="flex flex-col gap-[5.7px] tablet:gap-[11px]"
              >
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

        <div>
          {open ? (
            <div
              className={`${
                title === "Multiple Choice"
                  ? "ml-[72px] w-[86%]"
                  : "ml-[49px] w-[80%]"
              }   xl:w-[90%]`}
            >
              <div className="rounded-[10px] bg-white dark:bg-[#0D1012]">
                {title !== "Multiple Choice" ? (
                  <div className="flex items-center">
                    <div className="h-full w-fit rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
                      {persistedTheme === "dark" ? (
                        <img
                          src="/assets/svgs/dashboard/six-dots-dark.svg"
                          alt="six dots"
                        />
                      ) : (
                        <img
                          src="/assets/svgs/dashboard/six-dots.svg"
                          alt="six dots"
                        />
                      )}
                    </div>
                    <input
                      value={temp}
                      onChange={handleInputChange}
                      type="text"
                      className="ml-8 w-full bg-white text-[19px] font-normal leading-normal text-[#435059] focus:outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <input
                      value={temp}
                      onChange={handleInputChange}
                      type="text"
                      className="ml-8 w-full rounded-[10px] bg-white py-3 pr-[7px] text-[19px] font-normal leading-normal text-[#435059] focus:outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3]"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  className={` ${
                    persistedTheme === "dark"
                      ? "bg-[#333B46]"
                      : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                  } inset-0 w-fit rounded-[10px] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner`}
                  onClick={handleAddOption}
                >
                  Add
                </button>
                <button className="rounded-[10px] bg-black-200 px-4 py-2 text-[20px] font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {usersAddTheirAns && addOptionLimit === 0 ? (
          <div>
            {title === "Yes/No" ||
            title === "Agree/Disagree" ? null : btnText !== "change answer" ? (
              !open ? (
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
              ) : null
            ) : null}
          </div>
        ) : null}
        {/* <BasicModal open={open} handleClose={handleClose}>
          <AddNewOption
            setAnswerSelection={setAnswerSelection}
            answersSelection={answersSelection}
            handleClose={handleClose}
            setAddOptionLimit={setAddOptionLimit}
          />
        </BasicModal> */}
      </div>
      <div className="mt-8 flex w-full justify-end">
        <div>
          <button
            className={` ${
              persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            } inset-0 mr-[14px] w-[82.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#EAEAEA] shadow-inner dark:text-[#B6B6B6] tablet:mr-[30px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
          <div className="mb-[23px] mr-[22px] mt-[17.5px] flex justify-end gap-2 tablet:mt-[38px]">
            {persistedTheme === "dark" ? (
              <img
                src="/assets/svgs/dashboard/zoom-dark.svg"
                alt="zoom"
                className="h-[10.41px] w-[10.41px] tablet:h-[22px] tablet:w-[22px]"
              />
            ) : (
              <img
                src="/assets/svgs/dashboard/zoom.svg"
                alt="zoom"
                className="h-[10.41px] w-[10.41px] tablet:h-[22px] tablet:w-[22px]"
              />
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default StartTest;
