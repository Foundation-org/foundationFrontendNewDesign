import { Tooltip } from '../../../../../utils/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import AddMedia from './AddMedia';
import AddPictures from './AddPictures';

export default function CreateQuestWrapper({ quest, type, handleTab, msg, children }) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicsMediaStates = useSelector(createQuestAction.getPicsMedia);

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

  return (
    <>
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
        {getMediaStates?.isMedia.isMedia === false && getPicsMediaStates?.isPicMedia === false && (
          <div className="tablet::gap-2 mb-2 ml-[21.55px] mt-[16px] flex items-center gap-1 px-2 tablet:ml-[60px] tablet:mt-[33px] laptop:gap-12">
            <Button
              variant="addEmbeded"
              className="px-2 tablet:px-[25px]"
              onClick={() => {
                dispatch(createQuestAction.updateIsPicMedia(false));
                dispatch(
                  createQuestAction.updateIsMedia({
                    isMedia: true,
                    type: 'EmbedVideo',
                  }),
                );
              }}
            >
              + Add Video
            </Button>
            {getMediaStates?.isMedia.isMedia === false && (
              <Button
                variant="addEmbeded"
                className="px-2 tablet:px-[25px]"
                onClick={() => {
                  dispatch(createQuestAction.updateIsPicMedia(false));
                  dispatch(
                    createQuestAction.updateIsMedia({
                      isMedia: true,
                      type: 'EmbedAudio',
                    }),
                  );
                }}
              >
                + Add Audio
              </Button>
            )}
            <Button
              variant="addEmbeded"
              className="px-2 tablet:px-[25px]"
              onClick={() => {
                dispatch(
                  createQuestAction.updateIsMedia({
                    isMedia: false,
                    type: '',
                  }),
                );
                dispatch(createQuestAction.updateIsPicMedia(true));
              }}
            >
              + Add Image
            </Button>
          </div>
        )}
        <AddMedia handleTab={handleTab} />
        <AddPictures />
        <div className="w-[calc(100%-51.75px] mx-[22px] mt-2 flex tablet:mx-[60px] tablet:mt-[25px] tablet:pb-[13px]">
          <TextareaAutosize
            id="input-2"
            aria-label="multiple choice question"
            onChange={handleQuestionChange}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={createQuestSlice.question}
            placeholder={
              quest === 'M/R' || quest === 'OpenChoice'
                ? 'Make a statement or pose a question'
                : quest === 'Statement'
                  ? 'Make a statement'
                  : 'Pose a question'
            }
            tabIndex={3}
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
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
