import { useEffect, useState } from "react";
import { changeOptions } from "../../../../../utils/options";
import { checkUniqueQuestion, createInfoQuest, questionValidation } from "../../../../../api/questsApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import YesNoOptions from "../components/YesNoOptions";
import CustomSwitch from "../../../../../components/CustomSwitch";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

const YesNo = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [changedOption, setChangedOption] = useState("");
  const [correctState, setCorrectState] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const reset = { name: "Ok", color: "text-[#389CE3]", tooltipName: "Please write something...", tooltipStyle: "tooltip-info" };
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

  useEffect(() => {
    if (correctState) {
      setChangeState(false);
      setChangedOption("");
    } else {
      setSelectedOption("");
    }
  }, [correctState]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async() => {
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question)
    if(!constraintResponse.data.isUnique) return toast.warning("This quest is not unique. A similar quest already exists.");

    const params = {
      Question: question,
      whichTypeQuestion: "yes/no",
      usersChangeTheirAns: changedOption,
      QuestionCorrect:
        correctState === true
          ? selectedOption === "Yes"
            ? "yes"
            : "no"
          : "Not Selected",
      uuid: localStorage.getItem("uId"),
    };
    // Create Quest API
    createQuest(params);
  };

  const questionVerification = async(value) => {
    setCheckQuestionStatus({name: "Checking", color: "text-[#0FB063]", tooltipName: "Verifying your question. Please wait...", tooltipStyle: "tooltip-success" })
    // Question Validation
    const { validatedQuestion, errorMessage } = await questionValidation({ question: value, queryType: 'yes/no' })
    // If any error captured
    if (errorMessage) { return setCheckQuestionStatus({name: "Fail", color: "text-[#b00f0f]", tooltipName: "Please review your text for proper grammar while keeping our code of conduct in mind.", tooltipStyle: "tooltip-error" })};
    // Question is validated and status is Ok
    setQuestion(validatedQuestion)
    setCheckQuestionStatus({name: "Ok", color: "text-[#0FB063]", tooltipName: "Question is Verified", tooltipStyle: "tooltip-success", isVerifiedQuestion: true})
  }

  return (
    <>
      <h4 className="mt-[47px] text-center text-[25px] font-medium leading-normal text-[#ACACAC]">
        Ask a question that allows for diverse responses and multiple answer
        options.
      </h4>
      <div className=" mx-auto my-10 max-w-[979px] rounded-[26px] bg-[#F3F3F3] py-[42px]">
        <h1 className="text-center text-[32px] font-semibold leading-normal text-[#7C7C7C]">
          Create Quest
        </h1>
        <h3 className="mb-[22px] ml-[104px] mt-[38px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Make a statement or pose a question
        </h3>
        <div className="join w-full px-12">
          <input 
            className="input input-bordered input-lg w-full join-item bg-white text-black text-3xl h-24"
            onChange={(e) => { setQuestion(e.target.value); setCheckQuestionStatus({name: "Ok", color: e.target.value.trim() === "" ? "text-[#389CE3]" : "text-[#b0a00f]"})}}
            onBlur={(e) => e.target.value.trim() !== "" && questionVerification(e.target.value.trim())}
          />
          <button id="test" data-tooltip-offset={-25} className={`btn-lg join-item bg-white text-3xl font-semibold h-24 ${checkQuestionStatus.color}`}>{checkQuestionStatus.name}</button>
        </div>
        <div className="indicator">
          <Tooltip anchorSelect="#test" isOpen={checkQuestionStatus.name === "Fail" && true} border="1px solid red" style={{ backgroundColor: "#fbdfe4", color: "#222", border: "red", width: 'auto' }} place="top">
            {/* <span className="indicator-item cursor-pointer" onClick={() => setCheckQuestionStatus(reset)}>
              <button className="btn btn-xs btn-circle" onClick={() => setCheckQuestionStatus(reset)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>  */}
            {checkQuestionStatus.tooltipName}
          </Tooltip>
        </div>
        <div className="mt-10 flex flex-col gap-[30px]">
          <YesNoOptions
            number={"#1"}
            answer={"Yes"}
            options={correctState ? true : false}
            handleOptionChange={() => handleOptionChange("Yes")}
            isSelected={selectedOption === "Yes"}
          />
          <YesNoOptions
            number={"#2"}
            answer={"No"}
            options={correctState ? true : false}
            handleOptionChange={() => handleOptionChange("No")}
            isSelected={selectedOption === "No"}
          />
        </div>
        <h3 className="mb-[32px] ml-[104px] mt-[50px] text-[25px] font-normal leading-normal text-[#C5C5C5]">
          Customize your Quest
        </h3>
        <div className="mx-auto flex max-w-[838px] flex-col gap-7 rounded-[16px] bg-[#FCFCFC] py-[35px]">
          <h5 className="text-center text-[30px] font-medium leading-normal text-[#435059]">
            Settings
          </h5>
          {/* <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
            <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
              This Quest has a Correct Option.
            </h5>
            <CustomSwitch enabled={correctState} setEnabled={setCorrectState} />
          </div> */}
          {!correctState ? (
            <>
              <div className="mx-[51px] flex items-center justify-between rounded-[16px] bg-[#F4F4F4] px-7 py-[34px]">
                <h5 className="text-[28px] font-normal leading-normal text-[#7C7C7C]">
                  This Quest has a Change Option.
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
          ) : null}
        </div>
        <div className="flex w-full justify-end">
          <button disabled={checkQuestionStatus?.isVerifiedQuestion ? false : true} className={`blue-submit-button ${!checkQuestionStatus?.isVerifiedQuestion && "cursor-not-allowed"}`} onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default YesNo;
