import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkUniqueQuestion,
  createInfoQuest,
  getTopicOfValidatedQuestion,
  questionValidation,
} from '../../../../../services/api/questsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AgreeDisagreeOptions from '../components/AgreeDisagreeOptions';
import { Tooltip } from '../../../../../utils/Tooltip';

import { useSelector, useDispatch } from 'react-redux';
import ChangeChoiceOption from '../components/ChangeChoiceOption';
import { FaSpinner } from 'react-icons/fa';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import { updateQuestion, checkQuestion } from '../../../../../features/createQuest/createQuestSlice';
import { Button } from '../../../../../components/ui/Button';
import { TextareaAutosize } from '@mui/material';

const LikeDislike = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);

  console.log('get your value is like', createQuestSlice);
  const [question, setQuestion] = useState(createQuestSlice.question);
  const [prevValue, setPrevValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [hollow, setHollow] = useState(true);

  const reset = {
    name: 'Ok',
    color: 'text-[#389CE3]',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
  };
  const [checkQuestionStatus, setCheckQuestionStatus] = useState(reset);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        setTimeout(() => {
          navigate('/dashboard');
          toast.success('Successfully Created');
          setLoading(false);
          setQuestion('');
          setChangedOption('');
          setChangeState(false);
          dispatch(createQuestAction.resetCreateQuest());
        }, 500);
      }
      queryClient.invalidateQueries('FeedData');
    },
    onError: (err) => {
      if (err.response) {
        toast.error(err.response.data.message.split(':')[1]);
        setQuestion('');
        setChangedOption('');
        setChangeState(false);
      }
      setLoading(false);
    },
  });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleTab = () => {
    const settingElement = document.getElementById('question');
    if (settingElement) {
      settingElement.blur();
    }
  };

  const handleSubmit = async () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning('Please create an account to unlock this feature');
      return;
    }

    const constraintResponse = await checkUniqueQuestion(question);

    if (!checkHollow()) {
      setLoading(true);
    }

    if (question === '') {
      return toast.warning('Post cannot be empty');
    }
    // getTopicOfValidatedQuestion
    const { questTopic, errorMessage } = await getTopicOfValidatedQuestion({
      validatedQuestion: question,
    });
    // If any error captured
    if (errorMessage) {
      return toast.error('Oops! Something Went Wrong.');
    }

    const params = {
      Question: question,
      whichTypeQuestion: 'like/dislike',
      usersChangeTheirAns: changedOption,
      QuestionCorrect: 'Not Selected',
      uuid: persistedUserInfo.uuid,
      QuestTopic: questTopic,
    };

    if (!checkHollow()) {
      createQuest(params);
    }
  };

  const questionVerification = async (value) => {
    setQuestion(value.trim());
    if (prevValue === question.trim()) return;
    setPrevValue(value);
    dispatch(checkQuestion(value));
    // setCheckQuestionStatus({
    //   name: 'Checking',
    //   color: 'text-[#0FB063]',
    //   tooltipName: 'Verifying your question. Please wait...',
    //   tooltipStyle: 'tooltip-success',
    // });
    // Question Validation
    // const { validatedQuestion, errorMessage } = await questionValidation({
    //   question: value,
    //   queryType: 'like/dislike',
    // });
    // If any error captured
    // if (errorMessage) {
    //   setLoading(false);
    //   return setCheckQuestionStatus({
    //     name: 'Rejected',
    //     color: 'text-[#b00f0f]',
    //     tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
    //     tooltipStyle: 'tooltip-error',
    //   });
    // }
    // Question is validated and status is Ok
    // setQuestion(validatedQuestion);
    // setPrevValue(validatedQuestion);
    // setCheckQuestionStatus({
    //   name: 'Ok',
    //   color: 'text-[#0FB063]',
    //   tooltipName: 'Question is Verified',
    //   tooltipStyle: 'tooltip-success',
    //   isVerifiedQuestion: true,
    // });
  };

  const checkHollow = () => {
    if (questionStatus.tooltipName === 'Question is Verified') {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  useEffect(() => {
    if (!checkHollow() && question !== '') {
      setHollow(false);
    } else {
      setHollow(true);
    }
  }, [question, questionStatus.tooltipName]);

  useEffect(() => {
    dispatch(updateQuestion({ question, changedOption, changeState }));
  }, [question, changedOption, changeState]);

  useEffect(() => {
    // console.log("our question status is", questionStatus.status);
    // setLoading(questionStatus.status);
    if (createQuestSlice.question) {
      setQuestion(createQuestSlice.question);
      setPrevValue(createQuestSlice.question);
    }
  }, [questionStatus]);

  return (
    <>
      <h4 className="mt-[10.5px] text-center text-[8px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25px] tablet:text-[16px]">
        Make a statement that anyone can "Like" or "Dislike"
      </h4>
      <div
        className={`${
          persistedTheme === 'dark' ? 'border-[1px] border-[#858585] tablet:border-[2px]' : ''
        } mx-auto my-[10px] max-w-[85%] rounded-[8.006px] bg-white py-[8.75px] dark:bg-[#141618] tablet:my-[15px] tablet:rounded-[26px] tablet:py-[27px] laptop:max-w-[1084px] laptop:pb-[30px] laptop:pt-[25px]`}
      >
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#D8D8D8] tablet:text-[22.81px] laptop:text-[25px]">
          Create a Statement
        </h1>
        <div className="w-[calc(100%-51.75px] mx-[22px] mt-1 flex tablet:mx-[60px] tablet:mt-5 tablet:pb-[13px]">
          {/* <input
            id="question"
            className="w-full rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-[#435059] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
            onChange={(e) => {
              setQuestion(e.target.value);
              setCheckQuestionStatus({
                name: 'Ok',
                color: e.target.value.trim() === '' ? 'text-[#389CE3]' : 'text-[#b0a00f]',
              });
              dispatch(createQuestAction.handleQuestionReset(e.target.value));
            }}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={question}
            placeholder="Make a Statement"
            onKeyDown={(e) => (e.key === 'Tab' && handleTab(0)) || (e.key === 'Enter' && handleTab(0))}
          /> */}
          <TextareaAutosize
            id="question"
            onChange={(e) => {
              setQuestion(e.target.value);
              dispatch(createQuestAction.handleQuestionReset(e.target.value));
            }}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={question}
            placeholder="Make a Statement"
            onKeyDown={(e) => (e.key === 'Tab' && handleTab(0)) || (e.key === 'Enter' && handleTab(0))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-[#435059] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
          />
          <div
            id="test"
            className={`relative flex items-center leading-none rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:text-[1.25rem] laptop:rounded-r-[0.625rem] ${questionStatus.color}`}
          >
            <div className="flex w-[50px] h-[75%] items-center justify-center border-l-[0.7px] tablet:border-l-[3px] border-[#DEE6F7] tablet:w-[100px] laptop:w-[134px]">
              {questionStatus.name}
            </div>
            <Tooltip optionStatus={questionStatus} />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-[7px] tablet:mt-5 tablet:gap-5">
          <AgreeDisagreeOptions
            answer={'Like'}
            options={false}
            handleOptionChange={() => handleOptionChange('Like')}
            isSelected={selectedOption === 'Like'}
          />
          <AgreeDisagreeOptions
            answer={'Dislike'}
            options={false}
            handleOptionChange={() => handleOptionChange('Dislike')}
            isSelected={selectedOption === 'Dislike'}
          />
        </div>
        <p className="my-1  tablet:mt-5 tablet:mb-[10px] text-center text-[8px] font-normal leading-normal text-[#85898C] dark:text-[#D8D8D8] tablet:text-[16px]">
          &#x200B;
        </p>
        {/* <div className="mx-[22px] flex flex-col gap-[5.2px] rounded-[0.30925rem] border border-[#DEE6F7] bg-[#FCFCFC] py-[10px] dark:bg-[#212224] tablet:mx-[60px] tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[25px]">
          <h5 className="text-center text-[10px] font-medium leading-normal text-[#435059] dark:text-[#737B82] tablet:text-[19.35px] laptop:text-[25px]">
            Settings
          </h5>
          <ChangeChoiceOption
            changedOption={changedOption}
            changeState={changeState}
            setChangeState={setChangeState}
            setChangedOption={setChangedOption}
          />
        </div> */}
        <div className="flex w-full justify-end">
          {hollow ? (
            <div className="pt-[10px] tablet:pt-[30px] pr-7 tablet:pr-[70px] ">
              <Button
                variant="hollow-submit"
                id="submitButton"
                onClick={() => handleSubmit()}
                disabled={loading === true}
              >
                Submit
              </Button>
            </div>
          ) : (
            <div className="pt-[10px] tablet:pt-[30px] pr-7 tablet:pr-[70px] ">
              <Button id="submitButton2" variant="submit" onClick={() => handleSubmit()}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
                <span className="text-[7px] tablet:text-[13px] font-semibold leading-[8.4px] tablet:leading-[15.7px] pl-[5px] tablet:pl-[10px]">
                  (-0.5 FDX)
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LikeDislike;
