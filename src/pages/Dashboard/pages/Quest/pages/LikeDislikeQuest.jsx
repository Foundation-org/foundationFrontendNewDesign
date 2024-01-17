import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkUniqueQuestion,
  createInfoQuest,
  getTopicOfValidatedQuestion,
  questionValidation,
} from "../../../../../services/api/questsApi";
import { useMutation } from "@tanstack/react-query";
import AgreeDisagreeOptions from "../components/AgreeDisagreeOptions";
import { Tooltip } from "../../../../../utils/Tooltip";

import { useSelector } from "react-redux";
import ChangeChoiceOption from "../components/ChangeChoiceOption";
import { FaSpinner } from "react-icons/fa";

const LikeDislike = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [changedOption, setChangedOption] = useState("");
  const [changeState, setChangeState] = useState(false);
  const [loading, setLoading] = useState(false);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const reset = {
    name: "Ok",
    color: "text-[#389CE3]",
    tooltipName: "Please write something...",
    tooltipStyle: "tooltip-info",
  };
  const [checkQuestionStatus, setCheckQuestionStatus] = useState(reset);
  const persistedTheme = useSelector((state) => state.utils.theme);

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
      toast.error(err.response.data.message.split(":")[1]);
      setLoading(false);
    },
  });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    setLoading(true);
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
      whichTypeQuestion: "like/dislike",
      usersChangeTheirAns: changedOption,
      QuestionCorrect: "Not Selected",
      uuid: persistedUserInfo.uuid,
      QuestTopic: questTopic,
    };

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
      queryType: "like/dislike",
    });
    // If any error captured
    if (errorMessage) {
      setLoading(false);
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

  return (
    <div>
      <h4 className="mt-[10.5px] text-center text-[9px] font-medium leading-normal text-[#ACACAC] tablet:mt-[25.8px] tablet:text-[16.58px] laptop:mt-[47px] laptop:text-[25px] dark:text-[#AAA]">
        Make a statement that anyone can "Like" or "Dislike"
      </h4>
      <div
        className={`${
          persistedTheme === "dark"
            ? "border-[1px] border-[#858585] tablet:border-[2px]"
            : ""
        } mx-auto my-[14.63px] max-w-[85%] rounded-[8.006px] bg-[#F3F3F3] py-[12.93px] tablet:my-10 tablet:rounded-[26px] tablet:py-[27px] laptop:max-w-[979px] laptop:py-[42px] dark:bg-[#141618]`}
      >
        <h1 className="text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[22.81px] laptop:text-[32px] dark:text-[#D8D8D8]">
          Create Post
        </h1>
        <h3 className="mb-[13.54px] ml-[32px] mt-[11.71px] text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:ml-[67px] tablet:mt-[20.38px] tablet:text-[16.58px] laptop:mb-[22px] laptop:ml-[104px] laptop:mt-[38px] laptop:text-[25px]"></h3>
        <div className="w-[calc(100%-51.75px] mx-[21px] flex tablet:ml-[54px] tablet:mr-[70px]">
          <input
            className="w-full rounded-l-[0.33rem] border-y-[1px] border-l-[1px] border-[#ACACAC] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem] laptop:rounded-l-2xl laptop:py-[18px] laptop:text-[1.875rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-[#7C7C7C]"
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
            placeholder="Make a statement"
          />
          <button
            id="test"
            className={`relative rounded-r-[0.33rem] border-y-[1px] border-r-[1px] border-[#ACACAC] bg-white text-[0.5rem] font-semibold tablet:rounded-r-[10.3px] tablet:text-[17.54px] laptop:rounded-r-2xl laptop:text-[1.875rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${checkQuestionStatus.color} py-[0.29rem]`}
          >
            <div className="flex w-[50px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[166px]">
              {checkQuestionStatus.name}
            </div>
            <Tooltip optionStatus={checkQuestionStatus} />
          </button>
        </div>
        <div className="mt-[1.46rem] flex flex-col gap-[7px] tablet:mt-14 tablet:gap-[14px] laptop:gap-[30px]">
          <AgreeDisagreeOptions
            answer={"Like"}
            options={false}
            handleOptionChange={() => handleOptionChange("Like")}
            isSelected={selectedOption === "Like"}
          />
          <AgreeDisagreeOptions
            answer={"Dislike"}
            options={false}
            handleOptionChange={() => handleOptionChange("Dislike")}
            isSelected={selectedOption === "Dislike"}
          />
        </div>
        <h3 className="mb-1 ml-[32px] mt-4 text-[8px] font-normal leading-normal text-[#C5C5C5] tablet:mb-[32px] tablet:ml-[104px] tablet:mt-[50px] tablet:text-[25px]">
          &#x200B;
        </h3>
        <div className="mx-auto flex max-w-[85%] flex-col gap-[9.71px] rounded-[0.30925rem] bg-[#FCFCFC] py-[15px] tablet:gap-7 tablet:rounded-[16px] tablet:py-[35px] laptop:max-w-[838px] dark:bg-[#212224]">
          <h5 className="text-center text-[11px] font-medium leading-normal text-[#435059] tablet:text-[19.35px] laptop:text-[30px] dark:text-[#737B82]">
            Settings
          </h5>
          <ChangeChoiceOption
            changeState={changeState}
            setChangeState={setChangeState}
            setChangedOption={setChangedOption}
          />
        </div>
        <div className="flex w-full justify-end">
          <button
            className="mr-7 mt-[30px] w-fit rounded-[7.28px] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[24.5px] py-[3.8px] text-[10px] font-semibold leading-normal text-white tablet:mr-[70px] tablet:mt-[60px] tablet:rounded-[15.2px] tablet:px-[15.26px] tablet:py-[8.14px] tablet:text-[20.73px] laptop:rounded-[23.6px] laptop:px-[60px] laptop:py-3 laptop:text-[31.5px] dark:bg-[#333B46] dark:from-[#333B46] dark:to-[#333B46]"
            onClick={() => handleSubmit()}
            disabled={
              loading === true ||
              checkQuestionStatus.tooltipStyle === "tooltip-error"
                ? true
                : false
            }
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

export default LikeDislike;