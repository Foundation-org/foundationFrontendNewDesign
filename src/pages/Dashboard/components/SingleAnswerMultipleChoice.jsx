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
    <div className="ml-[30px] mr-[36px] flex items-center gap-[25px] tablet:mx-[72px] 2xl:mx-[85px]">
      <div className="flex w-full justify-between rounded-[4.7px] bg-white dark:bg-[#0D1012] tablet:rounded-[10px]">
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
            <h1 className="ml-8 pb-[5.7px] pt-[5.6px] text-[8.52px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pb-[10px] tablet:pt-3 tablet:text-[19px] ">
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
          <div className="mr-[20.63px] flex items-center gap-[19px] text-[9.238px] tablet:text-[16px] ">
            {props.title === "Multiple Choice" ? (
              <div id="custom-checkbox" className="tablet:-mb-[7px] ">
                <input
                  id="small-checkbox"
                  type="checkbox"
                  className="checkbox h-[10.4px] w-[10.4px] rounded-[2px] tablet:h-5 tablet:w-5"
                  checked={checkState}
                  onChange={handleCheckChange}
                />
              </div>
            ) : null}

            {props.btnText === "Results" ? (
              <>
                {console.log(
                  props.answer +
                    parseInt(
                      Math.abs(
                        props.percentages?.selectedPercentage[
                          props.answer.trim()
                        ],
                      ),
                    )
                      .toString()
                      .trim().length,
                )}
                {props.percentages?.selectedPercentage &&
                props.percentages?.selectedPercentage[props.answer.trim()]
                  ? props.percentages?.selectedPercentage[
                      props.answer.trim()
                    ] === 100
                    ? "100 %"
                    : props.percentages?.selectedPercentage[
                        props.answer.trim()
                      ].toFixed(
                        parseInt(
                          Math.abs(
                            props.percentages?.selectedPercentage[
                              props.answer.trim()
                            ],
                          ),
                        )
                          .toString()
                          .trim().length === 2
                          ? 1
                          : 2,
                      ) + "%"
                  : "0.00%"}
              </>
            ) : (
              <></>
            )}

            <>
              <div id="custom-yello-checkbox" className="tablet:-mb-[7px]">
                <input
                  id="small-yello-checkbox"
                  type="checkbox"
                  className="checkbox h-[10.4px] w-[10.4px] rounded-[2px] tablet:h-5 tablet:w-5"
                  checked={contendState}
                  onChange={handleContendChange}
                />
              </div>

              {props.btnText === "Results" ? (
                <>
                  {props.percentages?.contendedPercentage &&
                  props.percentages?.contendedPercentage[props.answer.trim()]
                    ? props.percentages?.contendedPercentage[
                        props.answer.trim()
                      ] === 100
                      ? "100%"
                      : props.percentages?.contendedPercentage[
                          props.answer.trim()
                        ].toFixed(
                          props.percentages?.contendedPercentage[
                            props.answer.trim()
                          ].length === 2
                            ? 1
                            : 2,
                        ) + "%"
                    : "0.00%"}
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
