import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasicModal from "../../../components/BasicModal";
import DeleteOption from "./DeleteOption";

const SingleAnswerMultipleChoice = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [answer, setAnswer] = useState(props.answer);

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
    <div className="ml-[30px] mr-[36px] flex items-center gap-[25px] 2xl:mx-[85px] tablet:mx-[72px]">
      <div className="flex w-full justify-between rounded-[4.7px] bg-white dark:bg-[#0D1012] tablet:rounded-[10px]">
        <div className="flex w-full items-center">
          <div className="flex h-full w-[11.8px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] dark:bg-[#9E9E9E] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px]"></div>
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
            <div className="flex items-center gap-[19px]">
              {props.editable ? (
                <img
                  src="/assets/svgs/dashboard/edit.svg"
                  className="h-3 tablet:h-auto"
                />
              ) : null}
              {props.deleteable ? (
                <img
                  src="/assets/svgs/dashboard/trash.svg"
                  className="h-3 cursor-pointer tablet:h-auto"
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
          <div className={`mr-[20.63px] flex items-center gap-[19px] text-[9.238px] tablet:text-[16px] ${props.btnText === "Results" ? "pointer-events-none" : ""
            }`}>
            {props.title === "Multiple Choice" ? (
              <div id="custom-checkbox" className="flex h-full items-center  ">
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
                {props.percentages?.selectedPercentage &&
                  props.percentages?.selectedPercentage[props.answer.trim()] ? (
                  props.percentages?.selectedPercentage[props.answer.trim()] ===
                    100 ? (
                    <span
                      className={`w-[4ch] whitespace-nowrap ${persistedTheme === "dark" ? "text-white" : ""
                        }`}
                    >
                      100%
                    </span>
                  ) : (
                    <span
                      className={`w-[4ch] whitespace-nowrap ${persistedTheme === "dark" ? "text-white" : ""
                        }`}
                    >
                      {props.percentages?.selectedPercentage[
                        props.answer.trim()
                      ] + "%"}
                    </span>
                  )
                ) : (
                  <span
                    className={`w-[4ch] whitespace-nowrap ${persistedTheme === "dark" ? "text-white" : ""
                      }`}
                  >
                    0%
                  </span>
                )}
              </>
            ) : (
              <></>
            )}

            <>
              <div
                id="custom-yello-checkbox"
                className="flex h-full items-center "
              >
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
                    props.percentages?.contendedPercentage[
                    props.answer.trim()
                    ] ? (
                    props.percentages?.contendedPercentage[
                      props.answer.trim()
                    ] === 100 ? (
                      <span
                        className={`w-[4ch] whitespace-nowrap ${persistedTheme === "dark" ? "text-white" : ""
                          }`}
                      >
                        100%
                      </span>
                    ) : (
                      <span
                        className={`w-[4ch] whitespace-nowrap ${persistedTheme === "dark" ? "text-white" : ""
                          }`}
                      >
                        {props.percentages?.contendedPercentage[
                          props.answer.trim()
                        ] + "%"}
                      </span>
                    )
                  ) : (
                    <span
                      className={`w-[4ch] whitespace-nowrap ${persistedTheme === "dark" ? "text-white" : ""
                        }`}
                    >
                      0%
                    </span>
                  )}
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
