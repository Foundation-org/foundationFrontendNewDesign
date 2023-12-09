import { toast } from "sonner";
import { useState } from "react";
// import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { changeOptions } from "../../../../../utils/options";
// import Options from "../components/Options";
import {
  answerValidation,
  checkAnswerExist,
  checkUniqueQuestion,
  createInfoQuest,
  questionValidation,
} from "../../../../../api/questsApi";
import CustomSwitch from "../../../../../components/CustomSwitch";
import MultipleChoiceOptions from "../components/MultipleChoiceOptions";
// import "react-tooltip/dist/react-tooltip.css";
import Title from "../components/Title";
import { Tooltip } from "../../../../../utils/Tooltip";

const MultipleChoice = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
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
  // const [checkOptionStatus, setCheckOptionStatus] = useState({
  //   name: "Ok",
  //   color: "text-[#389CE3]",
  //   tooltipName: "Please write something...",
  //   tooltipStyle: "tooltip-info",
  // });

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

  const handleSubmit = async () => {
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question);
    if (!constraintResponse.data.isUnique)
      return toast.warning(
        "This quest is not unique. A similar quest already exists.",
      );

    const params = {
      Question: question,
      whichTypeQuestion: "multiple choise",
      QuestionCorrect: "Not Selected",
      QuestAnswers: typedValues,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      userCanSelectMultiple: multipleOption,
      QuestAnswersSelected: [],
      uuid: localStorage.getItem("uId"),
    };

    createQuest(params);
  };

  const questionVerification = async (value) => {
    setCheckQuestionStatus({
      name: "Checking",
      color: "text-[#0FB063]",
      tooltipName: "Verifying your question. Please wait...",
      tooltipStyle: "tooltip-success",
    });
    // Question Validation
    const { validatedQuestion, errorMessage } = await questionValidation({
      question: value,
      queryType: "multiple choice",
    });
    // If any error captured
    if (errorMessage) {
      return setCheckQuestionStatus({
        name: "Fail",
        color: "text-[#b00f0f]",
        tooltipName:
          "Please review your text for proper grammar while keeping our code of conduct in mind.",
        tooltipStyle: "tooltip-error",
      });
    }
    // Question is validated and status is Ok
    setQuestion(validatedQuestion);
    setCheckQuestionStatus({
      name: "Ok",
      color: "text-[#0FB063]",
      tooltipName: "Question is Verified",
      tooltipStyle: "tooltip-success",
      isVerifiedQuestion: true,
    });
  };

  const answerVerification = async (index, value) => {
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
    // Answer Validation
    const { validatedAnswer, errorMessage } = await answerValidation({
      answer: value,
    });
    // If any error captured
    if (errorMessage) {
      const newTypedValues = [...typedValues];
      newTypedValues[index] = {
        ...newTypedValues[index],
        optionStatus: {
          name: "Fail",
          color: "text-[#b00f0f]",
          tooltipName:
            "Please review your text for proper grammar while keeping our code of conduct in mind.",
          tooltipStyle: "tooltip-error",
        },
      };
      return setTypedValues(newTypedValues);
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
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
          name: "Fail",
          color: "text-[#b00f0f]",
          tooltipName: "Found Duplication!",
          tooltipStyle: "tooltip-error",
          duplication: true,
        },
      };
      return setTypedValues(newTypedValues);
    }
  };

  const handleAddOption = () => {
    setOptionsCount((prevCount) => prevCount + 1);
    setTypedValues((prevValues) => [
      ...prevValues,
      {
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
      <div className="mx-auto my-[14.63px] max-w-[85%] rounded-[8.006px] bg-[#F3F3F3] py-[12.93px] tablet:my-10 tablet:rounded-[26px] tablet:py-[27px] xl:max-w-[979px] xl:py-[42px]">
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[22.81px] xl:text-[32px]">
          Create Quest
        </h1>
        <h3 className="mb-[13.54px] ml-[32px] mt-[11.71px] text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:ml-[67px] tablet:mt-[20.38px] tablet:text-[16.58px] xl:mb-[22px] xl:ml-[104px] xl:mt-[38px] xl:text-[25px]">
          Make a statement or pose a question
        </h3>
        {/* write question */}
        {/* <div className="join w-full px-12"> */}
        <div className="w-[calc(100%-51.75px] mx-[21px] flex tablet:ml-[54px] tablet:mr-[73px]">
          <input
            className="w-full rounded-l-[0.33rem] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:text-[#7C7C7C] tablet:rounded-l-[10.3px] tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem] xl:rounded-l-2xl xl:py-[18px] xl:text-[1.875rem]"
            // className="input join-item input-bordered input-lg h-[4.7rem] w-full bg-white text-3xl text-black"
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
          />
          {/* <div className="relative"> */}
          <button
            id="new"
            // data-tooltip-offset={-25}
            className={`relative rounded-r-[0.33rem] bg-white text-[0.5rem] font-semibold dark:border-[#222325] tablet:rounded-r-[10.3px] tablet:text-[17.54px] xl:rounded-r-2xl xl:text-[1.875rem] ${checkQuestionStatus.color} py-[0.29rem]`}
            // className={`test join-item btn-lg h-[4.7rem] bg-white text-3xl font-semibold ${checkQuestionStatus.color}`}
          >
            <div className="border-l-[0.7px] px-[1.25rem] tablet:px-[2.4rem]">
              {checkQuestionStatus.name}
            </div>
            <Tooltip optionStatus={checkQuestionStatus} />
          </button>

          {/* </div> */}
        </div>
        {/* Tooltip */}
        {/* <Tooltip
          anchorSelect="#new"
          isOpen={checkQuestionStatus.name === "Fail" && true}
          border="1px solid red"
          style={{
            backgroundColor: "#fbdfe4",
            color: "#222",
            border: "red",
            width: "auto",
            marginRight: "3rem",
          }}
          place="top"
        >
          {checkQuestionStatus.tooltipName}
        </Tooltip> */}
        {/* options */}
        <div className="mt-[1.46rem] flex flex-col gap-[9.24px] tablet:mt-10 tablet:gap-5 xl:gap-[30px]">
          {[...Array(optionsCount)].map((_, index) => (
            <MultipleChoiceOptions
              key={index}
              title="MultipleChoice"
              allowInput={true}
              label={`Option ${index + 1} #`}
              options={false}
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
            className="ml-[21.55px] mt-[6px] w-fit rounded-[7.287px] bg-[#C9C9C9] px-[7.29px] py-[3.89px] text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:ml-[50px] tablet:mt-5 tablet:rounded-[15.265px] tablet:px-[15.27px] tablet:py-[8.14px] tablet:text-[20.736px] xl:rounded-[23.6px] xl:px-6 xl:py-3 xl:text-[31px]"
            onClick={handleAddOption}
          >
            Add Option
          </button>
        </div>
        <h3 className="mb-1 ml-[32px] mt-4 text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:mb-[32px] tablet:ml-[104px] tablet:mt-[50px] tablet:text-[25px]">
          Customize your Quest
        </h3>
        {/* settings */}
        <div className="mx-auto flex max-w-[85%] flex-col gap-[9.71px] rounded-[16px] bg-[#FCFCFC] py-[15px] tablet:gap-7 tablet:py-[35px] xl:max-w-[838px]">
          <h5 className="text-center text-[11px] font-medium leading-normal text-[#435059] tablet:text-[19.35px] xl:text-[30px]">
            Settings
          </h5>
          <div className="mx-5 flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] xl:mx-[51px] xl:px-7 xl:py-[34px]">
            <h5 className="w-[150px] text-[9px]  font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] xl:w-full xl:text-[28px]">
              Participants can select multiple options.
            </h5>
            <CustomSwitch
              enabled={multipleOption}
              setEnabled={setMultipleOption}
            />
          </div>
          <>
            <div className="mx-5 flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] xl:mx-[51px] xl:px-7 xl:py-[34px]">
              <h5 className="w-[150px] text-[9px]  font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] xl:w-full xl:text-[28px]">
                Participants can add options.
              </h5>
              <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
            </div>
            <div className="mx-5 flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] xl:mx-[51px] xl:px-7 xl:py-[34px]">
              <h5 className="w-[150px] text-[9px]  font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] xl:w-full xl:text-[28px]">
                Participants can change their choice at a later time.
              </h5>
              <CustomSwitch
                enabled={changeState}
                setEnabled={() => {
                  setChangeState((prev) => !prev);
                  setChangedOption("");
                }}
              />
            </div>
            {changeState ? (
              <div className="flex flex-wrap justify-center gap-4">
                {changeOptions.map((item) => (
                  <button
                    key={item.id}
                    className={`${
                      changedOption === item.value
                        ? "bg-[#389CE3]"
                        : "bg-[#7C7C7C]"
                    } rounded-md px-4 py-1 text-[8px] text-[#F4F4F4] tablet:py-2 tablet:text-[16px]`}
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
        </div>
        {/* submit button */}
        {/* <div className="flex w-full justify-end">
          <button disabled={checkQuestionStatus?.isVerifiedQuestion && typedValues.every(item => item.optionStatus.isVerifiedAnswer === true) ? false : true} className={`blue-submit-button ${!checkQuestionStatus?.isVerifiedQuestion || !typedValues.every(item => item.optionStatus.isVerifiedAnswer === true) && "cursor-not-allowed"}`} onClick={() => handleSubmit()}>
            Submit
          </button>
        </div> */}
        <div className="flex w-full justify-end">
          <button
            disabled={
              checkQuestionStatus?.isVerifiedQuestion &&
              typedValues.every(
                (item) => item.optionStatus.isVerifiedAnswer === true,
              )
                ? false
                : true
            }
            className="mr-[28px] mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white tablet:mr-[70px] tablet:mt-[60px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] xl:rounded-[23.6px] xl:px-[60px] xl:py-3 xl:text-[31.5px]"
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
