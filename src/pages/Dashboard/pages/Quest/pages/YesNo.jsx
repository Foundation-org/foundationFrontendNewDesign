import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion } from '../../../../../features/createQuest/createQuestSlice';
import * as filtersActions from '../../../../../features/sidebar/filtersSlice';

import YesNoOptions from '../components/YesNoOptions';
import CreateQuestWrapper from '../components/CreateQuestWrapper';

import * as questServices from '../../../../../services/api/questsApi';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import showToast from '../../../../../components/ui/Toast';
import {
  addAdultFilterPopup,
  addPlayerId,
  resetPlayingIds,
  setIsShowPlayer,
  setPlayingPlayerId,
} from '../../../../../features/quest/utilsSlice';

const YesNo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const filterStates = useSelector(filtersActions.getFilters);

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
        // setTimeout(() => {
        if (filterStates?.moderationRatingFilter?.initial === 0 && filterStates?.moderationRatingFilter?.final === 0) {
          dispatch(addAdultFilterPopup({ rating: resp.data.moderationRatingCount }));
        }
        navigate('/');

        setChangedOption('');
        setChangeState(false);
        dispatch(createQuestAction.resetCreateQuest());
        dispatch(pictureMediaAction.resetToInitialState());
        dispatch(addPlayerId(resp.data.questID));
        // }, 500);
      }
      setLoading(false);
      queryClient.invalidateQueries(['userInfo', 'FeedData', 'treasury']);
    },
    onError: (err) => {
      if (err.response) {
        showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
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
    dispatch(setIsShowPlayer(false));
    dispatch(setPlayingPlayerId(''));
    dispatch(resetPlayingIds());
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
      return showToast('warning', 'emptyPost');
    }

    const { questTopic, errorMessage } = await questServices.getTopicOfValidatedQuestion({
      validatedQuestion: getMediaStates.desctiption ? getMediaStates.desctiption : createQuestSlice.question,
    });

    // If any error captured
    if (errorMessage) {
      return showToast('error', 'somethingWrong');
    }

    // ModerationRatingCount
    const moderationRating = await questServices.moderationRating({
      validatedQuestion: createQuestSlice.question,
    });

    // If found null
    if (!moderationRating) {
      return showToast('error', 'somethingWrong');
    }

    // if (!getMediaStates.desctiption && getMediaStates.url !== '') {
    //   return showToast('warning', 'emptyPostDescription');
    // }

    const params = {
      Question: createQuestSlice.question,
      whichTypeQuestion: 'yes/no',
      usersChangeTheirAns: changedOption,
      QuestionCorrect: 'Not Selected',
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
      moderationRatingCount: moderationRating.moderationRatingCount,
      url: getMediaStates?.isMedia.isMedia ? getMediaStates.url : getGifUrl.gifUrl ? getGifUrl.gifUrl : getPictureUrls,
      description: getMediaStates?.isMedia.isMedia && getMediaStates.desctiption,
      // description: getMediaStates?.isMedia.isMedia ? getMediaStates.desctiption : getPicsMediaStates.picDesctiption,
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
      // getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
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
        // getMediaStates.desctiption !== '' &&
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
    questionStatus,
    createQuestSlice.question,
    questionStatus.tooltipName,
    getMediaStates.isMedia,
    // getMediaStates.desctiption,
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
      handleTab={handleTab}
      type={'Post'}
      msg={'Participants can give a straightforward "Yes" or "No" response'}
    >
      <div className="flex flex-col gap-[5px] tablet:gap-[15px]">
        <YesNoOptions answer={'Yes'} />
        <YesNoOptions answer={'No'} />
      </div>
      <div className="flex w-full justify-end">
        {hollow ? (
          <div className="pr-[30px] pt-2 tablet:pr-[50px] tablet:pt-[25px]">
            <Button variant="hollow-submit" id="submitButton" disabled={true}>
              Create
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                (+{persistedContants?.QUEST_CREATED_AMOUNT} FDX)
              </span>
            </Button>
          </div>
        ) : (
          <div className="pr-[30px] pt-2 tablet:pr-[50px] tablet:pt-[25px]">
            <Button id="submitButton2" variant="submit" onClick={() => handleSubmit()} disabled={loading}>
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                (+{persistedContants?.QUEST_CREATED_AMOUNT} FDX)
              </span>
            </Button>
          </div>
        )}
      </div>
    </CreateQuestWrapper>
  );
};

export default YesNo;
