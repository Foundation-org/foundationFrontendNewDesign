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
      optionStatus: { name: "Ok", color: "text-[#389CE3]" }
    })),
  );
  const [checkQuestionStatus, setCheckQuestionStatus] = useState({ name: "Ok", color: "text-[#389CE3]" });
  const [checkOptionStatus, setCheckOptionStatus] = useState({ name: "Ok", color: "text-[#389CE3]" });


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
    // Validation
    // Question
    if (question === "") return toast.warning("Write something Before Submitting");
    if (checkQuestionStatus.color === "text-[#b0a00f]") return toast.warning("Please wait!");
    if (checkQuestionStatus.name === "Fail") return toast.error("Please review your question!");
    // Answer
    if (typedValues.some(item => item.question === "")) return toast.warning("Option shouldn't be empty!");
    if (typedValues.some(item => item.optionStatus.color === "text-[#b0a00f]")) return toast.warning("Please wait!");
    if (typedValues.some(item => item.optionStatus.name === "Fail")) return toast.error("Please review your Option!");

    
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
    // Question Validation
    const { validatedQuestion, errorMessage } = await questionValidation({ question: value, queryType: 'yes/no' })
    // If any error captured
    if (errorMessage) { return setCheckQuestionStatus({name: "Fail", color: "text-[#b00f0f]"})};
    // Question is validated and status is Ok
    setQuestion(validatedQuestion)
    setCheckQuestionStatus({name: "Ok", color: "text-[#0FB063]"})
  }

  const answerVerification = async(index, value) => {

    // Answer Validation
    const { validatedAnswer, errorMessage } = await answerValidation({ answer: value, queryType: 'yes/no' })
    // If any error captured
    if (errorMessage) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = { ...newTypedValues[index], optionStatus: {name: "Fail", color: "text-[#b00f0f]"} };
      return setTypedValues(newTypedValues);
    }
    // Answer is validated and status is Ok
    const newTypedValues = [...typedValues];
    newTypedValues[index] = { ...newTypedValues[index], question: validatedAnswer, optionStatus: {name: "Ok", color: "text-[#0FB063]"} };
    setTypedValues(newTypedValues);

    // Check Answer is unique
    let answerExist = checkAnswerExist({ answersArray: typedValues, answer: validatedAnswer, index })
    if (answerExist) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = { ...newTypedValues[index], question: "", optionStatus: {name: "Ok", color: "text-[#0FB063]"} };
      return setTypedValues(newTypedValues);
    }

  };

  const handleAddOption = () => {
    setOptionsCount((prevCount) => prevCount + 1);
    setTypedValues((prevValues) => [
      ...prevValues,
      { question: "", selected: false, optionStatus: {name: "Ok", color: "text-[#389CE3]"} },
    ]);
  };

  const handleChange = (index, value) => {
    const newTypedValues = [...typedValues];
    newTypedValues[index] = { ...newTypedValues[index], question: value, optionStatus: {name: "Ok", color: value.trim() === "" ? "text-[#389CE3]" : "text-[#b0a00f]"} };
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
        <div className="relative flex w-full justify-center">
          <input
            value={question}
            type="text"
            className="w-full max-w-[857px] rounded-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-28 text-[30px] font-normal leading-[0px] text-[#435059]"
            onChange={(e) => { setQuestion(e.target.value); setCheckQuestionStatus({name: "Ok", color: e.target.value.trim() === "" ? "text-[# ]" : "text-[#b0a00f]"})}}
            onBlur={(e) => e.target.value.trim() !== "" && questionVerification(e.target.value.trim())}
          />
          <h1 className={`leading-0 absolute right-[72px] top-4 border-l-2 border-[#F3F3F3] px-6 text-[30px] font-semibold ${checkQuestionStatus.color}`}>
            {checkQuestionStatus.name}
          </h1>
        </div>
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
          <button
            className="mr-[70px] mt-[60px] w-fit rounded-[23.6px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[60px] py-3 text-[31.5px] font-semibold leading-normal text-white"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoice;
