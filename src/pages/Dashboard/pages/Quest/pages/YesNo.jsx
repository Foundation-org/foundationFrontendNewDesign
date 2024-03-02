import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion } from '../../../../../features/createQuest/createQuestSlice';

import YesNoOptions from '../components/YesNoOptions';
import CreateQuestWrapper from '../components/CreateQuestWrapper';

import * as questServices from '../../../../../services/api/questsApi';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';

const YesNo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const [question, setQuestion] = useState(createQuestSlice.question);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: questServices.createInfoQuest,
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

  const handleTab = () => {
    const settingElement = document.getElementById('question');
    if (settingElement) {
      settingElement.blur();
    }
  };

  const handleSubmit = async () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="text-[#389CE3] underline cursor-pointer" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    }

    if (!checkHollow()) {
      setLoading(true);
    }
    if (question === '') {
      return toast.warning('Post cannot be empty');
    }

    const { questTopic, errorMessage } = await questServices.getTopicOfValidatedQuestion({
      validatedQuestion: question,
    });
    // If any error captured
    if (errorMessage) {
      return toast.error('Oops! Something Went Wrong.');
    }

    const params = {
      Question: question,
      whichTypeQuestion: 'yes/no',
      usersChangeTheirAns: changedOption,
      QuestionCorrect: 'Not Selected',
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
    };

    if (!checkHollow()) {
      createQuest(params);
    }
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

  return (
    <CreateQuestWrapper
      question={question}
      setQuestion={setQuestion}
      handleTab={handleTab}
      type={'Poll'}
      msg={'Ask a question that allows for a straightforward "Yes" or "No" response'}
    >
      <div className="mt-2 flex flex-col gap-[7px] tablet:mt-5 tablet:gap-5">
        <YesNoOptions answer={'Yes'} />
        <YesNoOptions answer={'No'} />
      </div>
      <p className="my-1 tablet:mt-5 tablet:mb-[10px] text-center text-[8px] font-normal leading-normal text-[#85898C] dark:text-[#D8D8D8] tablet:text-[16px]">
        &#x200B;
      </p>
      {/* <div className="mx-[22px] flex flex-col gap-[5.2px] rounded-[0.30925rem] border border-[#DEE6F7] bg-[#FCFCFC] py-[10px] dark:bg-[#212224] tablet:mx-[60px] tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[25px]">
          <h5
            id="setting"
            className="text-center text-[10px] font-medium leading-normal text-[#435059] dark:text-[#737B82] tablet:text-[19.35px] laptop:text-[25px]"
          >
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
              Create
            </Button>
          </div>
        ) : (
          <div className="pt-[10px] tablet:pt-[30px] pr-7 tablet:pr-[70px] ">
            <Button id="submitButton2" variant="submit" onClick={() => handleSubmit()}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}{' '}
              <span className="text-[7px] tablet:text-[13px] font-semibold leading-[0px] pl-[5px] tablet:pl-[10px]">
                (-0.1 FDX)
              </span>
            </Button>
          </div>
        )}
      </div>
    </CreateQuestWrapper>
  );
};

export default YesNo;
