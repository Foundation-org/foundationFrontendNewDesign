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
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  console.log(url);
  const { mutateAsync: createQuest } = useMutation({
    mutationFn: questServices.createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        setTimeout(() => {
          navigate('/dashboard');
          toast.success('Successfully Created');
          setLoading(false);
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
        setChangedOption('');
        setChangeState(false);
      }
      setLoading(false);
    },
  });

  const handleTab = () => {
    const settingElement = document.getElementById('input-0');
    if (settingElement) {
      settingElement.blur();
    }
  };

  const handleSubmit = async () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
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
    if (createQuestSlice.question === '') {
      return toast.warning('Post cannot be empty');
    }

    const { questTopic, errorMessage } = await questServices.getTopicOfValidatedQuestion({
      validatedQuestion: createQuestSlice.question,
    });
    // If any error captured
    if (errorMessage) {
      return toast.error('Oops! Something Went Wrong.');
    }
    // ModerationRatingCount
    const moderationRating = await questServices.moderationRating({
      validatedQuestion: createQuestSlice.question,
    });
    // If found null
    if (!moderationRating) {
      return toast.error('Oops! Something Went Wrong.');
    }
    if (!description && url !== '') {
      return toast.error('You cannot leave the description empty.');
    }

    const params = {
      Question: createQuestSlice.question,
      whichTypeQuestion: 'yes/no',
      usersChangeTheirAns: changedOption,
      QuestionCorrect: 'Not Selected',
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
      moderationRatingCount: moderationRating.moderationRatingCount,
      url: url,
      description: description,
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
    if (!checkHollow() && createQuestSlice.question !== '' && description !== '') {
      setHollow(false);
    } else {
      setHollow(true);
    }
  }, [createQuestSlice.question, questionStatus.tooltipName, description]);

  useEffect(() => {
    dispatch(updateQuestion({ question: createQuestSlice.question, changedOption, changeState }));
  }, [createQuestSlice.question, changedOption, changeState]);

  return (
    <CreateQuestWrapper
      handleTab={handleTab}
      type={'Poll'}
      msg={'Ask a question that allows for a straightforward "Yes" or "No" response'}
      url={url}
      setUrl={setUrl}
      setDescription={setDescription}
    >
      <div className="mt-2 flex flex-col gap-[7px] tablet:mt-5 tablet:gap-5">
        <YesNoOptions answer={'Yes'} />
        <YesNoOptions answer={'No'} />
      </div>
      <p className="my-1 text-center text-[8px] font-normal leading-normal text-[#85898C] tablet:mb-[10px] tablet:mt-5 tablet:text-[16px] dark:text-[#D8D8D8]">
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
          <div className="pr-7 pt-[10px] tablet:pr-[70px] tablet:pt-[30px] ">
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
          <div className="pr-7 pt-[10px] tablet:pr-[70px] tablet:pt-[30px] ">
            <Button id="submitButton2" variant="submit" onClick={() => handleSubmit()}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}{' '}
              <span className="pl-[5px] text-[7px] font-semibold leading-[0px] tablet:pl-[10px] tablet:text-[13px]">
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
