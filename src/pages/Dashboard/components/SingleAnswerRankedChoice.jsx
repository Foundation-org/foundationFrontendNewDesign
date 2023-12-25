import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import BasicModal from "../../../components/BasicModal";
import DeleteOption from "./DeleteOption";
import { toast } from "sonner";

const SingleAnswerRankedChoice = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [answer, setAnswer] = useState(props.answer);

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.check);
    console.log("ranked percentages", props.percentages);
  }, [props.check]);

  useEffect(() => {
    setAnswer(props.answer);
  }, [props.answer]);

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
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

  return (
    <div
      className="left-8 top-0 mx-auto flex w-[80%] items-center gap-[25px] tablet:left-[3rem] laptop:w-[90%]"
      // style={{ position: "absolute" }}
    >
      <div className="flex w-full justify-between rounded-[4.7px] bg-white dark:bg-[#0D1012] tablet:rounded-[10px]">
        <div className="flex w-full items-center">
          {props.btnText !== "Results" && (
            <div className="h-full w-fit rounded-l-[4.734px] bg-[#DEE6F7] px-[3.3px] pb-[6.6px] pt-[6.15px] dark:bg-[#9E9E9E] tablet:rounded-l-[10px] tablet:px-[7px] tablet:pb-[13px] tablet:pt-[14px]">
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
          <div className="flex w-full justify-between tablet:mr-6">
            {props.editable ? (
              <input
                type="text"
                className="w-full rounded-[4.73px] bg-white px-4 pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-normal text-[#435059] outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3] tablet:rounded-[10.949px] tablet:pl-[32px] tablet:pt-[12px] tablet:text-[19px]"
                value={answer}
                onChange={handleInputChange}
              />
            ) : (
              <h1 className="ml-[15.8px] w-full pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:ml-8 tablet:pb-[10px] tablet:pt-[12px] tablet:text-[19px]">
                {props.answer}
              </h1>
            )}
            <div className="mr-1 flex items-center gap-3 tablet:gap-[19px]">
              {props.editable ? (
                <img
                  src="/assets/svgs/dashboard/edit.svg"
                  className="h-3 w-4 tablet:h-[19px]"
                />
              ) : null}
              {props.deleteable ? (
                <img
                  src="/assets/svgs/dashboard/trash.svg"
                  className="h-3 w-4 cursor-pointer tablet:h-[19px]"
                  onClick={handleDeleteOpen}
                />
              ) : null}
            </div>
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
