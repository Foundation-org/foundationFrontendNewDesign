import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  checkUniqueQuestion,
  createInfoQuest,
  getTopicOfValidatedQuestion,
} from '../../../../../services/api/questsApi';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
import Options from '../components/Options';
import CustomSwitch from '../../../../../components/CustomSwitch';
import ChangeChoiceOption from '../components/ChangeChoiceOption';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../../../components/ui/Button';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import { updateRankedChoice } from '../../../../../features/createQuest/createQuestSlice';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const RankChoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const optionsValue = useSelector(createQuestAction.optionsValue);
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState(createQuestSlice.question);
  const [prevValue, setPrevValue] = useState('');
  const [addOption, setAddOption] = useState(createQuestSlice.addOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [optionsCount, setOptionsCount] = useState(createQuestSlice.optionsCount);
  const [prevValueArr, setPrevValueArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);
  const [optionWaiting, setOptionWaiting] = useState(false);

  const [typedValues, setTypedValues] = useState(optionsValue);
  const reset = {
    name: 'Ok',
    color: 'text-[#389CE3]',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
  };
  const [checkQuestionStatus, setCheckQuestionStatus] = useState(reset);

  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        setTimeout(() => {
          navigate('/dashboard');
          toast.success('Successfully Created');
          setLoading(false);
          setQuestion('');
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
      setQuestion('');
      setAddOption(false);
      setChangedOption('');
      setChangeState(false);
      setLoading(false);
    },
  });

  const handleSubmit = async () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning('Please create an account to unlock this feature');
      return;
    }

    // To check uniqueness of the question
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
      whichTypeQuestion: 'ranked choise',
      QuestionCorrect: 'No option',
      QuestAnswers: typedValues,
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

  const questionVerification = async (value) => {
    setQuestion(value.trim());
    if (prevValue === question.trim()) return;
    setPrevValue(value);

    dispatch(createQuestAction.checkQuestion(value));
  };

  const answerVerification = async (id, index, value) => {
    const newTypedValue = [...typedValues];
    newTypedValue[index] = {
      ...newTypedValue[index],
      question: value.trim(),
    };
    setTypedValues(newTypedValue);
    if (prevValueArr[index]?.value === value.trim()) return;
    setPrevValueArr((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { value: value.trim() };
      return [...updatedArray];
    });

    dispatch(createQuestAction.checkAnswer({ id, value, index }));
  };

  const handleAddOption = () => {
    // if (optionWaiting) return;
    const optionsCount = typedValues.length;
    dispatch(createQuestAction.addNewOption({ optionsCount }));
  };

  const handleChange = (index, value) => {
    // if (optionWaiting) return;

    setTypedValues((prevValues) => {
      const newTypedValues = [...prevValues];
      newTypedValues[index] = {
        ...newTypedValues[index],
        question: value,
        optionStatus: {
          name: 'Ok',
          color: value.trim() === '' ? 'text-[#389CE3]' : 'text-[#b0a00f]',
          tooltipName: value.trim() === '' ? 'Please write something...' : '',
          tooltipStyle: value.trim() === '' ? 'tooltip-info' : '',
        },
      };
      dispatch(createQuestAction.handleChangeOption({ newTypedValues }));
      return newTypedValues;
    });

    // const newTypedValues = [...typedValues];
    // newTypedValues[index] = {
    //   ...newTypedValues[index],
    //   question: value,
    //   optionStatus:
    //     value.trim() === ''
    //       ? {
    //           name: 'Ok',
    //           color: 'text-[#389CE3]',
    //           tooltipName: 'Please write something...',
    //           tooltipStyle: 'tooltip-info',
    //         }
    //       : { name: 'Ok', color: 'text-[#b0a00f]' },
    // };
    // dispatch(createQuestAction.handleChangeOption({ newTypedValues }));
  };

  const handleOptionSelect = (index) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index].selected = !newTypedValues[index].selected;
    setTypedValues(newTypedValues);

    if (!multipleOption) {
      newTypedValues.forEach((item, i) => {
        if (i !== index) {
          item.selected = false;
        }
      });
      setTypedValues(newTypedValues);

      const ChangedOption = newTypedValues[index].selected ? [{ answers: newTypedValues[index].question }] : [];
      setSelectedValues(ChangedOption);
    } else {
      const ChangedOption = { answers: newTypedValues[index].question };

      if (newTypedValues[index].selected) {
        setSelectedValues((prevValues) => [...prevValues, ChangedOption]);
      } else {
        setSelectedValues((prevValues) => prevValues.filter((item) => item.answers !== ChangedOption.answers));
      }
    }
  };

  const removeOption = (id) => {
    dispatch(createQuestAction.delOption({ id }));
  };

  // const handleOnSortEnd = (sortedItems) => {
  //   setTypedValues(sortedItems.items);
  // };

  const handleOnDragEnd = (result) => {
    console.log(result);
    if (!result.destination) {
      return;
    }

    const newTypedValues = [...typedValues];
    const [removed] = newTypedValues.splice(result.source.index, 1);
    newTypedValues.splice(result.destination.index, 0, removed);

    dispatch(createQuestAction.drapAddDrop({ newTypedValues }));
  };

  const checkHollow = () => {
    const AllVerified = typedValues.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (questionStatus.tooltipName === 'Question is Verified' && AllVerified) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  useEffect(() => {
    if (!checkHollow() && typedValues.every((value) => value.question !== '' && question !== '')) {
      setHollow(false);
    } else {
      setHollow(true);
    }
  }, [typedValues, question, checkQuestionStatus.tooltipName]);

  useEffect(() => {
    let tempOptions = typedValues.map((item) => {
      return item.question;
    });
    dispatch(
      updateRankedChoice({
        question,
        changedOption,
        changeState,
        optionsCount,
        addOption,
        options: tempOptions,
      }),
    );
  }, [question, changedOption, changeState, addOption, optionsCount, typedValues]);

  const handleTab = (index, key) => {
    if (index === typedValues.length) {
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

  useEffect(() => {
    if (createQuestSlice.question) {
      setQuestion(createQuestSlice.question);
      setPrevValue(createQuestSlice.question);
    }
  }, [questionStatus]);

  // useEffect(() => {
  //   let debounceTimer;

  //   const updateTypedValuesWithDelay = (value) => {
  //     if (debounceTimer) {
  //       clearTimeout(debounceTimer);
  //     }

  //     debounceTimer = setTimeout(() => {
  //       setTypedValues(value);
  //     }, 100);
  //   };

  //   updateTypedValuesWithDelay(optionsValue);

  //   // Cleanup
  //   return () => {
  //     clearTimeout(debounceTimer);
  //   };
  // }, [optionsValue, setTypedValues]);

  useEffect(() => {
    const updateTypedValuesWithDelay = (value) => {
      setTypedValues(value);
    };

    updateTypedValuesWithDelay(optionsValue);

    return () => {
      setTypedValues((prev) => prev);
    };
  }, [optionsValue, setTypedValues]);

  return (
    <>
      <h4 className="mt-[10.5px] text-center text-[8px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25px] tablet:text-[16px]">
        Create a selection of choices that can be arranged in order of preference.
      </h4>
      <div
        className={`${
          persistedTheme === 'dark' ? 'border-[1px] border-[#858585] tablet:border-[2px]' : ''
        } mx-auto my-[10px] max-w-[85%] rounded-[8.006px] bg-white py-[8.75px] dark:bg-[#141618] tablet:my-[15px] tablet:rounded-[26px] tablet:py-[27px] laptop:max-w-[1084px] laptop:pb-[30px] laptop:pt-[25px]`}
      >
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#D8D8D8] tablet:text-[22.81px] laptop:text-[25px]">
          Create a Poll
        </h1>
        <div className="w-[calc(100%-51.75px] mx-[22px] mt-1 flex tablet:mx-[60px] tablet:mt-5 tablet:pb-[13px]">
          {/* <input
            id="input-0"
            type="text"
            tabIndex={1}
            value={question}
            placeholder="Make a Statement or pose a question"
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            onChange={(e) => {
              setQuestion(e.target.value);
              setCheckQuestionStatus({
                name: 'Ok',
                color: e.target.value.trim() === '' ? 'text-[#389CE3]' : 'text-[#b0a00f]',
              });
              dispatch(createQuestAction.handleQuestionReset(e.target.value));
            }}
            className="w-full rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-[#435059] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
          /> */}
          <TextareaAutosize
            id="input-0"
            onChange={(e) => {
              setQuestion(e.target.value);
              dispatch(createQuestAction.handleQuestionReset(e.target.value));
            }}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={question}
            placeholder="Make a Statement or pose a question"
            tabIndex={1}
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
            className="w-full resize-none rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] pt-[7px] pb-2 text-[0.625rem] font-medium leading-[13px] tablet:leading-[23px] text-[#7C7C7C] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
          />
          <button
            id="new"
            data-tooltip-offset={-25}
            className={`relative leading-none rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:text-[1.25rem] laptop:rounded-r-[0.625rem] ${questionStatus.color}`}
          >
            <div className="flex w-[50px] h-[75%] items-center justify-center border-l-[0.7px] tablet:border-l-[3px] border-[#DEE6F7] tablet:w-[100px] laptop:w-[134px]">
              {questionStatus.name}
            </div>
            <Tooltip optionStatus={questionStatus} />
          </button>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId={`typedValues-${Date.now()}`}>
            {(provided) => (
              <ul
                className="mt-2 flex flex-col gap-[7px] tablet:mt-5 tablet:gap-5"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {typedValues.map((item, index) => (
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
                          allowInput={true}
                          label={`Option ${index + 1} #`}
                          trash={true}
                          dragable={true}
                          handleChange={(value) => handleChange(index, value)}
                          handleOptionSelect={() => handleOptionSelect(index)}
                          typedValue={item.question}
                          isSelected={item.selected}
                          optionsCount={typedValues.length}
                          removeOption={() => removeOption(item.id)}
                          number={index + 1}
                          optionStatus={typedValues[index].optionStatus}
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
          onClick={handleAddOption}
        >
          + Add Option
        </Button>
        {/* settings */}
        <p className="my-1 text-center tablet:mb-[10px] tablet:mt-5 text-[8px] font-normal leading-normal text-[#85898C] dark:text-[#D8D8D8] tablet:text-[16px]">
          &#x200B;
        </p>
        <div className="mx-[22px] flex flex-col gap-[5.2px] rounded-[0.30925rem] border border-[#DEE6F7] bg-[#FCFCFC] py-[10px] dark:bg-[#212224] tablet:mx-[60px] tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[25px]">
          <h5 className="text-center text-[10px] font-medium leading-normal text-[#435059] dark:text-[#737B82] tablet:text-[19.35px] laptop:text-[25px]">
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
            <div className="flex w-full justify-end pt-[10px] tablet:pt-[30px] pr-7 tablet:pr-[70px] ">
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
                className="mr-7 mt-[10px] tablet:mt-[30px] tablet:mr-[70px]"
              >
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
                <span className="text-[7px] tablet:text-[13px] font-semibold leading-[1px] pl-[5px] tablet:pl-[10px]">
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
      </div>
    </>
  );
};

export default RankChoice;
