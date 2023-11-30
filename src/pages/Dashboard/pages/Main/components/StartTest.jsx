import { useDispatch, useSelector } from "react-redux";
import AddNewOption from "../../../components/AddNewOption";
import BasicModal from "../../../../../components/BasicModal";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
// import { useEffect } from "react";

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
}) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);

  // useEffect(() => {
  //   dispatch()
  // }, [answers])

  console.log("array", quests.multipleChoice);

  function findLabelChecked(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    if (labelFound[0]?.check === true) {
      return true;
    } else {
      return false;
    }
  }

  function findLabelContend(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    if (labelFound[0]?.contend === true) {
      return true;
    } else {
      return false;
    }
  }

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
          answers.map((item, index) => (
            <SingleAnswerMultipleChoice
              number={"#" + (index + 1)}
              answer={item.question}
              title={title}
              checkInfo={true}
              handleMultipleChoiceCC={handleMultipleChoiceCC}
              check={findLabelChecked(quests.multipleChoice, item.question)}
              contend={findLabelContend(quests.multipleChoice, item.question)}
              whichTypeQuestion={whichTypeQuestion}
            />
          ))
        ) : (
          answers.map((item, index) => (
            <SingleAnswer
              number={"#" + (index + 1)}
              answer={item.question}
              title={title}
              handleMultipleChoiceCC={handleMultipleChoiceCC}
            />
          ))
        )}

        {usersAddTheirAns ? (
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
          <AddNewOption />
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
