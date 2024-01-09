import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { useEffect } from "react";
import { useState } from "react";
import BasicModal from "../../../components/BasicModal";
import EditNewOption from "./EditNewOption";
import DeleteOption from "./DeleteOption";

const RankedResult = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [checkState, setCheckState] = useState(props.check);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.check);
  }, [props.check]);

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  return (
    <div className="flex items-center 2xl:mx-[85px] tablet:ml-[52.65px] tablet:mr-[48.65px]">
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === persistedUserInfo.uuid ? (
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
      {/* flex h-full w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] dark:bg-[#9E9E9E] */}
      <div className="flex h-full w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7]  tablet:h-[50.5px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] dark:bg-[#9E9E9E]">
        {" "}
        &#x200B;
      </div>
      <div className="tablet:rounded-l-0 rounded-l-0 flex w-full justify-between rounded-r-[4.73px] border-y border-l-0 border-r border-[#ACACAC] bg-white tablet:rounded-r-[10px] dark:bg-[#0D1012]">
        <div className="flex w-full items-center">
          {props.btnText !== "Results" && (
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
          <div className="flex w-full justify-between">
            <h1 className=" ml-4 w-full pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-normal text-[#435059] tablet:ml-8 tablet:pb-[10px] tablet:pt-[12px] tablet:text-[19px]  dark:text-[#D3D3D3]">
              {props.answer}
            </h1>
            <div className="flex items-center gap-[19px]">
              {props.editable ? (
                <img
                  src="/assets/svgs/dashboard/edit.svg"
                  className="h-[19px] w-4 cursor-pointer"
                  onClick={handleEditOpen}
                />
              ) : null}
              {props.deleteable ? (
                <img
                  src="/assets/svgs/dashboard/trash.svg"
                  className="h-[19px] w-4 cursor-pointer"
                  onClick={handleDeleteOpen}
                />
              ) : null}
            </div>
            <BasicModal open={editModal} handleClose={handleEditClose}>
              <EditNewOption
                answer={props.answer}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                handleEditClose={handleEditClose}
              />
            </BasicModal>
            <BasicModal open={deleteModal} handleClose={handleDeleteClose}>
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
        </div>
        {/* to show ranked and multiple choice options */}
        <div className="mr-[10.63px] flex items-center gap-[19px] text-[9.238px] tablet:mr-[20.63px] tablet:text-[16px] ">
          {props.btnText === "Results" ? (
            <>
              {props.percentages?.rankedPercentage &&
              props.percentages?.rankedPercentage?.[props.answer.trim()] ===
                undefined ? (
                <span
                  className={`w-[4ch] whitespace-nowrap ${
                    persistedTheme === "dark" ? "text-white" : ""
                  }`}
                >
                  0.00%
                </span>
              ) : props.percentages?.rankedPercentage?.[props.answer.trim()] ===
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
                  {props.percentages?.rankedPercentage?.[props.answer.trim()] +
                    "%"}
                </span>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="flex w-7 items-center justify-center bg-[#F3F3F3] tablet:w-[45.6px] dark:bg-[#141618]" />
    </div>
  );
};

export default RankedResult;
