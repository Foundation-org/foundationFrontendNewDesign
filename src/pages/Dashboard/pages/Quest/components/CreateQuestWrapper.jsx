import { Tooltip } from '../../../../../utils/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import ReactPlayer from 'react-player';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import { useState } from 'react';
import BasicModal from '../../../../../components/BasicModal';
import EmbedeDialogue from '../../../../../components/dialogue-boxes/EmbedeDialogue';
import { Button } from '../../../../../components/ui/Button';
import './Player.css';

export default function CreateQuestWrapper({ type, handleTab, msg, url, setUrl, setDescription, children }) {
  const dispatch = useDispatch();
  const [copyModal, setCopyModal] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const [isShowPreview, setIsShowPreview] = useState(false);

  const handleQuestionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 350) {
      dispatch(createQuestAction.addQuestion(inputValue));
    }
  };

  const questionVerification = async (value) => {
    if (createQuestSlice.validatedQuestion === value) return;
    dispatch(createQuestAction.checkQuestion(value));
  };

  const handleCopyOpen = () => {
    setCopyModal(true);
  };

  const handleCopyClose = () => setCopyModal(false);

  const customModalStyle = {
    backgroundColor: '#FCFCFD',
    boxShadow: 'none',
    border: '0px',
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
      <BasicModal
        open={copyModal}
        handleClose={handleCopyClose}
        customStyle={customModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <EmbedeDialogue handleClose={handleCopyClose} setIsShowPreview={setIsShowPreview} url={url} setUrl={setUrl} />
      </BasicModal>

      <h4 className="mt-[10.5px] text-center text-[8px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25px] tablet:text-[16px]">
        {msg}
      </h4>
      <div
        className={`${
          persistedTheme === 'dark' ? 'border-[1px] border-[#858585] tablet:border-[2px]' : ''
        } mx-auto my-[10px] max-w-[85%] rounded-[8.006px] bg-white py-[8.75px] tablet:my-[15px] tablet:rounded-[26px] tablet:py-[27px] laptop:max-w-[1084px] laptop:pb-[30px] laptop:pt-[25px] dark:bg-[#141618]`}
      >
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[22.81px] laptop:text-[25px] dark:text-[#D8D8D8]">
          Create a {type}
        </h1>
        {/* {isShowPreview ? ( */}
        <div>
          <div className="w-[calc(100%-51.75px] mx-[22px] mt-1 flex flex-col gap-[6px] tablet:mx-[60px] tablet:mt-[25px] tablet:gap-[15px]">
            <TextareaAutosize
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please decribe this embeded video"
              className="w-full resize-none rounded-[5.128px] border border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-[10.3px] tablet:border-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
            />
            <TextareaAutosize
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Please decribe this embeded video"
              className="w-full resize-none rounded-[5.128px] border border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-[10.3px] tablet:border-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
            />
          </div>

          <div className="player-wrapper mt-[6px] tablet:mt-[15px]">
            <ReactPlayer
              url={url}
              className="react-player"
              playing
              width="100%"
              height="100%"
              controls={true}
              muted={true}
            />
          </div>
        </div>
        {/* ) : (
          <Button
            variant="addEmbeded"
            className="ml-[21.55px] mt-[16px] tablet:ml-[60px] tablet:mt-[33px]"
            onClick={handleCopyOpen}
          >
            + Add Embeded Link
          </Button>
        )} */}
        <div className="w-[calc(100%-51.75px] mx-[22px] mt-[6px] flex tablet:mx-[60px] tablet:mt-[15px] tablet:pb-[13px]">
          <TextareaAutosize
            id="input-0"
            aria-label="multiple choice question"
            onChange={handleQuestionChange}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={createQuestSlice.question}
            placeholder="Pose a question"
            tabIndex={1}
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
          />
          <button
            id="new"
            className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${questionStatus.color}`}
          >
            <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
              {createQuestSlice.questionTyping ? `${createQuestSlice.question.length}/350` : questionStatus.name}
            </div>
            <Tooltip optionStatus={questionStatus} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
