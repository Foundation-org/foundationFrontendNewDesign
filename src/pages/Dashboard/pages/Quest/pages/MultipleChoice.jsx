import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInfoQuest, getTopicOfValidatedQuestion } from '../../../../../services/api/questsApi';
// import ChangeChoiceOption from '../components/ChangeChoiceOption';
import CustomSwitch from '../../../../../components/CustomSwitch';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../../../components/ui/Button';
import { updateMultipleChoice } from '../../../../../features/createQuest/createQuestSlice';
import Options from '../components/Options';
import CreateQuestWrapper from '../components/CreateQuestWrapper';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import * as questServices from '../../../../../services/api/questsApi';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import showToast from '../../../../../components/ui/Toast';

const MultipleChoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicsMediaStates = useSelector(createQuestAction.getPicsMedia);
  const getPictureUrls = useSelector(pictureMediaAction.validatedPicUrls);
  const optionsValue = useSelector(createQuestAction.optionsValue);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);

  const [multipleOption, setMultipleOption] = useState(false);
  const [addOption, setAddOption] = useState(createQuestSlice.addOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        setTimeout(() => {
          navigate('/dashboard');
          queryClient.invalidateQueries(['userInfo']);
          // toast.success('Successfully Created');
          setLoading(false);

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
      }

      setMultipleOption(false);
      setAddOption(false);
      setChangedOption('');
      setChangeState(false);
      setLoading(false);
    },
  });

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
    const { questTopic, errorMessage } = await getTopicOfValidatedQuestion({
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
      whichTypeQuestion: 'multiple choise',
      QuestionCorrect: 'Not Selected',
      QuestAnswers: optionsValue,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      userCanSelectMultiple: multipleOption,
      QuestAnswersSelected: [],
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
      moderationRatingCount: moderationRating.moderationRatingCount,
      url: getMediaStates?.isMedia.isMedia ? getMediaStates.url : getPictureUrls,
      description: getMediaStates?.isMedia.isMedia && getMediaStates.desctiption,
    };

    const isEmptyAnswer = params.QuestAnswers.some((answer) => answer.question.trim() === '');

    if (isEmptyAnswer) {
      setLoading(false);
      return showToast('warning', 'emptyOption')
    }
    if (!checkHollow()) {
      createQuest(params);
    }
  };

  const handleChange = (index, value) => {
    if (value.length <= 200) {
      dispatch(createQuestAction.addOptionById({ id: index, option: value }));
    }
  };

  const answerVerification = async (id, index, value, extra) => {
    if (extra) {
      if (extra === value) return;
    }

    if (optionsValue[index].chatgptQuestion === value) return;

    dispatch(createQuestAction.checkAnswer({ id, value, index }));
  };

  const addNewOption = () => {
    dispatch(createQuestAction.addNewOption());
  };

  const removeOption = (id, number) => {
    dispatch(createQuestAction.delOption({ id }));

    if (optionsValue.length - 1 === parseInt(id.split('-')[1])) return;

    answerVerification(
      `index-${optionsValue.length - 2}`,
      optionsValue.length - 2,
      optionsValue[optionsValue.length - 1].question,
    );
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (optionsValue[parseInt(result.draggableId.split('-')[1])].question !== '') {
      answerVerification(
        `index-${result.destination.index}`,
        result.destination.index,
        optionsValue[parseInt(result.draggableId.split('-')[1])].question,
        optionsValue[parseInt(result.draggableId.split('-')[1])].chatgptQuestion,
      );
    }

    const newTypedValues = [...optionsValue];
    const [removed] = newTypedValues.splice(result.source.index, 1);
    newTypedValues.splice(result.destination.index, 0, removed);

    const updatedTypedValues = newTypedValues.map((item, index) => {
      return {
        ...item,
        id: `index-${index}`,
      };
    });

    dispatch(createQuestAction.drapAddDrop({ newTypedValues: updatedTypedValues }));
  };

  useEffect(() => {
    let tempOptions = optionsValue.map((item) => {
      return item.question;
    });
    dispatch(
      updateMultipleChoice({
        question: createQuestSlice.question,
        changedOption,
        changeState,
        optionsCount: optionsValue.length,
        addOption,
        options: tempOptions,
        multipleOption,
      }),
    );
  }, [
    createQuestSlice.question,
    changedOption,
    changeState,
    addOption,
    optionsValue.length,
    optionsValue,
    multipleOption,
  ]);

  const handleTab = (index, key) => {
    if (index === optionsValue.length + 2) {
      document.getElementById(`input-${index}`).blur();
    } else {
      if (key === 'Enter') {
        event.preventDefault();
        document.getElementById(`input-${index + 1}`).focus();
      } else {
        console.log(index, key);
        document.getElementById(`input-${index}`).focus();
      }
    }
  };

  const checkHollow = () => {
    const AllVerified = optionsValue.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (questionStatus.tooltipName === 'Question is Verified' && AllVerified) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkMediaHollow = () => {
    const AllVerified = optionsValue.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    console.log({ getMediaStates });
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
      getMediaStates.urlStatus.tooltipName === 'Question is Verified' &&
      AllVerified
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
        optionsValue.every(
          (value) =>
            value.question !== '' &&
            createQuestSlice.question !== '' &&
            getMediaStates.desctiption !== '' &&
            getMediaStates.url !== '',
        )
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
      if (!checkHollow() && optionsValue.every((value) => value.question !== '' && createQuestSlice.question !== '')) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    }
  }, [
    optionsValue,
    createQuestSlice.question,
    getMediaStates.isMedia,
    getMediaStates.desctiption,
    getMediaStates.url,
    getMediaStates.urlStatus,
    getPicsMediaStates.isPicMedia,
    getPicsMediaStates.picUrlStatus,
    getPicsMediaStates.picUrl,
  ]);

  return (
    <CreateQuestWrapper
      quest="M/R"
      handleTab={handleTab}
      type={'Post'}
      msg={'Ask a question where anyone can select a single option from a list of choices'}
    >
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={`optionsValue-${Date.now()}`}>
          {(provided) => (
            <div
              className="flex flex-col gap-[5px] tablet:gap-[15px]"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {optionsValue.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-full"
                    >
                      <Options
                        snapshot={snapshot}
                        key={index}
                        id={item.id}
                        title="MultipleChoice"
                        allowInput={true}
                        label={`Option ${index + 1} #`}
                        trash={true}
                        options={false}
                        dragable={true}
                        handleChange={(value) => handleChange(item.id, value, optionsValue)}
                        typedValue={item.question}
                        isTyping={item?.isTyping}
                        isSelected={item.selected}
                        optionsCount={optionsValue.length}
                        removeOption={removeOption}
                        number={index + 3}
                        optionStatus={optionsValue[index].optionStatus}
                        answerVerification={(value) => answerVerification(item.id, index, value)}
                        handleTab={handleTab}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant="addOption"
        className="ml-[30px] mt-2 tablet:ml-[50px] tablet:mt-[15px]"
        onClick={() => {
          if (optionsValue.length < 50) {
            addNewOption();
          } else {
            return showToast('warning', 'optionLimit')
          }
        }}
      >
        + Add Option
      </Button>
      {/* settings */}
      {/* <p className="my-1 text-center text-[8px] font-normal leading-normal text-[#85898C] tablet:mb-[10px] tablet:mt-5 tablet:text-[16px] dark:text-[#D8D8D8]">
        &#x200B;
      </p> */}
      <div className="mx-[30px] mt-2 flex flex-col gap-[5px] rounded-[0.30925rem] border border-[#DEE6F7] bg-[#FCFCFC] py-[10px] tablet:mx-[50px] tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[20px] dark:bg-[#212224]">
        <h5 className="text-center text-[10px] font-medium leading-normal text-[#435059] tablet:text-[19.35px] laptop:text-[25px] dark:text-[#737B82]">
          Settings
        </h5>
        {/* <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-[#DEE6F7] px-[8.62px] pb-[10.25px] pt-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
            <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Participants can select multiple options.
            </h5>
            <CustomSwitch enabled={multipleOption} setEnabled={setMultipleOption} />
          </div> */}
        <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-[#DEE6F7] px-[8.62px] py-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
          <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
            Participants can add their own options.
          </h5>
          <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
        </div>
        {/* <ChangeChoiceOption
            changedOption={changedOption}
            changeState={changeState}
            setChangeState={setChangeState}
            setChangedOption={setChangedOption}
          /> */}
      </div>
      {hollow ? (
        <div className="mt-[10px] flex w-full justify-end pr-7 tablet:mt-[25px] tablet:pr-[50px]">
          <Button variant="hollow-submit" id="submitButton" disabled={true}>
            Create
          </Button>
        </div>
      ) : (
        <div className="flex w-full justify-end">
          <Button
            id="submitButton2"
            variant="submit"
            onClick={() => handleSubmit()}
            className="mr-7 mt-[10px] tablet:mr-[50px] tablet:mt-[25px]"
            disabled={loading}
          >
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
            <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
              (-{persistedContants?.QUEST_CREATED_AMOUNT} FDX)
            </span>
          </Button>
        </div>
      )}
    </CreateQuestWrapper>
  );
};

export default MultipleChoice;
