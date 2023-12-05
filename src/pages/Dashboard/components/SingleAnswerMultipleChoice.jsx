import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import EditNewOption from "./EditNewOption";
import BasicModal from "../../../components/BasicModal";
import DeleteOption from "./DeleteOption";

const SingleAnswerMultipleChoice = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

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

  return (
    <div className="mx-[72px] flex items-center gap-[25px] 2xl:mx-[85px]">
      <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
        <div className="flex w-full items-center">
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
          <div className="mr-6 flex w-full justify-between">
            <h1 className="ml-8 pb-[10px] pt-3 text-[19px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] ">
              {props.answer}
            </h1>
            <div className="flex gap-[19px]">
              {props.editable ? (
                <img
                  src="/assets/svgs/dashboard/edit.svg"
                  className="cursor-pointer"
                  onClick={handleEditOpen}
                />
              ) : null}
              {props.deleteable ? (
                <img
                  src="/assets/svgs/dashboard/trash.svg"
                  className="cursor-pointer"
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

        {!props.checkInfo ? (
          <div className="mr-[20.63px] flex items-center gap-[37px]">
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
          <div className="mr-[20.63px] flex items-center gap-[19px] ">
            {props.title === "Multiple Choice" ? (
              <div id="custom-checkbox" className="-mb-[7px] ">
                <input
                  id="small-checkbox"
                  type="checkbox"
                  className="checkbox rounded-[2px]"
                  checked={checkState}
                  onChange={handleCheckChange}
                />
              </div>
            ) : null}

            {props.btnText === "Results" ? (
              <>
                {console.log(
                  props.percentages?.selectedPercentage[props.answer],
                )}
                {props.percentages?.selectedPercentage[props.answer.trim()]
                  ? props.percentages?.selectedPercentage[props.answer.trim()] +
                    "%"
                  : "0%"}
              </>
            ) : (
              <></>
            )}

            <>
              <div id="custom-yello-checkbox" className="-mb-[7px] ">
                <input
                  id="small-yello-checkbox"
                  type="checkbox"
                  className="checkbox rounded-[2px]"
                  checked={contendState}
                  onChange={handleContendChange}
                />
              </div>

              {props.btnText === "Results" ? (
                <>
                  {props.percentages?.contendedPercentage[props.answer.trim()]
                    ? props.percentages?.contendedPercentage[
                        props.answer.trim()
                      ] + "%"
                    : "0%"}
                </>
              ) : (
                <></>
              )}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleAnswerMultipleChoice;
