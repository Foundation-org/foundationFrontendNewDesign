import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import BasicModal from "../../BasicModal";
import DeleteOption from "../../../pages/Dashboard/components/DeleteOption";
import { Tooltip } from "../../../utils/Tooltip";
import {
  answerValidation,
  checkAnswerExist,
} from "../../../services/api/questsApi";
import { useDispatch } from "react-redux";
import { resetaddOptionLimit } from "../../../features/quest/utilsSlice";

const SingleAnswerRankedChoice = (props) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
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
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.check);
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
    dispatch(resetaddOptionLimit());
    props.setAddOptionField(0);
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
        name: "Rejected",
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
      // props.setIsSubmit(false);
      return setCheckOptionStatus({
        name: "Rejected",
        color: "text-[#b00f0f]",
        tooltipName: "Found Duplication!",
        tooltipStyle: "tooltip-error",
        duplication: true,
      });
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
      setAnswer(validatedAnswer);
      // props.setIsSubmit(true);
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
    <div className="flex items-center tablet:mr-[65.36px] tablet:gap-[10px] tablet:pl-[1.75rem]">
      {/* =============== To Display Badges on Left of Option */}
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === persistedUserInfo?.uuid ||
        localStorage.getItem("uId") ? (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#141618]">
            <img
              src="/assets/svgs/dashboard/optionMeBadge.svg"
              alt="trash"
              className="h-5 w-[15px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        ) : (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#141618]">
            <img
              src="/assets/svgs/dashboard/bluebadge.svg"
              alt="trash"
              className="h-5 w-[15px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        )
      ) : (
        <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#141618]">
          {" "}
          &#x200B;
        </div>
      )}
      {/* =============== To Display Option */}
      <div className="flex w-full items-center rounded-[4.7px] tablet:rounded-[10px]">
        <div className="flex w-full items-center rounded-l-[4.734px] bg-white tablet:rounded-l-[10px] dark:bg-[#0D1012]">
          {props.btnText !== "Results" && (
            <div
              className={`${
                props.snapshot.isDragging
                  ? "border-y-[#5FA3D5] border-r-[#5FA3D5]"
                  : "border-y-[#DEE6F7] border-s-[#DEE6F7]"
              } flex h-full w-fit items-center rounded-l-[4.734px] border-y border-s bg-[#DEE6F7] px-[3.3px] py-[5.6px] tablet:rounded-l-[10px] tablet:px-[7px] tablet:py-[13px] dark:bg-[#9E9E9E]`}
            >
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
          <div
            className={`${
              props.snapshot.isDragging
                ? "border-y-[#5FA3D5] bg-[#F2F6FF] dark:bg-[#0D1012]"
                : "border-y-[#ACACAC]"
            } flex w-full justify-between border-y`}
          >
            {props.editable ? (
              <input
                type="text"
                className={`${
                  props.snapshot.isDragging
                    ? "bg-[#F2F6FF] dark:bg-[#0D1012]"
                    : "bg-white dark:bg-[#0D1012]"
                } w-full rounded-[4.73px] px-4 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] outline-none tablet:rounded-[10.949px] tablet:py-[9px] tablet:pl-[32px] tablet:text-[19px] dark:text-[#D3D3D3]`}
                value={answer}
                onChange={handleInputChange}
                onBlur={(e) =>
                  e.target.value.trim() !== "" &&
                  optionVerification(e.target.value.trim())
                }
              />
            ) : (
              <h1 className="pb-[5.6px] pl-[18px] pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] outline-none tablet:py-3 tablet:pl-[32px] tablet:text-[19px] dark:text-[#D3D3D3]">
                {props.answer}
              </h1>
            )}
            {props.deleteable && (
              <div
                className={`${
                  props.snapshot.isDragging
                    ? "bg-[#F2F6FF] "
                    : "bg-white dark:bg-[#0D1012]"
                } relative flex items-center rounded-r-[4.7px] text-[0.5rem] font-semibold tablet:h-[43px] tablet:rounded-r-[10px] tablet:text-[1rem] laptop:text-[1.2rem] ${
                  checkOptionStatus.color
                }`}
              >
                <div className="flex w-[50px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[7rem]">
                  <span>{checkOptionStatus.name}</span>
                </div>
                <Tooltip optionStatus={checkOptionStatus} />
              </div>
            )}
          </div>
        </div>
        <div className="flex h-[21.8px] w-[35px] items-center justify-center rounded-r-[4.7px] border-y border-r border-[#ACACAC] bg-white tablet:h-[45px] tablet:rounded-r-[10px] dark:bg-[#0D1012]">
          <h1 className="text-[16px] font-bold leading-[0px] text-[#22AA69] tablet:text-[25px]">
            R
          </h1>
        </div>
        {/* =============== To Display Contention and Trash Right of Option */}
        <div className="flex w-7 items-center justify-center bg-[#F3F3F3] pl-0 tablet:w-8 tablet:pl-[15px] dark:bg-[#141618]">
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
              // setAddOptionLimit={props.setAddOptionLimit}
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
