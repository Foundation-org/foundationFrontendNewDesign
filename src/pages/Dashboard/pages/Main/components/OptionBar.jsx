import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { resetQuests } from "../../../../../features/quest/questsSlice";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const OptionBar = ({
  btnText,
  btnColor,
  handleStartTest,
  handleViewResults,
  id,
  isCorrect,
  correctCount,
  time,
  setHowManyTimesAnsChanged,
  whichTypeQuestion,
  handleToggleCheck,
  handleMultipleChoiceCC,
  handleRankedChoice,
  rankedAnswers,
  setRankedAnswers,
}) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      console.log("resp", res.data.data);
      console.log({ whichTypeQuestion });
      setHowManyTimesAnsChanged(res.data.data.length);
      if (
        whichTypeQuestion === "agree/disagree" ||
        whichTypeQuestion === "yes/no"
      ) {
        if (
          res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
            "agree" ||
          res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
            "yes"
        ) {
          console.log("ran 1");
          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
        if (
          res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
            "agree" ||
          res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
            "yes"
        ) {
          console.log("ran 2");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
            "disagree" ||
          res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
            "no"
        ) {
          console.log("ran 3");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
            "disagree" ||
          res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
            "no"
        ) {
          console.log("ran 4");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
      }
      if (whichTypeQuestion === "multiple choise") {
        if (res?.data.data[res.data.data.length - 1].selected) {
          res?.data.data[res.data.data.length - 1].selected.map(
            (item, index) => {
              handleMultipleChoiceCC(
                "Multiple Choice",
                true,
                false,
                item.question,
              );
            },
          );
        }
        if (res?.data.data[res.data.data.length - 1].contended) {
          res?.data.data[res.data.data.length - 1].contended.map(
            (item, index) => {
              handleMultipleChoiceCC(
                "Multiple Choice",
                false,
                true,
                item.question,
              );
            },
          );
        }
      }
      if (whichTypeQuestion === "ranked choise") {
        console.log(
          "ranked response" + res?.data.data[res.data.data.length - 1].selected,
        );

        const updatedRankedAnswers = res?.data.data[
          res.data.data.length - 1
        ].selected.map((item) => {
          const correspondingRankedAnswer = rankedAnswers.find(
            (rankedItem) => rankedItem.label === item.question,
          );

          if (correspondingRankedAnswer) {
            return {
              id: correspondingRankedAnswer.id,
              label: correspondingRankedAnswer.label,
              check: false,
              contend: false,
            };
          }

          return null;
        });
        // Filter out any null values (items not found in rankedAnswers)
        const filteredRankedAnswers = updatedRankedAnswers.filter(Boolean);

        // Update the state with the new array
        setRankedAnswers(filteredRankedAnswers);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data);
      console.log("Mutation Error", err);
    },
  });

  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentDate = new Date();
      const createdAtDate = new Date(time);

      const timeDifference = currentDate - createdAtDate;
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeAgo(`${days} ${days === 1 ? "day" : "days"} ago`);
      } else if (hours > 0) {
        setTimeAgo(`${hours} ${hours === 1 ? "hour" : "hours"} ago`);
      } else if (minutes > 0) {
        setTimeAgo(`${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`);
      } else {
        setTimeAgo(`${seconds} ${seconds === 1 ? "second" : "seconds"} ago`);
      }
    };

    calculateTimeAgo();
  }, [time]);

  const handleStartChange = () => {
    if (btnText === "") {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === "change answer") {
      const data = { questForeignKey: id, uuid: localStorage.getItem("uId") };
      getStartQuestDetail(data);
      handleStartTest(id);
    }
  };

  function getButtonText(btnText) {
    switch (btnText) {
      case "correct":
        return "Correct";
      case "incorrect":
        return "Incorrect";
      case "change answer":
        return "Change";
      default:
        return "Start";
    }
  }

  function getButtonClassName(persistedTheme, btnText, btnColor) {
    if (persistedTheme === "dark") {
      switch (btnText) {
        case "correct":
          return "bg-[#148339]";
        case "incorrect":
          return "bg-[#C13232]";
        case "change answer":
          return "bg-[#BB9D02]";
        default:
          return "inset-0 rounded-[15px] border-[1px] border-[#333B46] bg-[#333B46] shadow-inner";
      }
    } else {
      return btnColor;
    }
  }

  return (
    <>
      <div className="mb-1 flex items-center">
        {isCorrect === "Selected" && (
          <p className="ml-6 mt-12 w-fit min-w-[12rem] rounded-[15px] bg-white px-[14px] pb-[7px] pt-2 text-[18px] font-semibold leading-normal text-[#28A954] dark:bg-[#303030] dark:text-[#737373]">
            {correctCount} Correct Answers
          </p>
        )}
        <div className="tablet:gap-[42px] mb-1 mr-[30px] flex w-full justify-end gap-[19.14px]">
          <button
            className={` ${getButtonClassName(
              persistedTheme,
              btnText,
              btnColor,
            )} tablet:mt-12 tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] mt-[16.2px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white`}
            onClick={handleStartChange}
            disabled={btnText === "correct" || btnText === "incorrect"}
          >
            {getButtonText(btnText)}
          </button>

          <button
            className="tablet:mt-12 tablet:w-[173px] tablet:rounded-[15px] tablet:border-[3px] tablet:px-5 tablet:py-2 tablet:text-[20px] mt-[16.2px] w-[78px] rounded-[7.1px] border-[1.42px] border-[#20D47E] px-[7.1px] py-[3.7px] text-[9.46px] font-semibold leading-normal text-[#20D47E] dark:border-[#7C7C7C] dark:text-[#C9C8C8]"
            onClick={() => {
              if (btnText !== "") {
                handleViewResults(id);
              } else {
                toast.error("First Start this question to see Results");
              }
            }}
          >
            Result
          </button>
        </div>
      </div>
      <div className="tablet:mb-[23px] tablet:ml-[26px] tablet:h-[26px] tablet:w-[114px] tablet:gap-1 tablet:rounded-[10px] mb-3 ml-[14.24px] flex h-3 w-[53.9px] items-center justify-center gap-[2px] rounded-[4.73px] bg-white dark:bg-[#090A0D]">
        <img
          src="/assets/svgs/dashboard/clock-outline.svg"
          alt="clock"
          className="tablet:h-4 tablet:w-4 h-[7.64px] w-[7.64px]"
        />
        <p className="tablet:text-[10px] text-[6px] font-[400] leading-normal text-[#9C9C9C]">
          {timeAgo}
        </p>
      </div>
    </>
  );
};

export default OptionBar;
