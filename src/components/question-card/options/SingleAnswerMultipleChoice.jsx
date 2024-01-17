import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicModal from "../../BasicModal";
import DeleteOption from "../../../pages/Dashboard/components/DeleteOption";
import { Tooltip } from "../../../utils/Tooltip";
import {
  answerValidation,
  checkAnswerExist,
} from "../../../services/api/questsApi";
import { useDispatch } from "react-redux";
import { resetOptionLimit } from "../../../features/quest/utilsSlice";

const SingleAnswerMultipleChoice = (props) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
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

  const handleDeleteOption = () => {
    setCheckOptionStatus(reset);
    const newArr = props.answersSelection.filter(
      (item) => item.label !== props.answer,
    );

    props.setAnswerSelection(newArr);
    // props.setAddOptionLimit(0);
    dispatch(resetOptionLimit());
    toast.success("Item deleted");
  };

  return (
    <div className="flex items-center tablet:mr-[65.36px] tablet:gap-[10px] tablet:pl-[1.75rem]">
      {/* =============== To Display Badges on Left of Option */}
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === persistedUserInfo.uuid ? (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#141618]">
            <img
              src="/assets/svgs/dashboard/MeBadge.svg"
              alt="optionMeBadge"
              className="h-5 w-[15px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        ) : (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#141618]">
            <img
              src="/assets/svgs/dashboard/bluebadge.svg"
              alt="bluebadge"
              className="h-5 w-[15px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        )
      ) : (
        <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#141618]">
          &#x200B;
        </div>
      )}
      {/* =============== To Display Option */}
      <div className="flex w-full justify-between rounded-[4.7px] tablet:rounded-[10px]">
        <div className="flex w-full items-center rounded-l-[5.387px] bg-white tablet:rounded-l-[10px] dark:bg-[#0D1012]">
          <div className="flex h-full w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] dark:bg-[#9E9E9E]"></div>
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
              <h1 className="pb-[5.7px] pl-[18px] pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] tablet:py-3 tablet:text-[19px] dark:text-[#D3D3D3]">
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
        <div
          className={`flex items-center gap-[10.03px] rounded-r-[4.7px] border-y border-r border-y-[#ACACAC] border-r-[#ACACAC] bg-white pr-[10px] text-[9.238px] tablet:gap-[19px] tablet:rounded-r-[10px] tablet:text-[16px] dark:bg-[#0D1012] ${
            props.btnText === "Results" ? "pointer-events-none" : ""
          }`}
        >
          <div className="flex items-center gap-1 laptop:gap-[18px]">
            <div id="custom-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={checkState}
                onChange={handleCheckChange}
              />
            </div>

            {props.btnText === "Results" ? (
              <>
                {props.percentages?.selectedPercentage &&
                props.percentages?.selectedPercentage[props.answer.trim()] ? (
                  props.percentages?.selectedPercentage[props.answer.trim()] ===
                  100 ? (
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
        </div>

        {/* =============== To Display Contention and Trash Right of Option */}
        {props.btnText !== "Results" ? (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] pl-[15px] tablet:w-8 dark:bg-[#141618]">
            {props.deleteable ? (
              <img
                src="/assets/svgs/dashboard/trash2.svg"
                alt="trash"
                className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                onClick={handleDeleteOption}
              />
            ) : (
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
            )}
            <BasicModal open={deleteModal} handleClose={handleDeleteClose}>
              <DeleteOption
                answer={props.answer}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                handleDeleteClose={handleDeleteClose}
                handleEditClose={handleDeleteClose}
              />
            </BasicModal>
          </div>
        ) : (
          <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]"></div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswerMultipleChoice;