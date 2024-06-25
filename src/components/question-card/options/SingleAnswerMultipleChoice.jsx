// import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Tooltip } from '../../../utils/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { resetaddOptionLimit } from '../../../features/quest/utilsSlice';
import BasicModal from '../../BasicModal';
import DeleteOption from '../../../pages/Dashboard/components/DeleteOption';

import * as questServices from '../../../services/api/questsApi';
import ContentionIcon from '../../../assets/Quests/ContentionIcon';
import ObjectionPopUp from '../../ObjectionPopUp';

const SingleAnswerMultipleChoice = (props) => {
  const id = props.id;
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);
  const [deleteModal, setDeleteModal] = useState(false);
  const [answer, setAnswer] = useState(props.answer);
  const [isTyping, setIsTyping] = useState(true);

  const reset = {
    name: 'Ok',
    color: 'text-[#389CE3]',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
  };

  const [prevValue, setPrevValue] = useState('');
  const [prevStatus, setPrevStatus] = useState(props.checkOptionStatus);

  const handleDeleteClose = () => setDeleteModal(false);

  const handlePopUpOpen = () => setModalVisible(true);
  const handlePopUpClose = () => setModalVisible(false);

  useEffect(() => {
    setCheckState(props.check);
    setContendState(props.contend);
  }, [props.check, props.contend]);

  const handleCheckChange = () => {
    if (contendState) {
      setContendState(false);
      props.handleContendChange(false);
    }
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  // const handleContendChange = () => {
  //   if (checkState) {
  //     handleCheckChange(false);
  //     props.handleCheckChange(false);
  //   }
  //   setContendState((prevState) => {
  //     props.handleContendChange(!prevState);
  //     return !prevState;
  //   });
  // };

  const handleContendChange = (state) => {
    if (checkState) {
      handleCheckChange(false);
      props.handleCheckChange(false);
    }
    props.handleContendChange(state);
    setContendState(state);
  };

  const handleContendPopup = () => {
    if (contendState) {
      if (checkState) {
        handleCheckChange(false);
        props.handleCheckChange(false);
      }
      props.handleContendChange(false);
      setContendState(false);
    } else {
      handlePopUpOpen();
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 200) {
      setIsTyping(true);
      setAnswer(inputValue);

      if (prevValue === inputValue.trim()) {
        setIsTyping(false);
        props.setCheckOptionStatus(prevStatus);
      } else {
        props.setCheckOptionStatus(reset);
      }
    }
  };

  const optionVerification = async (value) => {
    if (prevValue === answer) return;

    setIsTyping(false);
    setPrevValue(value);
    props.setCheckOptionStatus({
      name: 'Checking',
      color: 'text-[#0FB063]',
      tooltipName: 'Verifying your option. Please wait...',
      tooltipStyle: 'tooltip-success',
      showToolTipMsg: true,
    });
    setPrevStatus({
      name: 'Checking',
      color: 'text-[#0FB063]',
      tooltipName: 'Verifying your option. Please wait...',
      tooltipStyle: 'tooltip-success',
      showToolTipMsg: true,
    });
    // option Validation
    const { validatedAnswer, errorMessage } = await questServices.answerValidation({
      answer: value,
    });
    // If any error captured
    if (errorMessage) {
      setPrevStatus({
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
        showToolTipMsg: true,
      });
      return props.setCheckOptionStatus({
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
        showToolTipMsg: true,
      });
    }
    // Check Answer is unique
    let answerExist = questServices.checkAnswerExist({
      answersArray: props.answersSelection,
      answer: validatedAnswer,
      index: id,
      startQuest: true,
    });
    if (answerExist) {
      setPrevStatus({
        name: 'Duplicate',
        color: 'text-[#EFD700]',
        tooltipName: 'Found Duplication!',
        tooltipStyle: 'tooltip-error',
        duplication: true,
        showToolTipMsg: true,
      });
      return props.setCheckOptionStatus({
        name: 'Duplicate',
        color: 'text-[#EFD700]',
        tooltipName: 'Found Duplication!',
        tooltipStyle: 'tooltip-error',
        duplication: true,
        showToolTipMsg: true,
      });
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
      setAnswer(validatedAnswer);
      setPrevValue(validatedAnswer);
      setPrevStatus({
        name: 'Ok',
        color: 'text-[#0FB063]',
        tooltipName: 'Answer is Verified',
        tooltipStyle: 'tooltip-success',
        isVerifiedAnswer: true,
        showToolTipMsg: true,
      });
      props.setCheckOptionStatus({
        name: 'Ok',
        color: 'text-[#0FB063]',
        tooltipName: 'Answer is Verified',
        tooltipStyle: 'tooltip-success',
        isVerifiedAnswer: true,
        showToolTipMsg: true,
      });
    }
  };

  useEffect(() => {
    handleAddOption();
  }, [answer]);

  const handleAddOption = () => {
    const newArr = props.answersSelection.map((item, index) =>
      index === id ? { ...item, label: answer.trim() } : item,
    );
    props.setAnswerSelection(newArr);
  };

  const handleDeleteOption = () => {
    // toast.success('Item deleted');
    props.setCheckOptionStatus(reset);

    const newArr = props.answersSelection.filter((item, index) => index !== id);

    props.setAnswerSelection(newArr);
    dispatch(resetaddOptionLimit());
    props.setAddOptionField(0);
  };

  const handleTab = () => {
    document.getElementById(`addedOption-${answer}`).blur();
  };

  return (
    <div
      className={`flex items-center  tablet:gap-[10px] tablet:pl-[1.75rem] ${
        props.btnText === 'Results' ? 'tablet:mr-[41px]' : 'tablet:mr-[52px]'
      }`}
    >
      {/* =============== To Display Badges on Left of Option */}
      {props.addedAnswerUuid ? (
        props.addedAnswerUuid === persistedUserInfo?.uuid ? (
          <div className="flex w-7 min-w-[28px] items-center justify-center bg-transparent tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#000]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/addOptions/yellowBadge.svg`}
              alt="optionMeBadge"
              className="h-[15.5px] w-[12.44px] tablet:h-[27px] tablet:w-[21px]"
            />
          </div>
        ) : (
          <div className="flex w-7 min-w-[28px] items-center justify-center bg-transparent tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#000]">
            {/* <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/addOptions/blueBadge.svg`}
              alt="blue badge"
              className="h-[15.5px] w-[12.44px] tablet:h-[27px] tablet:w-[21px]"
            /> */}
          </div>
        )
      ) : (
        <div className="flex w-7 min-w-[28px] items-center justify-center bg-transparent tablet:h-[33px] tablet:w-[26.48px] dark:bg-[#000]">
          &#x200B;
        </div>
      )}

      {/* =============== To Display Option */}
      <div className="flex w-full justify-between rounded-[4.7px] tablet:rounded-[10px]">
        <div
          className={`flex w-full items-center rounded-l-[5.387px] bg-white tablet:rounded-l-[10px] dark:bg-[#0D1012] ${props.btnText === 'Results' || props.postProperties === 'HiddenPosts' ? 'pointer-events-none' : 'cursor-pointer'}`}
          onClick={() => (props.btnText === 'Results' ? null : handleCheckChange())}
        >
          <div className="flex h-full min-h-[21.8px] w-3 min-w-[12px] items-center justify-center rounded-l-[5.387px] bg-[#DEE6F7] tablet:h-full tablet:min-h-[49px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] dark:bg-[#D9D9D9]"></div>
          <div className="relative flex h-full min-h-[21.8px] w-full justify-between border-y border-y-[#DEE6F7] tablet:h-full tablet:min-h-[49px] tablet:border-y-[3px]">
            <div
              className="absolute top-0 block h-[5px] bg-[#4DD896] tablet:h-[10px]"
              style={{
                width:
                  props.selectedPercentages && props.selectedPercentages?.[props.answer.trim()]
                    ? props?.selectedPercentages[props?.answer.trim()]
                    : '0%',
              }}
            />
            {props.editable ? (
              <TextareaAutosize
                id={`addedOption-${answer}`}
                onChange={handleInputChange}
                onBlur={(e) => e.target.value.trim() !== '' && optionVerification(e.target.value.trim())}
                value={answer}
                autoFocus
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab())}
                className="w-full resize-none rounded-[4.73px] bg-white px-2 pb-[5.7px] pt-[5.6px] text-[8.5px] font-normal leading-none text-[#435059] outline-none tablet:rounded-[10.949px] tablet:py-[10px] tablet:pl-[18px] tablet:text-[19px] dark:bg-[#0D1012] dark:text-[#D3D3D3]"
              />
            ) : (
              <h1 className="px-2 pb-[5.7px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] text-[#435059] tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px] dark:text-[#D3D3D3]">
                {props.answer}
              </h1>
            )}
            {props.deleteable && (
              <div
                className={`relative flex items-center bg-white text-[0.5rem] font-semibold tablet:text-[1rem] laptop:text-[1.25rem] dark:bg-[#0D1012] ${props.checkOptionStatus.color}`}
              >
                <div className="flex h-[75%] w-[45px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[7rem]">
                  <span> {isTyping ? `${answer.length}/200` : props.checkOptionStatus.name}</span>
                </div>
                <Tooltip optionStatus={props.checkOptionStatus} />
              </div>
            )}
            <div
              className={`absolute bottom-0 block h-[5px] bg-[#FDD503B2] tablet:h-[10px]`}
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
        {props?.postProperties === 'HiddenPosts' ? (
          <div className="flex items-center gap-[10.03px] rounded-r-[4.7px] border-y border-r border-[#DEE6F7] bg-white pr-[10px]  text-[9.238px] tablet:gap-[19px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[16px] dark:border-[#DEE6F7] dark:bg-[#0D1012]"></div>
        ) : (
          <div
            className={`flex cursor-pointer items-center gap-[10.03px] rounded-r-[4.7px] border-y border-r border-[#DEE6F7] bg-white pr-[10px]  text-[9.238px] tablet:gap-[19px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[16px] dark:border-[#DEE6F7] dark:bg-[#0D1012] ${
              props.btnText === 'Results' ? 'pointer-events-none' : ''
            }`}
            onClick={() => (props.btnText === 'Results' ? null : handleCheckChange())}
          >
            <div className="flex items-center gap-1 laptop:gap-[18px]">
              {props?.postProperties !== 'sharedlink-results' && (
                <div id="custom-checkbox" className="flex h-full items-center">
                  <input
                    id="small-checkbox"
                    type="checkbox"
                    className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                    checked={checkState}
                    readOnly
                  />
                </div>
              )}

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
        )}

        {/* =============== To Display Contention and Trash Right of Option */}

        {props.postProperties === 'HiddenPosts' ? (
          <div className="flex w-12 min-w-[48px] items-center bg-white pl-2 tablet:w-8 tablet:justify-center tablet:pl-[15px] dark:bg-[#000]"></div>
        ) : props.btnText !== 'Results' ? (
          <div
            className="flex w-12 min-w-[48px] items-center bg-white pl-2 tablet:w-8 tablet:justify-center tablet:pl-[15px] dark:bg-[#000]"
            onClick={handleContendPopup}
          >
            {props.deleteable ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                alt="trash"
                className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                onClick={() => handleDeleteOption(props.number)}
              />
            ) : (
              <div className="flex items-center gap-1 laptop:gap-[18px]">
                {props?.postProperties !== 'sharedlink-results' && (
                  <div id="custom-yello-checkbox" className="flex h-full items-center ">
                    <div className="cursor-pointer">
                      <ContentionIcon
                        classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5"
                        checked={contendState}
                      />
                    </div>
                  </div>
                )}
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
          <div className="flex w-12 min-w-[48px] items-center bg-white pl-1 text-[9.238px] tablet:w-[66px] tablet:justify-center tablet:pl-[11px] tablet:text-[16px] dark:bg-[#000]">
            {props.btnText === 'Results' ? (
              <>
                {props.contendPercentages &&
                props.contendPercentages?.[props.answer.trim()] &&
                props.contendPercentages?.[props.answer.trim()] !== '0%' ? (
                  <div className="flex items-center gap-1 tablet:gap-[10px]">
                    {props?.postProperties !== 'sharedlink-results' && (
                      <ContentionIcon
                        classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5"
                        checked={contendState}
                      />
                    )}
                    <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">
                      {props.contendPercentages[props.answer.trim()]}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 tablet:gap-[10px]">
                    {props?.postProperties !== 'sharedlink-results' && (
                      <ContentionIcon classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5" checked={false} />
                    )}
                    <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* =============== Objection PopUp */}
      <ObjectionPopUp
        modalVisible={modalVisible}
        handleClose={handlePopUpClose}
        handleContendChange={handleContendChange}
        option={props.answer}
      />
    </div>
  );
};

export default SingleAnswerMultipleChoice;
