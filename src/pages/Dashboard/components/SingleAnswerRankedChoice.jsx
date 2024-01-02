import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import BasicModal from "../../../components/BasicModal";
import DeleteOption from "./DeleteOption";
import { toast } from "sonner";
import { Tooltip } from "../../../utils/Tooltip";
import { answerValidation, checkAnswerExist } from "../../../api/questsApi";

const SingleAnswerRankedChoice = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
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
  // const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.check);
    console.log("ranked percentages", props.percentages);
  }, [props.check]);

  useEffect(() => {
    setAnswer(props.answer);
  }, [props.answer]);

  const handleDeleteOpen = () => {
    setCheckOptionStatus(reset);
    const newArr = props.answersSelection.filter(
      (item) => item.label !== props.answer,
    );

    props.setAnswerSelection(newArr);
    props.setAddOptionLimit(0);
    // toast.success("Item deleted");
  };

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

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
      // props.setIsSubmit(false)
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

  const customModalStyle = {
    backgroundColor: "#FCFCFD",
    boxShadow: "none",
    border: "0px",
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div className="mx-6 flex items-center 2xl:mx-[85px] tablet:mx-[52.65px]">
      <div className="flex w-full justify-between rounded-[4.7px] tablet:rounded-[10px]">
        <div className="flex w-full items-center rounded-[4.7px] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012]">
          {props.btnText !== "Results" && (
            <div className="h-full w-fit rounded-l-[4.734px] bg-[#DEE6F7] px-[3.3px] pb-[6.6px] pt-[6.15px] tablet:rounded-l-[10px] tablet:px-[7px] tablet:pb-[13px] tablet:pt-[14px] dark:bg-[#9E9E9E]">
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
          )}
          <div className="flex w-full justify-between rounded-r-[4.7px] border-y border-r border-y-[#ACACAC] border-r-[#ACACAC] tablet:rounded-r-[10px]">
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
                className={`relative flex items-center rounded-r-[4.7px] bg-white text-[0.5rem] font-semibold tablet:h-[50.19px] tablet:rounded-r-[10px] tablet:text-[1rem] laptop:text-[1.2rem] dark:bg-[#0D1012] ${checkOptionStatus.color}`}
              >
                <div className="flex w-[50px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[7rem]">
                  <span>{checkOptionStatus.name}</span>
                </div>
                <Tooltip optionStatus={checkOptionStatus} />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]">
          {props.deleteable ? (
            <img
              src="/assets/svgs/dashboard/trash2.svg"
              alt="trash"
              className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
              onClick={handleDeleteOpen}
            />
          ) : null}
          <BasicModal
            open={deleteModal}
            handleClose={handleDeleteClose}
            customStyle={customModalStyle}
            customClasses="rounded-[9.251px] laptop:rounded-[26px]"
          >
            <DeleteOption
              answer={props.answer}
              answersSelection={props.answersSelection}
              setAnswerSelection={props.setAnswerSelection}
              handleDeleteClose={handleDeleteClose}
              handleEditClose={handleEditClose}
              setAddOptionLimit={props.setAddOptionLimit}
            />
          </BasicModal>
        </div>

        {props.btnText === "Results" ? (
          <div className="mr-[20.63px] flex items-center gap-[19px] ">
            {props.percentages?.[props.answer.trim()] === undefined
              ? "0%"
              : props.percentages?.[props.answer.trim()] + "%"}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SingleAnswerRankedChoice;
