import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicModal from "../../../components/BasicModal";
import DeleteOption from "./DeleteOption";
import { Tooltip } from "../../../utils/Tooltip";
import { answerValidation, checkAnswerExist } from "../../../api/questsApi";

const SingleAnswerMultipleChoice = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [answer, setAnswer] = useState(props.answer);
  const reset = {
    name: "Ok",
    color: "text-[#389CE3]",
    tooltipName: "Please write something...",
    tooltipStyle: "tooltip-info",
  };
  const [checkOptionStatus, setCheckOptionStatus] = useState(reset);
  const [prevValue, setPrevValue] = useState("");

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.check);
    setContendState(props.contend);
  }, [props.check, props.contend]);

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      if (contendState) {
        setContendState(false);
        props.handleContendChange(false);
      }

      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  const handleContendChange = () => {
    setContendState((prevState) => {
      if (checkState) {
        handleCheckChange(false);
        props.handleCheckChange(false);
      }

      props.handleContendChange(!prevState);
      return !prevState;
    });
  };

  useEffect(() => {
    setAnswer(props.answer);
  }, [props.answer]);

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
    setCheckOptionStatus(
      e.target.value.trim() === ""
        ? reset
        : { name: "Ok", color: "text-[#b0a00f]" },
    );
  };

  const optionVerification = async (value) => {
    if (prevValue === answer) return;
    setPrevValue(value);
    setCheckOptionStatus({
      name: "Checking",
      color: "text-[#0FB063]",
      tooltipName: "Verifying your option. Please wait...",
      tooltipStyle: "tooltip-success",
    });
    // option Validation
    const { validatedAnswer, errorMessage } = await answerValidation({
      answer: value,
    });
    // If any error captured
    if (errorMessage) {
      // props.setIsSubmit(false);
      return setCheckOptionStatus({
        name: "Fail",
        color: "text-[#b00f0f]",
        tooltipName:
          "Please review your text for proper grammar while keeping our code of conduct in mind.",
        tooltipStyle: "tooltip-error",
      });
    }
    // Check Answer is unique
    let answerExist = checkAnswerExist({
      answersArray: props.answersSelection,
      answer: validatedAnswer,
      index: 0,
      startQuest: true,
    });
    if (answerExist) {
      props.setIsSubmit(false);
      return setCheckOptionStatus({
        name: "Fail",
        color: "text-[#b00f0f]",
        tooltipName: "Found Duplication!",
        tooltipStyle: "tooltip-error",
        duplication: true,
      });
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
      setAnswer(validatedAnswer);
      props.setIsSubmit(true);
      setCheckOptionStatus({
        name: "Ok",
        color: "text-[#0FB063]",
        tooltipName: "Answer is Verified",
        tooltipStyle: "tooltip-success",
        isVerifiedAnswer: true,
      });
    }
  };

  useEffect(() => {
    handleAddOption();
  }, [answer]);

  const handleAddOption = () => {
    const newArr = props.answersSelection.map((item) =>
      item.label === props.answer ? { ...item, label: answer.trim() } : item,
    );
    props.setAnswerSelection(newArr);
  };
  const handleDeleteOption = () => {
    setCheckOptionStatus(reset);
    const newArr = props.answersSelection.filter(
      (item) => item.label !== props.answer,
    );

    props.setAnswerSelection(newArr);
    props.setAddOptionLimit(0);
    toast.success("Item deleted");
  };

  return (
    <div className="mx-1 flex items-center 2xl:mx-[85px] tablet:ml-[52.65px] tablet:mr-[48.65px] tablet:gap-[5px]">
      {console.log("uuid", props.addedAnswerUuid, localStorage.getItem("uId"))}
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === localStorage.getItem("uId") ? (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]">
            <img
              src="/assets/svgs/dashboard/optionMeBadge.svg"
              alt="trash"
              className="h-4 w-[12px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        ) : (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]">
            <img
              src="/assets/svgs/dashboard/bluebadge.svg"
              alt="trash"
              className="h-4 w-[12px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        )
      ) : (
        <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]"></div>
      )}
      <div className="flex w-full justify-between rounded-[4.7px] tablet:rounded-[10px]">
        <div className="flex w-full items-center rounded-l-[5.387px] bg-white tablet:rounded-l-[10px] dark:bg-[#0D1012]">
          <div className="flex h-full w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] dark:bg-[#9E9E9E]"></div>
          {!props.checkInfo && (
            <div className="h-full w-fit rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
              {persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/six-dots-dark.svg"
                  alt="six dots"
                />
              ) : (
                <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
              )}
            </div>
          )}
          <div className="flex w-full justify-between border-y border-y-[#ACACAC]">
            {props.editable ? (
              <input
                type="text"
                className="w-full rounded-[4.73px] bg-white px-4 pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-normal text-[#435059] outline-none tablet:rounded-[10.949px] tablet:pl-[32px] tablet:pt-[12px] tablet:text-[19px] dark:bg-[#0D1012] dark:text-[#D3D3D3]"
                value={answer}
                onChange={handleInputChange}
                onBlur={(e) =>
                  e.target.value.trim() !== "" &&
                  optionVerification(e.target.value.trim())
                }
              />
            ) : (
              <h1 className="ml-[15.8px] w-full pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-normal text-[#435059] tablet:ml-8 tablet:pb-[10px] tablet:pt-[12px] tablet:text-[19px] dark:text-[#D3D3D3]">
                {props.answer}
              </h1>
            )}
            {props.deleteable && (
              <div
                className={`relative flex items-center bg-white text-[0.5rem] font-semibold tablet:h-[50.19px] tablet:text-[1rem] laptop:text-[1.2rem] dark:bg-[#0D1012] ${checkOptionStatus.color}`}
              >
                <div className="flex w-[45px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[7rem]">
                  <span>{checkOptionStatus.name}</span>
                </div>
                <Tooltip optionStatus={checkOptionStatus} />
              </div>
            )}
          </div>
        </div>
        {!props.checkInfo ? (
          <div className="mr-[20.63px] flex items-center gap-[37px] rounded-r-[4.7px] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012] ">
            <img
              src="/assets/svgs/dashboard/edit.svg"
              alt="edit"
              className="h-[19.942px] w-[16px]"
            />
            <img
              src="/assets/svgs/dashboard/trash.svg"
              alt="trash"
              className="h-[19.942px] w-[16px]"
            />
          </div>
        ) : (
          <div
            className={`flex items-center gap-[10.03px] rounded-r-[4.7px] border-y border-r border-y-[#ACACAC] border-r-[#ACACAC] bg-white pr-[7.55px] text-[9.238px] tablet:gap-[19px] tablet:rounded-r-[10px] tablet:pr-[20.63px] tablet:text-[16px] dark:bg-[#0D1012] ${
              props.btnText === "Results" ? "pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-1 laptop:gap-[18px]">
              {props.title === "Multiple Choice" ? (
                <div id="custom-checkbox" className="flex h-full items-center">
                  <input
                    id="small-checkbox"
                    type="checkbox"
                    className="checkbox h-[11.4px] w-[11.4px] rounded-[2px] tablet:h-5 tablet:w-5"
                    checked={checkState}
                    onChange={handleCheckChange}
                  />
                </div>
              ) : null}

              {props.btnText === "Results" ? (
                <>
                  {props.percentages?.selectedPercentage &&
                  props.percentages?.selectedPercentage[props.answer.trim()] ? (
                    props.percentages?.selectedPercentage[
                      props.answer.trim()
                    ] === 100 ? (
                      <span
                        className={`w-[4ch] whitespace-nowrap ${
                          persistedTheme === "dark" ? "text-white" : ""
                        }`}
                      >
                        100%
                      </span>
                    ) : (
                      <span
                        className={`w-[4ch] whitespace-nowrap ${
                          persistedTheme === "dark" ? "text-white" : ""
                        }`}
                      >
                        {props.percentages?.selectedPercentage[
                          props.answer.trim()
                        ] + "%"}
                      </span>
                    )
                  ) : (
                    <span
                      className={`w-[4ch] whitespace-nowrap ${
                        persistedTheme === "dark" ? "text-white" : ""
                      }`}
                    >
                      0%
                    </span>
                  )}
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-1 laptop:gap-[18px]">
              <div
                id="custom-yello-checkbox"
                className="flex h-full items-center "
              >
                <input
                  id="small-yello-checkbox"
                  type="checkbox"
                  className="checkbox h-[11.4px] w-[11.4px] rounded-[2px] tablet:h-5 tablet:w-5"
                  checked={contendState}
                  onChange={handleContendChange}
                />
              </div>

              {props.btnText === "Results" ? (
                <>
                  {props.percentages?.contendedPercentage &&
                  props.percentages?.contendedPercentage[
                    props.answer.trim()
                  ] ? (
                    props.percentages?.contendedPercentage[
                      props.answer.trim()
                    ] === 100 ? (
                      <span
                        className={`w-[4ch] whitespace-nowrap ${
                          persistedTheme === "dark" ? "text-white" : ""
                        }`}
                      >
                        100%
                      </span>
                    ) : (
                      <span
                        className={`w-[4ch] whitespace-nowrap ${
                          persistedTheme === "dark" ? "text-white" : ""
                        }`}
                      >
                        {props.percentages?.contendedPercentage[
                          props.answer.trim()
                        ] + "%"}
                      </span>
                    )
                  ) : (
                    <span
                      className={`w-[4ch] whitespace-nowrap ${
                        persistedTheme === "dark" ? "text-white" : ""
                      }`}
                    >
                      0%
                    </span>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
        {props.btnText !== "Results" && (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]">
            {props.deleteable ? (
              <img
                src="/assets/svgs/dashboard/trash2.svg"
                alt="trash"
                className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                onClick={handleDeleteOption}
              />
            ) : null}
            <BasicModal open={deleteModal} handleClose={handleDeleteClose}>
              <DeleteOption
                answer={props.answer}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                handleDeleteClose={handleDeleteClose}
                handleEditClose={handleDeleteClose}
                setAddOptionLimit={props.setAddOptionLimit}
              />
            </BasicModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswerMultipleChoice;
