import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { useEffect } from "react";
import { useState } from "react";
import BasicModal from "../../../components/BasicModal";
import EditNewOption from "./EditNewOption";
import DeleteOption from "./DeleteOption";
// import { getQuests } from "../../../features/quest/questsSlice";

const SingleAnswerRankedChoice = (props) => {
  //   const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.check);
    console.log("ranked percentages",props.percentages);
  }, [props.check]);

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  //   const selectedPercentageValue =
  //     props.percentages?.selectedPercentage[
  //       props.answer === "Agree" ? "Yes" : "No"
  //     ];

  //   const contenedPercentageValue =
  //     props.percentages?.contendedPercentage[
  //       props.answer === "Disagree" ? "Yes" : "No"
  //     ];

  return (
    <div
      className="absolute left-[3rem] top-0 mx-auto flex w-[80%] items-center gap-[25px] xl:w-[90%]"
      style={{ position: "absolute" }}
    >
      <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
        <div className="flex w-full items-center">
          {props.btnText!=="Results" && (
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
          <div className="mr-6 flex w-full justify-between">
            <h1 className="ml-8 pb-[10px] pt-[12px] text-[19px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] ">
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
          <div className="mr-[20.63px] flex items-center gap-[19px] ">
            {props.btnText === "Results" ? (
              <>
                {props.percentages?.[props.answer.trim()] ===
                undefined
                  ? "0%"
                  : props.percentages?.[props.answer.trim()] + "%"}
              </>
            ) : null}
          </div>

      </div>
    </div>
  );
};

export default SingleAnswerRankedChoice;
