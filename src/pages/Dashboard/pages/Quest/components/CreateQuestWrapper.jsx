import { useEffect, useState } from 'react';
import { Tooltip } from '../../../../../utils/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';

export default function CreateQuestWrapper({ question, setQuestion, type, handleTab, msg, children }) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const chatgptQuestionStatus = useSelector(createQuestAction.questionChatgptStatus);

  const [prevValue, setPrevValue] = useState('');
  const [questionStatusApi, setquestionStatusApi] = useState(questionStatus);
  const [prevStatus, setPrevStatus] = useState(chatgptQuestionStatus);
  const [isTyping, setIsTyping] = useState(false);

  const handleQuestionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 350) {
      setQuestion(inputValue);
      setIsTyping(true);
      dispatch(createQuestAction.handleQuestionReset(inputValue));
    }

    if (prevValue === e.target.value.trim()) {
      setquestionStatusApi(prevStatus);
    } else {
      setquestionStatusApi(questionStatus);
    }
  };

  // To Verify Question
  const questionVerification = async (value) => {
    if (prevValue === question.trim()) {
      setquestionStatusApi(prevStatus);
      return;
    }

    dispatch(createQuestAction.checkQuestion(value));
    setPrevValue(value);
  };

  // Question State updated
  useEffect(() => {
    if (createQuestSlice.question) {
      setQuestion(createQuestSlice.question);
      setPrevValue(createQuestSlice.question);
    }

    setquestionStatusApi(questionStatus);
  }, [questionStatus]);

  // Question previous Status handled
  useEffect(() => {
    if (chatgptQuestionStatus) {
      setPrevStatus(chatgptQuestionStatus);
    }
  }, [chatgptQuestionStatus]);

  // Reset the typing counter to false when stop typing
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(typingTimer);
  }, [question]);

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
        <div className="w-[calc(100%-51.75px] mx-[22px] mt-1 flex tablet:mx-[60px] tablet:mt-5 tablet:pb-[13px]">
          <TextareaAutosize
            id="input-0"
            aria-label="multiple choice question"
            onChange={handleQuestionChange}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={question}
            placeholder="Pose a question"
            tabIndex={1}
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-[#7C7C7C] focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
          />
          <button
            id="new"
            className={`relative rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${questionStatusApi.color}`}
          >
            <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-[#DEE6F7] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
              {isTyping ? `${question.length}/350` : questionStatusApi.name}
            </div>
            <Tooltip optionStatus={questionStatusApi} />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
