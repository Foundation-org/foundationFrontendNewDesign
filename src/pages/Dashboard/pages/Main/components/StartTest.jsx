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
  whichTypeQuestion,
  handleSubmit,
  handleOpen,
  handleClose,
  btnText,
  open,
  usersAddTheirAns,
  setAnswerSelection,
  answersSelection,
  multipleOption,
  rankedAnswers,
  setRankedAnswers,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [temp, setTemp] = useState("");

  useEffect(() => {
    const updatedAnswersSelection = answers.map((questAnswer) => ({
      label: questAnswer.question,
      check: false,
      contend: false,
    }));
    
    setAnswerSelection(updatedAnswersSelection);
    setRankedAnswers(
      updatedAnswersSelection.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
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
              className={`${title === "Multiple Choice"
                  ? "mx-auto w-[80%] tablet:ml-[72px] tablet:w-[86%]"
                  : "ml-[34px] w-[80%] tablet:ml-[49px]"
                }   xl:w-[90%]`}
            >
              <div className="rounded-[4.7px] bg-white dark:bg-[#0D1012] tablet:rounded-[10px]">
                {title !== "Multiple Choice" ? (
                  <div className="flex items-center">
                    <div className="h-full w-fit rounded-l-[4.7px] bg-[#DEE6F7] px-[3px] py-[6.15px] dark:bg-[#9E9E9E] tablet:rounded-l-[10px] tablet:px-[7px] tablet:pb-[13px] tablet:pt-[14px]">
                      {persistedTheme === "dark" ? (
                        <img
                          src="/assets/svgs/dashboard/six-dots-dark.svg"
                          alt="six dots"
                          className="h-[8.5px] w-[5.2px] tablet:h-auto tablet:w-auto"
                        />
                      ) : (
                        <img
                          src="/assets/svgs/dashboard/six-dots.svg"
                          alt="six dots"
                          className="h-[8.5px] w-[5.2px] tablet:h-auto tablet:w-auto"
                        />
                      )}
                    </div>
                    <input
                      value={temp}
                      onChange={handleInputChange}
                      type="text"
                      className="mx-4 w-full bg-white text-[8.52px] font-normal leading-normal text-[#435059] focus:outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3] tablet:ml-8 tablet:text-[19px]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <input
                      value={temp}
                      onChange={handleInputChange}
                      type="text"
                      className="ml-8 w-full rounded-[4.7px] bg-white py-[5.6px] pr-[7px] text-[8.52px] font-normal leading-normal text-[#435059] focus:outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3] tablet:rounded-[10px] tablet:py-3 tablet:text-[19px]"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2 tablet:gap-4">
                <button
                  className={` ${persistedTheme === "dark"
                      ? "bg-[#333B46]"
                      : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                    } inset-0 w-fit rounded-[4.47px] px-5 py-1 text-[8.52px] font-semibold leading-normal text-[#EAEAEA] shadow-inner tablet:rounded-[10px] tablet:py-2 tablet:text-[20px]`}
                  onClick={handleAddOption}
                >
                  Add
                </button>
                <button className="rounded-[4.47px] bg-[#FF0000] px-4 py-1 text-[8.52px] font-semibold text-white tablet:rounded-[10px] tablet:py-2 tablet:text-[20px]">
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
                    className="ml-[55.38px] mt-[11.29px] flex w-fit items-center gap-[5.8px] rounded-[4.734px] bg-[#D9D9D9] px-[10px] py-[3.4px] text-[8.52px] font-normal leading-normal text-[#435059] dark:bg-[#595C60] dark:text-[#BCBCBC] tablet:ml-[135px] tablet:mt-3 tablet:gap-[11.37px] tablet:rounded-[10px] tablet:px-[21px] tablet:py-[10px] tablet:text-[18px]"
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
            className={` ${persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
              } inset-0 mr-[14px] w-[82.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#EAEAEA] shadow-inner dark:text-[#B6B6B6] tablet:mr-[30px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
          <div className="mb-[23px] mr-[22px] mt-[17.5px] flex justify-end gap-2 tablet:mt-[38px]">
       
          </div>
        </div>
      </div>
    </>
  );
};

export default StartTest;
