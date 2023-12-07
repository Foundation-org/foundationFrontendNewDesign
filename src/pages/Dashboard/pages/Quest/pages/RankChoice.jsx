import { useState } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeOptions } from "../../../../../utils/options";
import Options from "../components/Options";
import CustomSwitch from "../../../../../components/CustomSwitch";
import Title from "../components/Title";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useMutation } from "@tanstack/react-query";
import { answerValidation, checkAnswerExist, checkUniqueQuestion, createInfoQuest, questionValidation } from "../../../../../api/questsApi";
import { toast } from "sonner";
import { SortableItem, SortableList } from "@thaddeusjiang/react-sortable-list";
import { useSelector } from "react-redux";

const DragHandler = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  return (
    <div
      {...props}
      className="z-10 ml-14 flex h-[74px] w-[38px] items-center justify-center rounded-l-[10px] bg-[#DEE6F7] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]"
    >
      <div title="drag handler" className="flex items-center">
        {persistedTheme === "dark" ? (
          <img
            src="/assets/svgs/dashboard/six-dots-dark.svg"
            alt="six dots"
            className="h-7"
          />
        ) : (
          <img
            src="/assets/svgs/dashboard/six-dots.svg"
            alt="six dots"
            className="h-7"
          />
        )}
      </div>
    </div>
  );
};

const RankChoice = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [addOption, setAddOption] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [changedOption, setChangedOption] = useState("");
  const [optionsCount, setOptionsCount] = useState(2);
  const [typedValues, setTypedValues] = useState(() =>
    Array.from({ length: optionsCount }, (_, index) => ({
      id: `index-${index}`,
      question: "",
      selected: false,
      optionStatus: { name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info" }
    })),
  );
  const [checkQuestionStatus, setCheckQuestionStatus] = useState({ name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info" });
  const [checkOptionStatus, setCheckOptionStatus] = useState({ name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info" });


  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      console.log("resp", resp);
      toast.success("Successfully Created Quest");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const handleSubmit = async() => {
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question)
    if(!constraintResponse.data.isUnique) return toast.warning("This quest is not unique. A similar quest already exists.");


    const params = {
      Question: question,
      whichTypeQuestion: "ranked choise",
      QuestionCorrect: "No option",
      QuestAnswers: typedValues,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      uuid: localStorage.getItem("uId"),
    };

    console.log({ params });

    createQuest(params);
  };


  const questionVerification = async(value) => {
    setCheckQuestionStatus({name: "Checking", color: "text-[#0FB063]", tooltipName: "Verifying your question. Please wait...", tooltipStyle: "tooltip-success" })
    // Question Validation
    const { validatedQuestion, errorMessage } = await questionValidation({ question: value, queryType: 'rank choice' })
    // If any error captured
    if (errorMessage) { return setCheckQuestionStatus({name: "Fail", color: "text-[#b00f0f]", tooltipName: "Please review your text for proper grammar while keeping our code of conduct in mind.", tooltipStyle: "tooltip-error" })};
    // Question is validated and status is Ok
    setQuestion(validatedQuestion)
    setCheckQuestionStatus({name: "Ok", color: "text-[#0FB063]", tooltipName: "Question is Verified", tooltipStyle: "tooltip-success", isVerifiedQuestion: true})
  }

  const answerVerification = async(index, value) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index] = { ...newTypedValues[index], optionStatus: {name: "Checking", color: "text-[#0FB063]", tooltipName: "Verifying your answer. Please wait...", tooltipStyle: "tooltip-success" } };
    setTypedValues(newTypedValues);
    // Answer Validation
    const { validatedAnswer, errorMessage } = await answerValidation({ answer: value})
    // If any error captured
    if (errorMessage) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = { ...newTypedValues[index], optionStatus: {name: "Fail", color: "text-[#b00f0f]", tooltipName: "Please review your text for proper grammar while keeping our code of conduct in mind.", tooltipStyle: "tooltip-error" }};
      return setTypedValues(newTypedValues);
    }
    // Answer is validated and status is Ok
    if(validatedAnswer) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = { ...newTypedValues[index], question: validatedAnswer, optionStatus: {name: "Ok", color: "text-[#0FB063]", tooltipName: "Answer is Verified", tooltipStyle: "tooltip-success", isVerifiedAnswer: true} };
      setTypedValues(newTypedValues);
    }

    // Check Answer is unique
    let answerExist = checkAnswerExist({ answersArray: typedValues, answer: validatedAnswer, index })
    if (answerExist) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = { ...newTypedValues[index], question: "", optionStatus: {name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info"} };
      return setTypedValues(newTypedValues);
    }

  };

  const handleAddOption = () => {
    setOptionsCount((prevCount) => prevCount + 1);
    setTypedValues((prevValues) => [
      ...prevValues,
      { id: `index-${optionsCount}`, question: "", selected: false, optionStatus: {name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info"} },
    ]);
  };

  const handleChange = (index, value) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index] = { ...newTypedValues[index], question: value, optionStatus: value.trim() === "" ? {name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info"} : {name: "Ok", color: "text-[#b0a00f]"}};
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

  return (
    <div>
      <Title />
      <div className="mx-auto my-10 max-w-[979px] rounded-[26px] bg-[#F3F3F3] py-[42px]">
        <h1 className="text-center text-[32px] font-semibold leading-normal text-[#7C7C7C]">
          Create Quest
        </h1>
        <h3 className="mb-[22px] ml-[104px] mt-[38px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Make a statement or pose a question
        </h3>
        {/* write question */}
        <div className="relative flex w-full justify-center">
          <input
            value={question}
            type="text"
            className="w-full max-w-[857px] rounded-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-28 text-[30px] font-normal leading-[0px] text-[#435059]"
            onChange={(e) => { setQuestion(e.target.value); setCheckQuestionStatus(e.target.value.trim() === "" ? {name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info"} : {name: "Ok", color: "text-[#b0a00f]"})}}
            onBlur={(e) => e.target.value.trim() !== "" && questionVerification(e.target.value.trim())}
          />
          <div className={`tooltip absolute right-[72px] top-4 ${checkQuestionStatus?.tooltipStyle}`} data-tip={checkQuestionStatus?.tooltipName}>
            <h1 className={`leading-0 border-none cursor-pointer px-6 text-[30px] font-semibold ${checkQuestionStatus.color}`}>
              {checkQuestionStatus.name}
            </h1>
          </div>
        </div>
        {/* options */}
        <SortableList
          items={typedValues}
          setItems={setTypedValues}
          onSortEnd={handleOnSortEnd}
        >
          {({ items }) => (
            <div id="dragIcon" className="mt-10 mb-8 flex flex-col gap-[30px]">
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
                    answerVerification={(value) => answerVerification(index, value)}
                  />
                </SortableItem>
              ))}
            </div>
          )}
        </SortableList>
        <button
            className="ml-[50px] mt-5 w-fit rounded-[23.6px] bg-[#C9C9C9] px-6 py-3 text-[31px] font-semibold leading-normal text-[#7C7C7C]"
            onClick={handleAddOption}
        >
          Add Option
        </button>
        <h3 className="mb-[32px] ml-[104px] mt-[50px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Customize your Quest
        </h3>
        {/* settings */}
        <div className="mx-auto flex max-w-[838px] flex-col gap-7 rounded-[16px] bg-[#FCFCFC] py-[35px]">
          <h5 className="text-center text-[30px] font-medium leading-normal text-[#435059]">
            Settings
          </h5>
          <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              Participant can add their own options.
            </h5>
            <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
          </div>
          <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              Participants can change their choice at a later time.
            </h5>
            <CustomSwitch enabled={changeState} setEnabled={() => { setChangeState(prev => !prev); setChangedOption(""); }} />
          </div>
          {changeState ? (
            <div className="flex justify-center gap-4">
              {changeOptions?.map((item) => (
                <button
                  key={item.id}
                  className={`${changedOption === item.value
                      ? "bg-[#389CE3]"
                      : "bg-[#7C7C7C]"
                    } rounded-md px-4 py-2 text-[#F4F4F4]`}
                  onClick={() => {
                    setChangedOption(item.value);
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        {/* submit button */}
        <div className="flex w-full justify-end">
          <button disabled={checkQuestionStatus?.isVerifiedQuestion && typedValues.every(item => item.optionStatus.isVerifiedAnswer === true) ? false : true} className={`blue-submit-button ${!checkQuestionStatus?.isVerifiedQuestion || !typedValues.every(item => item.optionStatus.isVerifiedAnswer === true) && "cursor-not-allowed"}`} onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankChoice;
