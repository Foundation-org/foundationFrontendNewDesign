import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  answerValidation,
  checkAnswerExist,
  checkUniqueQuestion,
  createInfoQuest,
  getTopicOfValidatedQuestion,
  questionValidation,
} from "../../../../../services/api/questsApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Tooltip } from "../../../../../utils/Tooltip";
import Options from "../components/Options";
import CustomSwitch from "../../../../../components/CustomSwitch";
import ChangeChoiceOption from "../components/ChangeChoiceOption";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaSpinner } from "react-icons/fa";

const RankChoice = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [addOption, setAddOption] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [changedOption, setChangedOption] = useState("");
  const [optionsCount, setOptionsCount] = useState(3);
  const [prevValueArr, setPrevValueArr] = useState([]);
  // const [dragItems, setDragItems] = useState(["item1", "item 2", "item3"]);
  const [loading, setLoading] = useState(false);
  const [optionWaiting, setOptionWaiting] = useState(false);

  const [typedValues, setTypedValues] = useState(() =>
    Array.from({ length: optionsCount }, (_, index) => ({
      id: `index-${index}`,
      question: "",
      selected: false,
      optionStatus: {
        name: "Ok",
        color: "text-[#389CE3]",
        tooltipName: "Please write something...",
        tooltipStyle: "tooltip-info",
      },
    })),
  );
  const reset = {
    name: "Ok",
    color: "text-[#389CE3]",
    tooltipName: "Please write something...",
    tooltipStyle: "tooltip-info",
  };
  const [checkQuestionStatus, setCheckQuestionStatus] = useState(reset);
  const [checkOptionStatus, setCheckOptionStatus] = useState({
    name: "Ok",
    color: "text-[#389CE3]",
    tooltipName: "Please write something...",
    tooltipStyle: "tooltip-info",
  });
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        toast.success("Successfully Created");
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 2000);
      }
    },
    onError: (err) => {
      console.log("Mutation Error", err);
      setLoading(false);
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question);

    if (question === "") {
      setLoading(false);
      return toast.warning("Post cannot be empty");
    }
    if (!constraintResponse.data.isUnique) {
      setLoading(false);

      return toast.warning(
        "This post is not unique. A similar post already exists.",
      );
    }

    // getTopicOfValidatedQuestion
    const { questTopic, errorMessage } = await getTopicOfValidatedQuestion({
      validatedQuestion: question,
    });
    // If any error captured
    if (errorMessage) {
      setLoading(false);
      return toast.error("Oops! Something Went Wrong.");
    }

    const params = {
      Question: question,
      whichTypeQuestion: "ranked choise",
      QuestionCorrect: "No option",
      QuestAnswers: typedValues,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
    };

    const isEmptyAnswer = params.QuestAnswers.some(
      (answer) => answer.question.trim() === "",
    );

    if (isEmptyAnswer) {
      setLoading(false);

      return toast.warning("Option cannot be empty");
    }
    createQuest(params);
  };

  const questionVerification = async (value) => {
    setQuestion(value.trim());
    if (prevValue === question.trim()) return;
    setPrevValue(value);
    setCheckQuestionStatus({
      name: "Checking",
      color: "text-[#0FB063]",
      tooltipName: "Verifying your question. Please wait...",
      tooltipStyle: "tooltip-success",
    });
    // Question Validation
    const { validatedQuestion, errorMessage } = await questionValidation({
      question: value,
      queryType: "rank choice",
    });
    // If any error captured
    if (errorMessage) {
      return setCheckQuestionStatus({
        name: "Rejected",
        color: "text-[#b00f0f]",
        tooltipName:
          "Please review your text for proper grammar while keeping our code of conduct in mind.",
        tooltipStyle: "tooltip-error",
      });
    }
    // Question is validated and status is Ok
    setQuestion(validatedQuestion);
    setPrevValue(validatedQuestion);
    setCheckQuestionStatus({
      name: "Ok",
      color: "text-[#0FB063]",
      tooltipName: "Question is Verified",
      tooltipStyle: "tooltip-success",
      isVerifiedQuestion: true,
    });
  };

  const answerVerification = async (index, value) => {
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
    const newTypedValues = [...typedValues];
    newTypedValues[index] = {
      ...newTypedValues[index],
      optionStatus: {
        name: "Checking",
        color: "text-[#0FB063]",
        tooltipName: "Verifying your answer. Please wait...",
        tooltipStyle: "tooltip-success",
      },
    };
    setTypedValues(newTypedValues);
    setOptionWaiting(true);
    // Answer Validation
    const { validatedAnswer, errorMessage } = await answerValidation({
      answer: value,
    });
    setOptionWaiting(false);
    // If any error captured
    if (errorMessage) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = {
        ...newTypedValues[index],
        optionStatus: {
          name: "Rejected",
          color: "text-[#b00f0f]",
          tooltipName:
            "Please review your text for proper grammar while keeping our code of conduct in mind.",
          tooltipStyle: "tooltip-error",
        },
      };
      return setTypedValues(newTypedValues);
    }
    // Check Answer is unique
    let answerExist = checkAnswerExist({
      answersArray: typedValues,
      answer: validatedAnswer,
      index,
    });
    if (answerExist) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = {
        ...newTypedValues[index],
        // question: "",
        optionStatus: {
          name: "Rejected",
          color: "text-[#b00f0f]",
          tooltipName: "Found Duplication!",
          tooltipStyle: "tooltip-error",
          duplication: true,
        },
      };
      return setTypedValues(newTypedValues);
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
      setPrevValueArr((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = { value: validatedAnswer };
        return [...updatedArray];
      });
      const newTypedValues = [...typedValues];
      newTypedValues[index] = {
        ...newTypedValues[index],
        question: validatedAnswer,
        optionStatus: {
          name: "Ok",
          color: "text-[#0FB063]",
          tooltipName: "Answer is Verified",
          tooltipStyle: "tooltip-success",
          isVerifiedAnswer: true,
        },
      };
      setTypedValues(newTypedValues);
    }
  };

  const handleAddOption = () => {
    if (optionWaiting) return;
    setOptionsCount((prevCount) => prevCount + 1);
    setTypedValues((prevValues) => [
      ...prevValues,
      {
        id: `index-${optionsCount}`,
        question: "",
        selected: false,
        optionStatus: {
          name: "Ok",
          color: "text-[#389CE3]",
          tooltipName: "Please write something...",
          tooltipStyle: "tooltip-info",
        },
      },
    ]);
  };

  const handleChange = (index, value) => {
    if (optionWaiting) return;
    const newTypedValues = [...typedValues];
    newTypedValues[index] = {
      ...newTypedValues[index],
      question: value,
      optionStatus:
        value.trim() === ""
          ? {
              name: "Ok",
              color: "text-[#389CE3]",
              tooltipName: "Please write something...",
              tooltipStyle: "tooltip-info",
            }
          : { name: "Ok", color: "text-[#b0a00f]" },
    };
    setTypedValues(newTypedValues);
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

      const ChangedOption = newTypedValues[index].selected
        ? [{ answers: newTypedValues[index].question }]
        : [];
      setSelectedValues(ChangedOption);
    } else {
      const ChangedOption = { answers: newTypedValues[index].question };

      if (newTypedValues[index].selected) {
        setSelectedValues((prevValues) => [...prevValues, ChangedOption]);
      } else {
        setSelectedValues((prevValues) =>
          prevValues.filter((item) => item.answers !== ChangedOption.answers),
        );
      }
    }
  };

  const removeOption = (indexToRemove) => {
    if (optionsCount > 2) {
      const newOptionsCount = Math.max(optionsCount - 1, 2);

      setTypedValues((prevTypedValues) =>
        prevTypedValues.filter((_, index) => index !== indexToRemove),
      );

      setOptionsCount(newOptionsCount);
    } else {
      console.warn("Cannot remove the last two options.");
    }
  };

  const handleOnSortEnd = (sortedItems) => {
    setTypedValues(sortedItems.items);
  };

  const handleOnDragEnd = (result) => {
    console.log(result);
    if (!result.destination) {
      return;
    }

    const newTypedValues = [...typedValues];
    const [removed] = newTypedValues.splice(result.source.index, 1);
    newTypedValues.splice(result.destination.index, 0, removed);

    setTypedValues(newTypedValues);
  };

  const checkError = () => {
    const hasTooltipError = typedValues.some(
      (value) => value.optionStatus.tooltipStyle === "tooltip-error",
    );

    if (
      checkQuestionStatus.tooltipStyle === "tooltip-error" ||
      hasTooltipError
    ) {
      return true;
    } else {
      return false;
    }
  };

  // const handleDragEnd = (result) => {
  //   console.log(result);
  //   if (!result.destination) {
  //     return;
  //   }

  //   const newTypedValues = [...typedValues];
  //   const [removed] = newTypedValues.splice(result.source.index, 1);
  //   newTypedValues.splice(result.destination.index, 0, removed);

  //   setTypedValues(newTypedValues);
  // };

  // const handleDragEnd = (result) => {
  //   console.log(result);
  //   if (!result.destination) {
  //     // Item was dragged outside the list
  //     return;
  //   }

  //   const newTypedValues = [...typedValues];
  //   const [removed] = newTypedValues.splice(result.source.index, 1);
  //   newTypedValues.splice(result.destination.index, 0, removed);

  //   // Update the state with the new order
  //   setTypedValues(newTypedValues);
  // };

  // const handleDragEnd = (result) => {
  //   if (!result.destination) {
  //     // Item was dropped outside the list
  //     return;
  //   }

  //   const newDragItems = [...dragItems];
  //   const [removed] = newDragItems.splice(result.source.index, 1);
  //   newDragItems.splice(result.destination.index, 0, removed);

  //   // Update the state with the new order
  //   setDragItems(newDragItems);
  // };

  return (
    <div>
      <h4 className="mt-[10.5px] text-center text-[9px] font-medium leading-normal text-[#ACACAC] dark:text-[#AAA] tablet:mt-[25.8px] tablet:text-[16.58px] laptop:mt-[47px] laptop:text-[25px]">
        Create a selection of choices that can be arranged in order of
        preference.
      </h4>
      <div
        className={`${
          persistedTheme === "dark"
            ? "border-[1px] border-[#858585] tablet:border-[2px]"
            : ""
        } mx-auto my-[14.63px] max-w-[85%] rounded-[8.006px] bg-[#F3F3F3] py-[12.93px] dark:bg-[#141618] tablet:my-10 tablet:rounded-[26px] tablet:py-[27px] laptop:max-w-[979px] laptop:py-[42px]`}
      >
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#D8D8D8] tablet:text-[22.81px] laptop:text-[32px]">
          Create Post
        </h1>
        <h3 className="mb-[13.54px] ml-[32px] mt-[11.71px] text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:ml-[67px] tablet:mt-[20.38px] tablet:text-[16.58px] laptop:mb-[22px] laptop:ml-[104px] laptop:mt-[38px] laptop:text-[25px]"></h3>
        <div className="w-[calc(100%-51.75px] mx-[21px] flex tablet:ml-[54px] tablet:mr-[70px]">
          <input
            className="w-full rounded-l-[0.33rem] border-y-[1px] border-l-[1px] border-[#ACACAC] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#D3D3D3] tablet:rounded-l-[10.3px] tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-2xl laptop:py-[18px] laptop:text-[1.875rem]"
            onChange={(e) => {
              setQuestion(e.target.value);
              setCheckQuestionStatus({
                name: "Ok",
                color:
                  e.target.value.trim() === ""
                    ? "text-[#389CE3]"
                    : "text-[#b0a00f]",
              });
            }}
            onBlur={(e) =>
              e.target.value.trim() !== "" &&
              questionVerification(e.target.value.trim())
            }
            value={question}
            placeholder="Make a statement or pose a question"
          />
          <button
            id="new"
            data-tooltip-offset={-25}
            className={`relative rounded-r-[0.33rem]  border-y-[1px] border-r-[1px] border-[#ACACAC] bg-white  text-[0.5rem] font-semibold dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:text-[17.54px] laptop:rounded-r-2xl laptop:text-[1.875rem] ${checkQuestionStatus.color} py-[0.29rem]`}
          >
            <div className="flex w-[50px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[166px]">
              {checkQuestionStatus.name}
            </div>
            <Tooltip optionStatus={checkQuestionStatus} />
          </button>
        </div>

        {/* test script */}
        {/* <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {dragItems.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext> */}

        {/* actual example */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId={`typedValues-${Date.now()}`}>
            {(provided) => (
              <ul
                className="mt-[1.46rem] flex flex-col items-center gap-[6.24px] tablet:mb-8 tablet:mt-14 tablet:gap-[14.7px] laptop:gap-[30px]"
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
                          optionsCount={optionsCount}
                          removeOption={() => removeOption(index)}
                          number={index}
                          optionStatus={typedValues[index].optionStatus}
                          answerVerification={(value) =>
                            answerVerification(index, value)
                          }
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

        {/* <SortableList
          items={typedValues}
          setItems={setTypedValues}
          onSortEnd={handleOnSortEnd}
        >
          {({ items }) => (
            <div
              id="dragIcon"
              className="mt-[1.46rem] flex flex-col gap-[9.24px] tablet:mb-8 tablet:mt-10 tablet:gap-5 laptop:gap-[30px]"
            >
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  DragHandler={DragHandler}
                >
                  <Options
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
                    optionsCount={optionsCount}
                    removeOption={() => removeOption(index)}
                    number={index}
                    optionStatus={typedValues[index].optionStatus}
                    answerVerification={(value) =>
                      answerVerification(index, value)
                    }
                  />
                </SortableItem>
              ))}
            </div>
          )}
        </SortableList> */}
        <button
          className="ml-[21.55px] mt-[16px] w-fit rounded-[7.287px] bg-[#C9C9C9] px-[7.29px] py-[3.89px] text-[10px] font-semibold leading-normal text-[#7C7C7C] dark:bg-[#595C60] dark:text-[#BCBCBC] tablet:ml-[50px] tablet:mt-5 tablet:rounded-[15.265px] tablet:px-[15.27px] tablet:py-[8.14px] tablet:text-[20.736px] laptop:rounded-[23.6px] laptop:px-6 laptop:py-3 laptop:text-[31px]"
          onClick={handleAddOption}
        >
          + Add Option
        </button>
        <h3 className="mb-1 ml-[32px] mt-4 text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:mb-[32px] tablet:ml-[104px] tablet:mt-[50px] tablet:text-[25px]">
          &#x200B;
        </h3>
        {/* settings */}
        <div className="mx-auto flex max-w-[85%] flex-col gap-[9.71px] rounded-[16px] bg-[#FCFCFC] py-[15px] dark:bg-[#212224] tablet:gap-7 tablet:py-[35px] laptop:max-w-[838px]">
          <h5 className="text-center text-[11px] font-medium leading-normal text-[#435059] dark:text-[#737B82] tablet:text-[19.35px] laptop:text-[30px]">
            Settings
          </h5>
          <div className="mx-5 flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] dark:bg-[#080A0C] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[51px] laptop:px-7 laptop:py-[34px]">
            <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[28px]">
              Participants can add their own options.
            </h5>
            <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
          </div>
          <ChangeChoiceOption
            changeState={changeState}
            setChangeState={setChangeState}
            setChangedOption={setChangedOption}
          />
        </div>
        <div className="flex w-full justify-end">
          <button
            className="mr-[28px] mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white dark:bg-[#333B46] dark:from-[#333B46] dark:to-[#333B46] tablet:mr-[70px] tablet:mt-[60px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] laptop:rounded-[23.6px] laptop:px-[60px] laptop:py-3 laptop:text-[31.5px]"
            onClick={() => handleSubmit()}
            disabled={loading === true || checkError() ? true : false}
          >
            {loading === true ? (
              <FaSpinner className="animate-spin text-[#EAEAEA]" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankChoice;
