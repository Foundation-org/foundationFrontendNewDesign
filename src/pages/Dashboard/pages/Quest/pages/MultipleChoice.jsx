import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import Options from '../components/Options';
import {
  checkUniqueQuestion,
  createInfoQuest,
  getTopicOfValidatedQuestion,
} from '../../../../../services/api/questsApi';
import CustomSwitch from '../../../../../components/CustomSwitch';
import { Tooltip } from '../../../../../utils/Tooltip';
import ChangeChoiceOption from '../components/ChangeChoiceOption';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../../../components/ui/Button';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import { updateMultipleChoice } from '../../../../../features/createQuest/createQuestSlice';

const MultipleChoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const optionsValue = useSelector(createQuestAction.optionsValue);

  const [question, setQuestion] = useState(createQuestSlice.question);
  const [prevValue, setPrevValue] = useState('');
  const [multipleOption, setMultipleOption] = useState(createQuestSlice.multipleOption);
  const [addOption, setAddOption] = useState(createQuestSlice.addOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [selectedValues, setSelectedValues] = useState([]);
  const [optionsCount, setOptionsCount] = useState(createQuestSlice.optionsCount);
  const [prevValueArr, setPrevValueArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);
  const [optionWaiting, setOptionWaiting] = useState(false);

  const [typedValues, setTypedValues] = useState(optionsValue);

  // Array.from({ length: optionsCount }, (_, index) => ({
  //   id: `index-${index}`,
  //   question: createQuestSlice.options[index],
  //   selected: false,
  //   optionStatus: optionStatus[index],
  // })),

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
        setQuestion('');
        setMultipleOption(false);
        setAddOption(false);
        setChangedOption('');
        setChangeState(false);
        toast.success('Successfully Created');
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
        }, 2000);
      }

      queryClient.invalidateQueries('FeedData');
    },

    onError: (err) => {
      if (err.response) {
        toast.error(err.response.data.message.split(':')[1]);
      }
      setQuestion('');
      setMultipleOption(false);
      setAddOption(false);
      setChangedOption('');
      setChangeState(false);
      setLoading(false);
    },
  });

  const handleSubmit = async () => {
    const constraintResponse = await checkUniqueQuestion(question);

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
      whichTypeQuestion: 'multiple choise',
      QuestionCorrect: 'Not Selected',
      QuestAnswers: typedValues,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      userCanSelectMultiple: multipleOption,
      QuestAnswersSelected: [],
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
    };

    const isEmptyAnswer = params.QuestAnswers.some((answer) => answer.question.trim() === '');

    if (isEmptyAnswer) {
      setLoading(false);
      return toast.warning('Option cannot be empty');
    }
    if (!checkHollow()) {
      console.log('true');
      setLoading(true);
      createQuest(params);
      dispatch(createQuestAction.resetCreateQuest());
    }
  };

  const questionVerification = async (value) => {
    setQuestion(value.trim());
    if (prevValue === question.trim()) return;
    setPrevValue(value);

    dispatch(createQuestAction.checkQuestion(value));
  };

  const answerVerification = async (id, index, value) => {
    setOptionWaiting(true);
    const newTypedValue = [...typedValues];
    newTypedValue[index] = {
      ...newTypedValue[index],
      question: value.trim(),
    };
    setTypedValues(newTypedValue);
    // Check if Prev Value exist
    if (prevValueArr[index]?.value === value.trim()) return;
    setPrevValueArr((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { value: value.trim() };
      return [...updatedArray];
    });
    //
    dispatch(createQuestAction.checkAnswer({ id, value, index }));
    // Answer Validation
    // const { validatedAnswer, errorMessage } = await answerValidation({
    //   answer: value,
    // });
    // If any error captured
    // if (errorMessage) {
    //   const newTypedValues = [...typedValues];
    //   newTypedValues[index] = {
    //     ...newTypedValues[index],
    //     optionStatus: {
    //       name: 'Rejected',
    //       color: 'text-[#b00f0f]',
    //       tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
    //       tooltipStyle: 'tooltip-error',
    //     },
    //   };
    //   return setTypedValues(newTypedValues);
    // }

    // Check Answer is unique

    // Answer is validated and status is Ok
    // if (validatedAnswer) {
    //   setPrevValueArr((prev) => {
    //     const updatedArray = [...prev];
    //     updatedArray[index] = { value: validatedAnswer };
    //     return [...updatedArray];
    //   });
    //   const newTypedValues = [...typedValues];
    //   newTypedValues[index] = {
    //     ...newTypedValues[index],
    //     question: validatedAnswer,
    //     optionStatus: {
    //       name: 'Ok',
    //       color: 'text-[#0FB063]',
    //       tooltipName: 'Answer is Verified',
    //       tooltipStyle: 'tooltip-success',
    //       isVerifiedAnswer: true,
    //     },
    //   };
    //   setTypedValues(newTypedValues);
    // }
  };

  const handleAddOption = () => {
    if (optionWaiting) return;
    const optionsCount = typedValues.length;
    dispatch(createQuestAction.addNewOption({ optionsCount }));
    // setOptionsCount((prevCount) => prevCount + 1);
    // setTypedValues((prevValues) => [
    //   ...prevValues,
    //   {
    //     id: `index-${optionsCount}`,
    //     question: '',
    //     selected: false,
    //     optionStatus: {
    //       name: 'Ok',
    //       color: 'text-[#389CE3]',
    //       tooltipName: 'Please write something...',
    //       tooltipStyle: 'tooltip-info',
    //     },
    //   },
    // ]);
  };

  const handleChange = (index, value) => {
    if (optionWaiting) return;
    const newTypedValues = [...typedValues];
    newTypedValues[index] = {
      ...newTypedValues[index],
      question: value,
      optionStatus:
        value.trim() === ''
          ? {
              name: 'Ok',
              color: 'text-[#389CE3]',
              tooltipName: 'Please write something...',
              tooltipStyle: 'tooltip-info',
            }
          : { name: 'Ok', color: 'text-[#b0a00f]' },
    };
    dispatch(createQuestAction.handleChangeOption({ newTypedValues }));
    // setTypedValues(newTypedValues);
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

      const selectedOption = newTypedValues[index].selected ? [{ answers: newTypedValues[index].question }] : [];
      setSelectedValues(selectedOption);
    } else {
      const selectedOption = { answers: newTypedValues[index].question };

      if (newTypedValues[index].selected) {
        setSelectedValues((prevValues) => [...prevValues, selectedOption]);
      } else {
        setSelectedValues((prevValues) => prevValues.filter((item) => item.answers !== selectedOption.answers));
      }
    }
  };

  const removeOption = (id) => {
    dispatch(createQuestAction.delOption({ id }));
  };

  const handleOnDragEnd = (result) => {
    // console.log(result);
    if (!result.destination) {
      return;
    }

    const newTypedValues = [...typedValues];
    const [removed] = newTypedValues.splice(result.source.index, 1);
    newTypedValues.splice(result.destination.index, 0, removed);

    dispatch(createQuestAction.drapAddDrop({ newTypedValues }));
    // setTypedValues(newTypedValues);
  };

  const checkHollow = () => {
    const AllVerified = typedValues.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (checkQuestionStatus.tooltipName === 'Question is Verified' || AllVerified) {
      return false;
    } else {
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
      updateMultipleChoice({
        question,
        changedOption,
        changeState,
        optionsCount,
        addOption,
        options: tempOptions,
        multipleOption,
      }),
    );
  }, [question, changedOption, changeState, addOption, optionsCount, typedValues, multipleOption]);

  const handleTab = (index) => {
    // if (index < inputs?.length - 1) {
    document.getElementById(`input-${index + 1}`).focus();
    // } else {
    //   document.getElementById(`input-0`).focus();
    // }
  };

  useEffect(() => {
    if (createQuestSlice.question) {
      setQuestion(createQuestSlice.question);
      setPrevValue(createQuestSlice.question);
    }
  }, [questionStatus]);

  useEffect(() => {
    console.log('our values are', optionsValue);
    setTypedValues(optionsValue);
    const tempcheck = optionsValue.some((value) => value.optionStatus.name === 'Checking');
    setOptionWaiting(tempcheck);
  }, [optionsValue]);

  return (
    <>
      <h4 className="mt-[10.5px] text-center text-[8px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25px] tablet:text-[16px]">
        Ask a question that allows for diverse responses and multiple answer options
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
          <input
            id="input-0"
            className="w-full rounded-l-[5.128px] border-y border-l border-[#DEE6F7] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-[#435059] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[2.31rem] tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
            onChange={(e) => {
              setQuestion(e.target.value);
              // setCheckQuestionStatus({
              //   name: 'Ok',
              //   color: e.target.value.trim() === '' ? 'text-[#389CE3]' : 'text-[#b0a00f]',
              // });
              dispatch(createQuestAction.handleQuestionReset(e.target.value));
            }}
            onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value.trim())}
            value={question}
            placeholder="Make a Statement or pose a question"
            tabIndex={1}
            onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0))}
          />
          <button
            id="new"
            className={`relative leading-none rounded-r-[5.128px] border-y border-r border-[#DEE6F7] bg-white text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:text-[1.25rem] laptop:rounded-r-[0.625rem] ${questionStatus.color}`}
          >
            <div className="flex w-[50px] items-center justify-center border-l-[0.7px] tablet:border-l-[3px] border-[#DEE6F7] tablet:w-[100px] laptop:w-[134px]">
              {questionStatus.name}
            </div>
            <Tooltip optionStatus={questionStatus} />
          </button>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId={`typedValues-${Date.now()}`}>
            {(provided) => (
              <div
                className="mt-2 flex flex-col gap-[7px] tablet:mt-5 tablet:gap-5"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {typedValues.map((item, index) => (
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
                          title="MultipleChoice"
                          allowInput={true}
                          label={`Option ${index + 1} #`}
                          trash={true}
                          options={false}
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
              Participants can select multiple options.
            </h5>
            <CustomSwitch enabled={multipleOption} setEnabled={setMultipleOption} />
          </div>
          <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-[#DEE6F7] px-[8.62px] pb-[10.25px] pt-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
            <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Participants can add their own options.
            </h5>
            <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
          </div>
          <ChangeChoiceOption
            changedOption={changedOption}
            changeState={changeState}
            setChangeState={setChangeState}
            setChangedOption={setChangedOption}
          />
        </div>
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
            <Button variant="hollow-submit" onClick={() => handleSubmit()} disabled={loading === true}>
              Submit
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-end">
            <button
              className="mr-7 mt-[10px] tablet:mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white dark:bg-[#333B46] dark:from-[#333B46] dark:to-[#333B46] tablet:mr-[70px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] tablet:leading-none laptop:rounded-[12px] laptop:px-[60px] laptop:py-3 laptop:text-[25px]"
              onClick={() => handleSubmit()}
              // disabled={loading === true}
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MultipleChoice;
