import { Tooltip } from '../../../../../utils/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import AddMedia from './AddMedia';
import AddPictures from './AddPictures';
import AddPictureUrls from './AddPictureUrls';
import { POST_QUESTION_CHAR_LIMIT } from '../../../../../constants/Values/constants';
import { dyk } from '../../../../../constants/dyk';
import SystemNotificationCard from '../../../../../components/posts/SystemNotificationCard';

export default function CreateQuestWrapper({ quest, type, handleTab, msg, children }) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicMediaStates = useSelector(pictureMediaAction.getPicsMedia);
  const getPicsMediaStates = useSelector(createQuestAction.getPicsMedia);

  const handleQuestionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= POST_QUESTION_CHAR_LIMIT) {
      dispatch(createQuestAction.addQuestion(inputValue));
    }
  };

  const questionVerification = async (value) => {
    if (createQuestSlice.validatedQuestion === value) return;
    dispatch(createQuestAction.checkQuestion(value));
  };

  return (
    <div>
      <div className="mx-auto mb-[10px] max-w-[90%] rounded-[8.006px] bg-white py-3 dark:bg-gray-200 tablet:mb-[15px] tablet:max-w-[730px] tablet:rounded-[39px] tablet:py-[27px] laptop:py-[25px]">
        <h1 className="hidden text-center text-[10px] font-semibold leading-normal text-gray-900 dark:text-white-400 tablet:block tablet:text-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
          Create a {type}
        </h1>
        <h4 className="mt-1 text-center text-[8px] font-medium leading-normal text-gray-800 tablet:mt-[25px] tablet:text-[16px] tablet:leading-[16px]">
          {msg}
        </h4>
        {getMediaStates?.isMedia.isMedia === false && getPicMediaStates.isPicMedia === false && (
          <div className="mx-[30px] mt-3 flex items-center justify-between gap-1 tablet:mt-[25px] tablet:gap-2 laptop:mx-4 laptop:gap-4 desktop:mx-[50px] desktop:gap-12">
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
                dispatch(pictureMediaAction.updateIsPicMedia(true));
              }}
            >
              + Add Image
            </Button>
          </div>
        )}
        <AddMedia handleTab={handleTab} />
        {/* <AddPictures /> */}
        <AddPictureUrls />
        <div className="w-[calc(100%-51.75px] mx-[30px] mb-[10px] mt-3 flex tablet:mx-[50px] tablet:mb-7 tablet:mt-[15px]">
          <TextareaAutosize
            id="input-2"
            aria-label="multiple choice question"
            onChange={handleQuestionChange}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value)}
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
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] py-[7px] text-[10px] font-medium leading-3 tracking-wide text-[#7C7C7C] focus-visible:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
          />

          <button
            id="new"
            className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none dark:border-gray-100 dark:bg-accent-100 tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] ${questionStatus.color}`}
          >
            <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 dark:border-gray-100 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
              {createQuestSlice.questionTyping ? `${createQuestSlice.question.length}/350` : questionStatus.name}
            </div>
            <Tooltip optionStatus={questionStatus} />
          </button>
        </div>
        {children}
      </div>

      <div className="mx-auto mb-4 max-w-[730px] px-4 tablet:px-0">
        <SystemNotificationCard post={dyk} />
      </div>
    </div>
  );
}
