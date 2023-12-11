import { toast } from "sonner";
// import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { changeOptions } from "../../../../../utils/options";
import {
  checkUniqueQuestion,
  createInfoQuest,
  questionValidation,
} from "../../../../../api/questsApi";
import YesNoOptions from "../components/YesNoOptions";
import CustomSwitch from "../../../../../components/CustomSwitch";
import { Tooltip } from "../../../../../utils/Tooltip";
// import "react-tooltip/dist/react-tooltip.css";

const YesNo = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [changedOption, setChangedOption] = useState("");
  const [changeState, setChangeState] = useState(false);
  const reset = {
    name: "Ok",
    color: "text-[#389CE3]",
    tooltipName: "Please write something...",
    tooltipStyle: "tooltip-info",
  };
  const [checkQuestionStatus, setCheckQuestionStatus] = useState(reset);

  const { mutateAsync: createQuest } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      toast.success("Successfully Created Quest");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question);
    if (!constraintResponse.data.isUnique)
      return toast.warning(
        "This quest is not unique. A similar quest already exists.",
      );

    const params = {
      Question: question,
      whichTypeQuestion: "yes/no",
      usersChangeTheirAns: changedOption,
      QuestionCorrect: "Not Selected",
      uuid: localStorage.getItem("uId"),
    };
    // Create Quest API
    createQuest(params);
  };

  const questionVerification = async (value) => {
    if(prevValue === question) return
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
      queryType: "yes/no",
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

  return (
    <>
      <h4 className="mt-[10.5px] text-center text-[9px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25.8px] tablet:text-[16.58px] xl:mt-[47px] xl:text-[25px]">
        Ask a question that allows for diverse responses and multiple answer
        options.
      </h4>
      <div className="mx-auto my-[14.63px] max-w-[85%] rounded-[8.006px] bg-[#F3F3F3] py-[12.93px] tablet:my-10 tablet:rounded-[26px] tablet:py-[27px] xl:max-w-[979px] xl:py-[42px]">
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[22.81px] xl:text-[32px]">
          Create Quest
        </h1>
        <h3 className="mb-[13.54px] ml-[32px] mt-[11.71px] text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:ml-[67px] tablet:mt-[20.38px] tablet:text-[16.58px] xl:mb-[22px] xl:ml-[104px] xl:mt-[38px] xl:text-[25px]">
          Make a statement or pose a question
        </h3>
        <div className="w-[calc(100%-51.75px] mx-[21px] flex tablet:ml-[54px] tablet:mr-[73px]">
          <input
            className="w-full rounded-l-[0.33rem] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none dark:text-[#7C7C7C] tablet:rounded-l-2xl tablet:px-11 tablet:py-[18px] tablet:text-[1.875rem]"
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
          <button
            id="test"
            // data-tooltip-offset={-25}
            className={`relative rounded-r-[0.33rem] bg-white text-[0.5rem] font-semibold dark:border-[#222325] tablet:rounded-r-2xl tablet:text-[1.875rem] ${checkQuestionStatus.color} py-[0.29rem]`}
            // className={`join-item btn-lg h-[4.7rem] bg-white text-3xl font-semibold ${checkQuestionStatus.color}`}
          >
            <div className="border-l-[0.7px] px-[1.25rem] tablet:px-[2.4rem]">
              {checkQuestionStatus.name}
            </div>
            <Tooltip optionStatus={checkQuestionStatus} />
          </button>
        </div>
        {/* <div className="indicator"> */}
        {/* <Tooltip
            anchorSelect="#test"
            isOpen={checkQuestionStatus.name === "Fail" && true}
            border="1px solid red"
            style={{
              backgroundColor: "#fbdfe4",
              color: "#222",
              border: "red",
              width: "auto",
            }}
            place="top"
          >
         
            {checkQuestionStatus.tooltipName}
          </Tooltip> */}
        {/* <span className="indicator-item cursor-pointer" onClick={() => setCheckQuestionStatus(reset)}>
              <button className="btn btn-xs btn-circle" onClick={() => setCheckQuestionStatus(reset)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>  */}
        {/* </div> */}
        <div className="mt-[1.46rem] flex flex-col gap-[9.24px] tablet:mt-10 tablet:gap-5 xl:gap-[30px]">
          <YesNoOptions
            number={"#1"}
            answer={"Yes"}
            options={false}
            handleOptionChange={() => handleOptionChange("Yes")}
            isSelected={selectedOption === "Yes"}
          />
          <YesNoOptions
            number={"#2"}
            answer={"No"}
            options={false}
            handleOptionChange={() => handleOptionChange("No")}
            isSelected={selectedOption === "No"}
          />
        </div>
        <h3 className="mb-1 ml-[32px] mt-4 text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:mb-[32px] tablet:ml-[104px] tablet:mt-[50px] tablet:text-[25px]">
          Customize your Quest
        </h3>
        <div className="mx-auto flex max-w-[85%] flex-col gap-[9.71px] rounded-[16px] bg-[#FCFCFC] py-[15px] tablet:gap-7 tablet:py-[35px] xl:max-w-[838px]">
          <h5 className="text-center text-[11px] font-medium leading-normal text-[#435059] tablet:text-[19.35px] xl:text-[30px]">
            Settings
          </h5>
          <>
            <div className="mx-5 flex items-center justify-between rounded-[0.30925rem] bg-[#F4F4F4] px-[8.62px] pb-[10.25px] pt-[10.47px] tablet:rounded-[16px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] xl:mx-[51px] xl:px-7 xl:py-[34px]">
              <h5 className="w-[150px] text-[9px] font-normal leading-normal text-[#7C7C7C] tablet:w-[300px] tablet:text-[18.662px] xl:w-full xl:text-[28px]">
                This Quest has a Change Option.
              </h5>
              <CustomSwitch
                enabled={changeState}
                setEnabled={() => {
                  setChangeState((prev) => !prev);
                  setChangedOption("Daily");
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
        {/* <div className="flex w-full justify-end">
          <button disabled={checkQuestionStatus?.isVerifiedQuestion ? false : true} className={`blue-submit-button ${!checkQuestionStatus?.isVerifiedQuestion && "cursor-not-allowed"}`} onClick={() => handleSubmit()}>
            Submit
          </button>
        </div> */}
        {/* submit button */}
        <div className="flex w-full justify-end">
          <button
            disabled={checkQuestionStatus?.isVerifiedQuestion ? false : true}
            className="mr-7 mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white tablet:mr-[70px] tablet:mt-[60px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] xl:rounded-[23.6px] xl:px-[60px] xl:py-3 xl:text-[31.5px]"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default YesNo;
