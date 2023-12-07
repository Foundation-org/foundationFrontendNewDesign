import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeOptions } from "../../../../../utils/options";
import { checkUniqueQuestion, createInfoQuest, questionValidation } from "../../../../../api/questsApi";
import { useMutation } from "@tanstack/react-query";
import Options from "../components/Options";
import CustomSwitch from "../../../../../components/CustomSwitch";
import Title from "../../../pages/Quest/components/Title";
import AgreeDisagreeOptions from "../components/AgreeDisagreeOptions";
const AgreeDisagree = () => {
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [changedOption, setChangedOption] = useState("");
  const [correctState, setCorrectState] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [checkQuestionStatus, setCheckQuestionStatus] = useState({ name: "Ok", color: "text-[#389CE3]" });

  const navigate = useNavigate();

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
    // Validation
    if (question === "") return toast.warning("Write something Before Submitting");
    if (checkQuestionStatus.color === "text-[#b0a00f]") return toast.warning("Please wait!");
    if (checkQuestionStatus.name === "Fail") return toast.error("Please review your question");
    
    // To check uniqueness of the question
    const constraintResponse = await checkUniqueQuestion(question)
    if(!constraintResponse.data.isUnique) return toast.warning("This quest is not unique. A similar quest already exists.");

    const params = {
      Question: question,
      whichTypeQuestion: "agree/disagree",
      usersChangeTheirAns: changedOption,
      QuestionCorrect:
        correctState === true
          ? selectedOption === "Agree"
            ? "agree"
            : "disagree"
          : "Not Selected",
      uuid: localStorage.getItem("uId"),
    };
    console.log(params);
    // Create Quest API
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
        <div className="relative flex w-full justify-center">
          <input
            type="text"
            value={question}
            className="w-full max-w-[857px] rounded-2xl border-[1px] border-[#ACACAC] bg-white py-[18px] pl-9 pr-28 text-[30px] font-normal leading-[0px] text-[#435059]"
            onChange={(e) => { setQuestion(e.target.value); setCheckQuestionStatus({name: "Ok", color: e.target.value.trim() === "" ? "text-[#389CE3]" : "text-[#b0a00f]"})}}
            onBlur={(e) => e.target.value.trim() !== "" && questionVerification(e.target.value.trim())}
          />
          <h1 className={`leading-0 absolute right-[72px] top-4 border-l-2 border-[#F3F3F3] px-6 text-[30px] font-semibold ${checkQuestionStatus.color}`}>
            {checkQuestionStatus.name}
          </h1>
        </div>
        <div className="mt-10 flex flex-col gap-[30px]">
          <AgreeDisagreeOptions
            answer={"Agree"}
            options={correctState ? true : false}
            handleOptionChange={() => handleOptionChange("Agree")}
            isSelected={selectedOption === "Agree"}
          />
          <AgreeDisagreeOptions
            answer={"Disagree"}
            options={correctState ? true : false}
            handleOptionChange={() => handleOptionChange("Disagree")}
            isSelected={selectedOption === "Disagree"}
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
          <button className="blue-submit-button" onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreeDisagree;
