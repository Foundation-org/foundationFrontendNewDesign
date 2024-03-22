import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { createInfoQuest, getTopicOfValidatedQuestion } from '../../../../../services/api/questsApi';
// import ChangeChoiceOption from '../components/ChangeChoiceOption';
import CustomSwitch from '../../../../../components/CustomSwitch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../../../components/ui/Button';
import { updateRankedChoice } from '../../../../../features/createQuest/createQuestSlice';
import Options from '../components/Options';
import CreateQuestWrapper from '../components/CreateQuestWrapper';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';

const RankChoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const optionsValue = useSelector(createQuestAction.optionsValue);
  const persistedUserInfo = useSelector((state) => state.auth.user);

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
          toast.success('Successfully Created');
          setLoading(false);
          setAddOption(false);
          setChangedOption('');
          setChangeState(false);
          dispatch(createQuestAction.resetCreateQuest());
        }, 500);
      }
      queryClient.invalidateQueries('FeedData');
    },
    onError: (err) => {
      console.log('Mutation Error', err);
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
      return toast.warning('Post cannot be empty');
    }

    // getTopicOfValidatedQuestion
    const { questTopic, errorMessage } = await getTopicOfValidatedQuestion({
      validatedQuestion: createQuestSlice.question,
    });
    // If any error captured
    if (errorMessage) {
      return toast.error('Oops! Something Went Wrong.');
    }

    const params = {
      Question: createQuestSlice.question,
      whichTypeQuestion: 'ranked choise',
      QuestionCorrect: 'No option',
      QuestAnswers: optionsValue,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
    };

    const isEmptyAnswer = params.QuestAnswers.some((answer) => answer.question.trim() === '');

    if (isEmptyAnswer) {
      return toast.warning('Option cannot be empty');
    }
    if (!checkHollow()) {
      createQuest(params);
    }
  };

  const handleChange = (index, value) => {
    if (value.length <= 200) {
      dispatch(createQuestAction.addOptionById({ id: `index-${index}`, option: value }));
    }
  };

  const answerVerification = async (id, index, value) => {
    if (optionsValue[index].chatgptQuestion === value) return;

    dispatch(createQuestAction.checkAnswer({ id, value, index }));
  };

  const addNewOption = () => {
    dispatch(createQuestAction.addNewOption());
  };

  const removeOption = (id, number) => {
    dispatch(createQuestAction.delOption({ id }));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTypedValues = [...optionsValue];
    const [removed] = newTypedValues.splice(result.source.index, 1);
    newTypedValues.splice(result.destination.index, 0, removed);

    dispatch(createQuestAction.drapAddDrop({ newTypedValues }));
  };

  useEffect(() => {
    let tempOptions = optionsValue.map((item) => {
      return item.question;
    });
    dispatch(
      updateRankedChoice({
        question: createQuestSlice.question,
        changedOption,
        changeState,
        optionsCount: optionsValue.length,
        addOption,
        options: tempOptions,
      }),
    );
  }, [createQuestSlice.question, changedOption, changeState, addOption, optionsValue.length, optionsValue]);

  const handleTab = (index, key) => {
    if (index === optionsValue.length) {
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

  const checkHollow = () => {
    const AllVerified = optionsValue.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (questionStatus.tooltipName === 'Question is Verified' && AllVerified) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  useEffect(() => {
    if (!checkHollow() && optionsValue.every((value) => value.question !== '' && question !== '')) {
      setHollow(false);
    } else {
      setHollow(true);
    }
  }, [optionsValue, createQuestSlice.question]);

  return (
    <CreateQuestWrapper
      handleTab={handleTab}
      type={'Poll'}
      msg={'Create a selection of choices that can be arranged in order of preference.'}
    >
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={`optionsValue-${Date.now()}`}>
          {(provided) => (
            <ul
              className="mt-2 flex flex-col gap-[7px] tablet:mt-5 tablet:gap-5"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {optionsValue.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-full"
                    >
                      <Options
                        snapshot={snapshot}
                        key={index}
                        title="RankChoice"
                        id={item.id}
                        allowInput={true}
                        label={`Option ${index + 1} #`}
                        trash={true}
                        dragable={true}
                        handleChange={(value) => handleChange(index, value, optionsValue)}
                        handleOptionSelect={() => handleOptionSelect(index)}
                        typedValue={item.question}
                        isTyping={item?.isTyping}
                        isSelected={item.selected}
                        optionsCount={optionsValue.length}
                        removeOption={removeOption}
                        number={index + 1}
                        optionStatus={optionsValue[index].optionStatus}
                        answerVerification={(value) => answerVerification(item.id, index, value)}
                        handleTab={handleTab}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant="addOption"
        className="ml-[21.55px] mt-[16px] tablet:ml-[60px] tablet:mt-[33px]"
        onClick={addNewOption}
      >
        + Add Option
      </Button>
      {/* settings */}
      <p className="my-1 text-center text-[8px] font-normal leading-normal text-[#85898C] tablet:mb-[10px] tablet:mt-5 tablet:text-[16px] dark:text-[#D8D8D8]">
        &#x200B;
      </p>
      <div className="mx-[22px] flex flex-col gap-[5.2px] rounded-[0.30925rem] border border-[#DEE6F7] bg-[#FCFCFC] py-[10px] tablet:mx-[60px] tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[25px] dark:bg-[#212224]">
        <h5 className="text-center text-[10px] font-medium leading-normal text-[#435059] tablet:text-[19.35px] laptop:text-[25px] dark:text-[#737B82]">
          Settings
        </h5>
        <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-[#DEE6F7] px-[8.62px] pb-[10.25px] pt-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
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
      <div className="flex w-full justify-end">
        {hollow ? (
          // <div className="flex w-full justify-end">
          //   <button
          //     className="mr-7 mt-[10px] tablet:mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white dark:bg-[#333B46] dark:from-[#333B46] dark:to-[#333B46] tablet:mr-[70px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] tablet:leading-none laptop:rounded-[12px] laptop:px-[60px] laptop:py-3 laptop:text-[25px]"
          //     onClick={() => handleSubmit()}
          //     disabled={loading === true }
          //   >
          //     {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : <span style={{ opacity: 0 }}>Submit</span>}

          //   </button>
          // </div>
          <div className="flex w-full justify-end pr-7 pt-[10px] tablet:pr-[70px] tablet:pt-[30px] ">
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
          <div className="flex w-full justify-end">
            <Button
              id="submitButton2"
              variant="submit"
              onClick={() => handleSubmit()}
              className="mr-7 mt-[10px] tablet:mr-[70px] tablet:mt-[30px]"
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                (-0.1 FDX)
              </span>
            </Button>
            {/* <button
                id="submitButton2"
                className="mr-7 mt-[10px] tablet:mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white dark:bg-[#333B46] dark:from-[#333B46] dark:to-[#333B46] tablet:mr-[70px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] tablet:leading-none laptop:rounded-[12px] laptop:px-[60px] laptop:py-3 laptop:text-[25px]"
                onClick={() => handleSubmit()}
                disabled={loading === true}
              >
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
              </button> */}
          </div>
        )}
      </div>
    </CreateQuestWrapper>
  );
};

export default RankChoice;
