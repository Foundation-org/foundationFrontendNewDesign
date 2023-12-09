import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeOptions } from "../../../../../utils/options";
import Options from "../components/Options";
import { useMutation } from "@tanstack/react-query";
import { answerValidation, checkAnswerExist, checkUniqueQuestion, createInfoQuest, questionValidation } from "../../../../../api/questsApi";
import CustomSwitch from "../../../../../components/CustomSwitch";
// import {
//   getQuests,
//   toggleCheck,
// } from "../../../../../features/quest/questsSlice";
import { toast } from "sonner";
import Title from "../components/Title";
import MultipleChoiceOptions from "../components/MultipleChoiceOptions";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

const MultipleChoice = () => {
  const navigate = useNavigate();
  // const persistedTheme = useSelector((state) => state.utils.theme);
  const [question, setQuestion] = useState("");
  const [correctOption, setCorrectOption] = useState(false);
  const [multipleOption, setMultipleOption] = useState(false);
  const [addOption, setAddOption] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [changedOption, setChangedOption] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [optionsCount, setOptionsCount] = useState(2);
  const [typedValues, setTypedValues] = useState(() =>
    Array.from({ length: optionsCount }, (_, index) => ({
      question: "",
      selected: false,
      optionStatus: { name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info" }
    })),
  );
  const reset = { name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info" };
  const [checkQuestionStatus, setCheckQuestionStatus] = useState(reset);
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
      // console.log('error', err);
      toast.error(err.response.data);
    },
  });

  const handleSubmit = async() => {
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question)
    if(!constraintResponse.data.isUnique) return toast.warning("This quest is not unique. A similar quest already exists.");

    const params = {
      Question: question,
      whichTypeQuestion: "multiple choise",
      QuestionCorrect: correctOption === true ? "Selected" : "Not Selected",
      QuestAnswers: typedValues,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      userCanSelectMultiple: multipleOption,
      QuestAnswersSelected: correctOption === true ? selectedValues : [],
      uuid: localStorage.getItem("uId"),
    };

    createQuest(params);
  };

  const questionVerification = async(value) => {
    setCheckQuestionStatus({name: "Checking", color: "text-[#0FB063]", tooltipName: "Verifying your question. Please wait...", tooltipStyle: "tooltip-success" })
    // Question Validation
    const { validatedQuestion, errorMessage } = await questionValidation({ question: value, queryType: 'multiple choice' })
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
      { question: "", selected: false, optionStatus: {name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info"} },
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

      const selectedOption = newTypedValues[index].selected
        ? [{ answers: newTypedValues[index].question }]
        : [];
      setSelectedValues(selectedOption);
    } else {
      const selectedOption = { answers: newTypedValues[index].question };

      if (newTypedValues[index].selected) {
        setSelectedValues((prevValues) => [...prevValues, selectedOption]);
      } else {
        setSelectedValues((prevValues) =>
          prevValues.filter((item) => item.answers !== selectedOption.answers),
        );
      }
    }
  };

  const removeOption = (indexToRemove) => {
    const newOptionsCount = Math.max(optionsCount - 1, 2);

    setTypedValues((prevTypedValues) =>
      prevTypedValues.filter((_, index) => index !== indexToRemove),
    );

    setOptionsCount(newOptionsCount);
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
        <div className="join w-full px-12">
          <input 
            className="input input-bordered input-lg w-full join-item bg-white text-black text-3xl h-[4.7rem]"
            onChange={(e) => { setQuestion(e.target.value); setCheckQuestionStatus({name: "Ok", color: e.target.value.trim() === "" ? "text-[#389CE3]" : "text-[#b0a00f]"})}}
            onBlur={(e) => e.target.value.trim() !== "" && questionVerification(e.target.value.trim())}
          />
          <button id="new" data-tooltip-offset={-25} className={`test btn-lg join-item bg-white text-3xl font-semibold h-[4.7rem] ${checkQuestionStatus.color}`}>{checkQuestionStatus.name}</button>
        </div>
        {/* Tooltip */}
        <Tooltip anchorSelect="#new" isOpen={checkQuestionStatus.name === "Fail" && true} border="1px solid red" style={{ backgroundColor: "#fbdfe4", color: "#222", border: "red", width: 'auto', marginRight: "3rem" }} place="top">
          {/* <span className="indicator-item cursor-pointer" onClick={() => setCheckQuestionStatus(reset)}>
            <button className="btn btn-xs btn-circle" onClick={() => setCheckQuestionStatus(reset)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </span>  */}
          {checkQuestionStatus.tooltipName}
        </Tooltip>
        {/* options */}
        <div className="mt-10 flex flex-col gap-[30px]">
          {[...Array(optionsCount)].map((_, index) => (
            <MultipleChoiceOptions
              key={index}
              title="MultipleChoice"
              allowInput={true}
              label={`Option ${index + 1} #`}
              options={correctOption ? true : false}
              trash={true}
              dragable={false}
              handleChange={(value) => handleChange(index, value)}
              handleOptionSelect={() => handleOptionSelect(index)}
              typedValue={typedValues[index].question}
              isSelected={typedValues[index].selected}
              optionsCount={optionsCount}
              removeOption={() => removeOption(index)}
              number={index}
              optionStatus={typedValues[index].optionStatus}
              answerVerification={(value) => answerVerification(index, value)}
            />
          ))}
          <button
            className="ml-[50px] mt-5.3 w-fit rounded-[23.6px] bg-[#C9C9C9] px-6 py-3 text-[31px] font-semibold leading-normal text-[#7C7C7C]"
            onClick={handleAddOption}
          >
            Add Option
          </button>
        </div>
        <h3 className="mb-[32px] ml-[104px] mt-[50px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Customize your Quest
        </h3>
        {/* settings */}
        <div className="mx-auto flex max-w-[838px] flex-col gap-7 rounded-[16px] bg-[#FCFCFC] py-[35px]">
          <h5 className="text-center text-[30px] font-medium leading-normal text-[#435059]">
            Settings
          </h5>
          {/* <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              This Quest has a Correct Option.
            </h5>
            <CustomSwitch
              enabled={correctOption}
              setEnabled={setCorrectOption}
            />
          </div> */}
          <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              Participants can select multiple options.
            </h5>
            <CustomSwitch
              enabled={multipleOption}
              setEnabled={setMultipleOption}
            />
          </div>
          {!correctOption && (
            <>
              <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
                <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
                  Participants can add options.
                </h5>
                <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
              </div>
              <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
                <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
                  Participants can change their choice at a later time.
                </h5>
                <CustomSwitch
                  enabled={changeState}
                  setEnabled={() => { setChangeState(prev => !prev); setChangedOption(""); }}
                />
              </div>
              {changeState ? (
                <div className="flex justify-center gap-4">
                  {changeOptions.map((item) => (
                    <button
                      key={item.id}
                      className={`${
                        changedOption === item.value
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
            </>
          )}
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

export default MultipleChoice;
