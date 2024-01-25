import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

import { Tooltip } from '../../../utils/Tooltip';
import { resetaddOptionLimit } from '../../../features/quest/utilsSlice';
import BasicModal from '../../BasicModal';
import DeleteOption from '../../../pages/Dashboard/components/DeleteOption';

import * as questServices from '../../../services/api/questsApi';
import ContentionIcon from '../../../assets/Quests/ContentionIcon';

const SingleAnswerMultipleChoice = (props) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);
  const [deleteModal, setDeleteModal] = useState(false);
  const [answer, setAnswer] = useState(props.answer);
  const reset = {
    name: 'Ok',
    color: 'text-[#389CE3]',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
  };
  const [checkOptionStatus, setCheckOptionStatus] = useState(reset);
  const [prevValue, setPrevValue] = useState('');

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
    setCheckOptionStatus(e.target.value.trim() === '' ? reset : { name: 'Ok', color: 'text-[#b0a00f]' });
  };

  const optionVerification = async (value) => {
    if (prevValue === answer) return;
    setPrevValue(value);
    setCheckOptionStatus({
      name: 'Checking',
      color: 'text-[#0FB063]',
      tooltipName: 'Verifying your option. Please wait...',
      tooltipStyle: 'tooltip-success',
    });
    // option Validation
    const { validatedAnswer, errorMessage } = await questServices.answerValidation({
      answer: value,
    });
    // If any error captured
    if (errorMessage) {
      return setCheckOptionStatus({
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
      });
    }
    // Check Answer is unique
    let answerExist = questServices.checkAnswerExist({
      answersArray: props.answersSelection,
      answer: validatedAnswer,
      index: 0,
      startQuest: true,
    });
    if (answerExist) {
      return setCheckOptionStatus({
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Found Duplication!',
        tooltipStyle: 'tooltip-error',
        duplication: true,
      });
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
      setAnswer(validatedAnswer);
      setCheckOptionStatus({
        name: 'Ok',
        color: 'text-[#0FB063]',
        tooltipName: 'Answer is Verified',
        tooltipStyle: 'tooltip-success',
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
    toast.success('Item deleted');
    setCheckOptionStatus(reset);
    const newArr = props.answersSelection.filter((item) => item.label !== props.answer);

    props.setAnswerSelection(newArr);
    // props.setAddOptionLimit(0);
    dispatch(resetaddOptionLimit());
    props.setAddOptionField(0);
  };

  return (
    <div
      className={`flex items-center  tablet:gap-[10px] tablet:pl-[1.75rem] ${
        props.btnText === 'Results' ? 'tablet:mr-[46px]' : 'tablet:mr-[52px]'
      }`}
    >
      {/* =============== To Display Badges on Left of Option */}
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === persistedUserInfo.uuid ? (
          <div className="flex w-7 min-w-[28px] items-center justify-center bg-white dark:bg-[#000] tablet:h-[33px] tablet:w-[26.48px]">
            <img
              src="/assets/addOptions/yellowBadge.svg"
              alt="optionMeBadge"
              className="h-5 w-[15px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        ) : (
          <div className="flex w-7 min-w-[28px] items-center justify-center bg-white dark:bg-[#000] tablet:h-[33px] tablet:w-[26.48px]">
            <img
              src="/assets/addOptions/blueBadge.svg"
              alt="bluebadge"
              className="h-5 w-[15px] cursor-pointer tablet:h-[33px] tablet:w-[26.48px]"
            />
          </div>
        )
      ) : (
        <div className="flex w-7 min-w-[28px] items-center justify-center bg-white dark:bg-[#000] tablet:h-[33px] tablet:w-[26.48px]">
          &#x200B;
        </div>
      )}

      {/* =============== To Display Option */}
      <div className="flex w-full justify-between rounded-[4.7px] tablet:rounded-[10px]">
        <div
          className={`flex w-full items-center rounded-l-[5.387px] bg-white dark:bg-[#0D1012] tablet:rounded-l-[10px] ${props.btnText === 'Results' ? 'pointer-events-none' : 'cursor-pointer'}`}
          onClick={() => (props.btnText === 'Results' ? null : handleCheckChange())}
        >
          <div className="flex h-full w-3 min-w-[12px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] dark:bg-[#D9D9D9] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px]"></div>
          <div className="flex w-full justify-between border-y border-y-[#DEE6F7] tablet:border-y-[3px]">
            {props.editable ? (
              <input
                type="text"
                className="w-full rounded-[4.73px] bg-white px-4 pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-none text-[#435059] outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3] tablet:rounded-[10.949px] tablet:py-[10px] tablet:pl-[18px] tablet:text-[19px]"
                value={answer}
                onChange={handleInputChange}
                onBlur={(e) => e.target.value.trim() !== '' && optionVerification(e.target.value.trim())}
              />
            ) : (
              <h1 className="pb-[5.7px] pl-[18px] pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] dark:text-[#D3D3D3] tablet:py-3 tablet:text-[19px]">
                {props.answer}
              </h1>
            )}
            {props.deleteable && (
              <div
                className={`relative flex items-center bg-white text-[0.5rem] font-semibold dark:bg-[#0D1012] tablet:h-[43px] tablet:text-[1rem] laptop:text-[1.2rem] ${checkOptionStatus.color}`}
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
          className={`flex cursor-pointer items-center gap-[10.03px] rounded-r-[4.7px] border-y border-r border-[#DEE6F7] bg-white pr-[10px]  text-[9.238px] dark:border-[#DEE6F7] dark:bg-[#0D1012] tablet:gap-[19px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[16px] ${
            props.btnText === 'Results' ? 'pointer-events-none' : ''
          }`}
          onClick={() => (props.btnText === 'Results' ? null : handleCheckChange())}
        >
          <div className="flex items-center gap-1 laptop:gap-[18px]">
            <div id="custom-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={checkState}
                readOnly
              />
            </div>

            {props.btnText === 'Results' ? (
              <>
                {props.selectedPercentages && props.selectedPercentages?.[props.answer.trim()] ? (
                  <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">
                    {props.selectedPercentages[props.answer.trim()]}
                  </span>
                ) : (
                  <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* =============== To Display Contention and Trash Right of Option */}
        {props.btnText !== 'Results' ? (
          <div className="flex w-12 min-w-[48px] items-center bg-white pl-1 dark:bg-[#000] tablet:w-8 tablet:justify-center tablet:pl-[15px]">
            {props.deleteable ? (
              <img
                src="/assets/svgs/dashboard/trash2.svg"
                alt="trash"
                className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                onClick={handleDeleteOption}
              />
            ) : (
              <div className="flex items-center gap-1 laptop:gap-[18px]">
                <div id="custom-yello-checkbox" className="flex h-full items-center ">
                  <div className="cursor-pointer" onClick={handleContendChange}>
                    <ContentionIcon
                      classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5"
                      checked={contendState}
                    />
                  </div>
                </div>
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
          <div className="flex w-12 min-w-[48px] items-center bg-white pl-1 text-[9.238px] dark:bg-[#000] tablet:w-[66px] tablet:justify-center tablet:pl-[11px] tablet:text-[16px]">
            {props.btnText === 'Results' ? (
              <>
                {props.contendPercentages &&
                props.contendPercentages?.[props.answer.trim()] &&
                props.contendPercentages?.[props.answer.trim()] !== '0%' ? (
                  <div className="flex items-center gap-1 tablet:gap-[10px]">
                    <ContentionIcon classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5" checked={true} />
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
        )}
      </div>
    </div>
  );
};

export default SingleAnswerMultipleChoice;
