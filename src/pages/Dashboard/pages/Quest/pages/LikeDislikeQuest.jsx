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
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import * as filtersActions from '../../../../../features/sidebar/filtersSlice';

import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import showToast from '../../../../../components/ui/Toast';
import { addAdultFilterPopup } from '../../../../../features/quest/utilsSlice';

const LikeDislike = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filterStates = useSelector(filtersActions.getFilters);

  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicsMediaStates = useSelector(createQuestAction.getPicsMedia);
  const getPictureUrls = useSelector(pictureMediaAction.validatedPicUrls);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);
  const persistedContants = useSelector(getConstantsValues);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: questServices.createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        setTimeout(() => {
          if (filterStates?.moderationRatingFilter?.initial === 0 &&
            filterStates?.moderationRatingFilter?.final === 0) {
            dispatch(addAdultFilterPopup({ rating: resp.data.moderationRatingCount }));
          }
          navigate('/dashboard');
          queryClient.invalidateQueries(['userInfo']);
          setLoading(false);
          setChangedOption('');
          setChangeState(false);
          dispatch(createQuestAction.resetCreateQuest());
          dispatch(pictureMediaAction.resetToInitialState());
        }, 500);
      }
      queryClient.invalidateQueries('FeedData');
      queryClient.invalidateQueries('treasury');
    },
    onError: (err) => {
      if (err.response) {
        showToast('error', 'error', {}, err.response.data.message.split(':')[1])
        setChangedOption('');
        setChangeState(false);
      }
      setLoading(false);
    },
  });

  const handleTab = (index, key) => {
    console.log(index, key);
    if (index === 2) {
      document.getElementById(`input-${index}`).blur();
    } else {
      if (key === 'Enter') {
        event.preventDefault();
        document.getElementById(`input-${index + 1}`).focus();
      } else {
        document.getElementById(`input-${index}`).focus();
      }
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
      return showToast('warning', 'emptyPost')
    }

    // getTopicOfValidatedQuestion
    const { questTopic, errorMessage } = await questServices.getTopicOfValidatedQuestion({
      validatedQuestion: getMediaStates.desctiption ? getMediaStates.desctiption : createQuestSlice.question,
    });
    // If any error captured
    if (errorMessage) {
      return showToast('error', 'somethingWrong')
    }
    // ModerationRatingCount
    const moderationRating = await questServices.moderationRating({
      validatedQuestion: createQuestSlice.question,
    });
    // If found null
    if (!moderationRating) {
      return showToast('error', 'somethingWrong')
    }
    if (!getMediaStates.desctiption && getMediaStates.url !== '') {
      return showToast('warning', 'emptyPostDescription')
    }

    const params = {
      Question: createQuestSlice.question,
      whichTypeQuestion: 'like/dislike',
      usersChangeTheirAns: changedOption,
      QuestionCorrect: 'Not Selected',
      uuid: persistedUserInfo.uuid,
      QuestTopic: questTopic,
      moderationRatingCount: moderationRating.moderationRatingCount,
      url: getMediaStates?.isMedia.isMedia ? getMediaStates.url : getPictureUrls,
      description: getMediaStates?.isMedia.isMedia && getMediaStates.desctiption,
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

  const checkMediaHollow = () => {
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
      getMediaStates.urlStatus.tooltipName === 'Question is Verified'
    ) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkPicMediaHollow = () => {
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      getPicsMediaStates.picUrlStatus.tooltipName === 'Question is Verified' &&
      getPicsMediaStates.picUrl !== ''
    ) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  useEffect(() => {
    if (getMediaStates.isMedia.isMedia) {
      if (
        !checkMediaHollow() &&
        createQuestSlice.question !== '' &&
        getMediaStates.desctiption !== '' &&
        getMediaStates.url !== ''
      ) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    } else if (getPicsMediaStates.isPicMedia) {
      if (!checkPicMediaHollow()) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    } else {
      if (!checkHollow() && createQuestSlice.question !== '') {
        setHollow(false);
      } else {
        setHollow(true);
      }
    }
  }, [
    createQuestSlice.question,
    questionStatus.tooltipName,
    getMediaStates.isMedia,
    getMediaStates.desctiption,
    getMediaStates.url,
    getMediaStates.urlStatus,
    getPicsMediaStates.isPicMedia,
    getPicsMediaStates.picUrlStatus,
    getPicsMediaStates.picUrl,
  ]);

  useEffect(() => {
    dispatch(updateQuestion({ question: createQuestSlice.question, changedOption, changeState }));
  }, [createQuestSlice.question, changedOption, changeState]);

  return (
    <CreateQuestWrapper
      quest="Statement"
      handleTab={handleTab}
      type={'Post'}
      msg={'Make a statement that anyone can "Like" or "Dislike"'}
    >
      <div className="flex flex-col gap-[5px] tablet:gap-[15px]">
        <YesNoOptions answer={'Like'} />
        <YesNoOptions answer={'Dislike'} />
      </div>
      {/* <p className="my-1  text-center text-[8px] font-normal leading-normal text-[#85898C] tablet:mb-[10px] tablet:mt-5 tablet:text-[16px] dark:text-[#D8D8D8]">
        &#x200B;
      </p> */}
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
          <div className="pr-[30px] pt-2 tablet:pr-[50px] tablet:pt-[25px]">
            <Button variant="hollow-submit" id="submitButton" disabled={true}>
              Create
            </Button>
          </div>
        ) : (
          <div className="pr-[30px] pt-2 tablet:pr-[50px] tablet:pt-[25px]">
            <Button id="submitButton2" variant="submit" onClick={() => handleSubmit()}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px]  tablet:pl-[10px] tablet:text-[13px]">
                (-{persistedContants?.QUEST_CREATED_AMOUNT} FDX)
              </span>
            </Button>
          </div>
        )}
      </div>
    </CreateQuestWrapper>
  );
};

export default LikeDislike;
