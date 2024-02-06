import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import DeleteOption from './DeleteOption';
import EditNewOption from './EditNewOption';
import BasicModal from '../../../components/BasicModal';
import ContentionIcon from '../../../assets/Quests/ContentionIcon';

const RankedResult = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [checkState, setCheckState] = useState(props.contend);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.contend);
  }, [props.contend]);

  // const handleCheckChange = () => {
  //   setCheckState((prevState) => {
  //     props.handleCheckChange(!prevState);
  //     return !prevState;
  //   });
  // };

  return (
    <div className="flex items-center tablet:mr-[52px] tablet:pl-[1.75rem]">
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
      <div className="flex min-h-[21.8px] h-[21.8px] w-3 min-w-[12px] items-center justify-center rounded-l-[5.387px]  bg-[#DEE6F7] dark:bg-[#D9D9D9] tablet:h-[49px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:min-w-[25px] laptop:w-[25px]">
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

          <div className="relative flex w-full justify-between">
            <div
              className="block h-[5px] tablet:h-[10px] absolute top-0 bg-[#4DD896]"
              style={{
                width: props?.selectedPercentages && props?.selectedPercentages[props?.answer.trim()],
              }}
            />
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
            {/* <div
              className={`block h-[10px] absolute bottom-0 bg-[#FDD503B2]`}
              style={{
                width: props?.selectedPercentages[props?.answer.trim()],
              }}
            /> */}
            <div
              className={`block h-[5px] tablet:h-[10px] absolute bottom-0 bg-[#FDD503B2]`}
              style={{
                width:
                  props.contendPercentages &&
                  props.contendPercentages?.[props.answer.trim()] &&
                  props.contendPercentages?.[props.answer.trim()] !== '0%'
                    ? props.contendPercentages[props.answer.trim()]
                    : '0%',
              }}
            />
          </div>
        </div>
        {/* to show ranked and multiple choice options */}
        <div className="mr-[10.63px] flex items-center gap-[19px] text-[9.238px] tablet:mr-[11px] tablet:text-[16px] ">
          {props.btnText === 'Results' ? (
            <>
              {props?.selectedPercentages && props.selectedPercentages[props.answer.trim()] ? (
                <div className="flex items-center gap-[10px]">
                  <h1 className="text-[8.52px] font-bold leading-[0px] text-[#22AA69] tablet:text-[19px]">R</h1>
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

      {/* =============== To Display Contention and Trash Right of Option */}

      <div className="flex w-12 min-w-[48px] items-center bg-white pl-1 text-[9.238px] dark:bg-[#000] tablet:w-[66px] tablet:justify-center tablet:pl-[11px] tablet:text-[16px]">
        {props.btnText === 'Results' ? (
          <>
            {props.contendPercentages &&
            props.contendPercentages?.[props.answer.trim()] &&
            props.contendPercentages?.[props.answer.trim()] !== '0%' ? (
              <div className="flex items-center gap-1 tablet:gap-[10px]">
                <ContentionIcon classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5" checked={checkState} />
                <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">
                  {props.contendPercentages[props.answer.trim()]}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 tablet:gap-[10px]">
                <ContentionIcon classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5" checked={false} />
                <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RankedResult;
