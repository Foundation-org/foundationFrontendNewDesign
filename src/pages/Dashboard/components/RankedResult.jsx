import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import DeleteOption from './DeleteOption';
import EditNewOption from './EditNewOption';
import BasicModal from '../../../components/BasicModal';

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
    <div className="flex items-center tablet:mr-[65.36px] tablet:pl-[1.75rem]">
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === persistedUserInfo?.uuid || localStorage.getItem('uId') ? (
          <div className="flex w-7 min-w-[28px] items-center justify-center bg-[#F3F3F3] dark:bg-[#141618] tablet:w-[45.6px]">
            <img
              src="/assets/svgs/dashboard/optionMeBadge.svg"
              alt="trash"
              className="h-4 w-[12px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        ) : (
          <div className="flex w-7 min-w-[28px] items-center justify-center bg-[#F3F3F3] dark:bg-[#141618] tablet:w-[45.6px]">
            <img
              src="/assets/svgs/dashboard/bluebadge.svg"
              alt="trash"
              className="h-4 w-[12px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        )
      ) : (
        <div className="flex w-7 min-w-[28px] items-center justify-center bg-[#F3F3F3] dark:bg-[#141618] tablet:w-[45.6px]"></div>
      )}
      <div className="flex h-full w-3 min-w-[12px] items-center justify-center rounded-l-[5.387px]  bg-[#DEE6F7] dark:bg-[#D9D9D9] tablet:h-[49px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px]">
        &#x200B;
      </div>
      <div className="tablet:rounded-l-0 rounded-l-0 flex w-full justify-between rounded-r-[4.73px] border-y border-l-0 border-r border-[#DEE6F7] bg-white dark:border-[#D9D9D9] dark:bg-[#0D1012] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px]">
        <div className="flex w-full items-center">
          {props.btnText !== 'Results' && (
            <div className="h-full w-fit rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
              {persistedTheme === 'dark' ? (
                <img src="/assets/svgs/dashboard/six-dots-dark.svg" alt="six dots" />
              ) : (
                <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
              )}
            </div>
          )}

          <div className="flex w-full justify-between">
            <h1 className="w-full pb-[5.7px] pl-[18px] pt-[5.6px] text-[8.5px] font-normal leading-none text-[#435059] dark:text-[#D3D3D3] tablet:py-3 tablet:text-[19px]">
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
        <div className="mr-[10.63px] flex items-center gap-[19px] text-[9.238px] tablet:mr-[11px] tablet:text-[16px] ">
          {props.btnText === 'Results' ? (
            <>
              {props?.selectedPercentages && props.selectedPercentages[props.answer.trim()] ? (
                <div className="flex items-center gap-[10px]">
                  <h1 className="text-[16px] font-bold leading-[0px] text-[#22AA69] tablet:text-[25px]">R</h1>
                  <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">
                    {props?.selectedPercentages[props?.answer.trim()]}
                  </span>
                </div>
              ) : (
                <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0.00%</span>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="flex w-12 min-w-[48px] items-center justify-center bg-[#F3F3F3] dark:bg-[#141618] tablet:w-[45.6px]" />
    </div>
  );
};

export default RankedResult;
