import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addChoice,
  getQuests,
  toggleCheck,
} from "../../../../../features/quest/questsSlice";
import {
  createStartQuest,
  updateChangeAnsStartQuest,
} from "../../../../../api/questsApi";
import SingleAnswer from "../../../components/SingleAnswer";
import Result from "./Result";
import OptionBar from "./OptionBar";
import CardTopbar from "./CardTopbar";
import StartTest from "./StartTest";
import { createBookmark } from "../../../../../api/homepageApis";
import { deleteBookmarkById } from "../../../../../api/homepageApis";
const QuestionCard = ({
  id,
  img,
  alt,
  badgeCount,
  title,
  answers,
  question,
  whichTypeQuestion,
  isCorrect,
  correctCount,
  time,
  btnText,
  btnColor,
  isBookmarked,
  handleStartTest,
  startTest,
  viewResult,
  handleViewResults,
  lastInteractedAt,
  usersChangeTheirAns,
  usersAddTheirAns,
  multipleOption,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(getQuests);
  const [open, setOpen] = useState(false);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addedAnswerByUser, SetAddedAnswerByUser] = useState(false);
  const [answersSelection, setAnswerSelection] = useState(
    answers.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
    })),
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // move add optioon state here

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: createBookmark,
    onSuccess: (resp) => {
      toast.success("Successfully Bookmarked Quest");
      queryClient.invalidateQueries("FeedData");
      handleStartTest(null);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const { mutateAsync: DelBookmark } = useMutation({
    mutationFn: deleteBookmarkById,
    onSuccess: (resp) => {
      toast.success("Successfully Removed Bookmark");
      queryClient.invalidateQueries("FeedData");
      handleStartTest(null);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleBookmark = (status) => {
    if (status) {
      const params = {
        questForeignKey: id,
        uuid: localStorage.getItem("uId"),
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: id,
        uuid: localStorage.getItem("uId"),
        Question: question,
        whichTypeQuestion: whichTypeQuestion,
      };
      AddBookmark(params);
    }
  };

  const handleToggleCheck = (option, check, contend) => {
    const capitalizedOption = capitalizeFirstLetter(option);

    const actionPayload = {
      option: capitalizedOption,
      check,
      contend,
    };

    console.log({ actionPayload });

    dispatch(toggleCheck(actionPayload));
  };

  const updateAnswersSelection = (currentAnswers, actionPayload) => {
    const { label, check, contend } = actionPayload;

    return currentAnswers.map((answer) =>
      answer.label === label ? { ...answer, check, contend } : answer,
    );
  };

  const handleMultipleChoiceCC = (option, check, contend, label) => {
    const actionPayload = {
      option,
      check,
      contend,
      label,
    };

    console.log({ actionPayload });

    setAnswerSelection((prevAnswers) =>
      updateAnswersSelection(prevAnswers, actionPayload),
    );
  };

  const updateAnswersSelectionForRanked = (prevAnswers, actionPayload) => {
    const { option, label } = actionPayload;

    const updatedAnswers = prevAnswers.map((answer) => {
      // Check if the label matches the question
      if (label.some((item) => item.question === answer.label)) {
        return { ...answer, check: true }; // Set check to true for matching question
      } else {
        return answer;
      }
    });

    return updatedAnswers;
  };

  const handleRankedChoice = (option, label) => {
    const actionPayload = {
      option,
      label,
    };

    console.log({ actionPayload });

    setAnswerSelection((prevAnswers) =>
      updateAnswersSelectionForRanked(prevAnswers, actionPayload),
    );
  };

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Start Quest Created Successfully") {
        toast.success("Successfully Answered Quest");
        queryClient.invalidateQueries("FeedData");
      }
      handleStartTest(null);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Answer has not changed") {
        toast.warning(
          "You have selected the same option as last time. Your option was not changed.",
        );
      }
      if (
        resp.data.message === "You can change your answer once every 1 hour"
      ) {
        toast.warning("You can change your option once every 1 hour.");
      }
      if (resp.data.message === "Start Quest Updated Successfully") {
        toast.success("Successfully Changed Quest");
      }
      handleStartTest(null);
    },
    onError: (err) => {
      toast.error(err.response.data);
    },
  });

  const extractSelectedAndContended = (quests) => {
    let selected = null;
    let contended = null;

    for (const key in quests) {
      const option = quests[key];

      if (option.check) {
        selected = key;
      }

      if (option.contend) {
        contended = key;
      }
    }

    return { selected, contended };
  };

  const validateInterval = () => {
    // Define the time interval (in milliseconds) based on usersChangeTheirAns value
    let timeInterval = 0;
    if (usersChangeTheirAns === "Daily") {
      return (timeInterval = 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    } else if (usersChangeTheirAns === "Weekly") {
      return (timeInterval = 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    } else if (usersChangeTheirAns === "Monthly") {
      // Assuming 30 days in a month for simplicity
      return (timeInterval = 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    } else if (usersChangeTheirAns === "Yearly") {
      // Assuming 365 days in a year for simplicity
      return (timeInterval = 365 * 24 * 60 * 60 * 1000); // 365 days in milliseconds
    } else if (usersChangeTheirAns === "TwoYears") {
      // Assuming 2 years
      return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000); // 2 years in milliseconds
    } else if (usersChangeTheirAns === "FourYears") {
      // Assuming 4 years
      return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000); // 4 years in milliseconds
    }
  };

  const handleSubmit = () => {
    if (
      whichTypeQuestion === "agree/disagree" ||
      whichTypeQuestion === "yes/no"
    ) {
      const { selected, contended } = extractSelectedAndContended(
        whichTypeQuestion === "agree/disagree"
          ? quests.agreeDisagree
          : quests.yesNo,
      );

      let ans = {
        created: new Date(),
      };
      if (selected) {
        ans.selected = selected.charAt(0).toUpperCase() + selected.slice(1);
      }
      if (contended) {
        ans.contended = contended.charAt(0).toUpperCase() + contended.slice(1);
      }
      const params = {
        questId: id,
        answer: ans,
        addedAnswer: "",
        uuid: localStorage.getItem("uId"),
      };

      if (btnText === "change answer") {
        console.log(howManyTimesAnsChanged);
        const currentDate = new Date();

        const timeInterval = validateInterval();
        // Check if enough time has passed
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(lastInteractedAt) < timeInterval
        ) {
          // Alert the user if the time condition is not met
          toast.error(
            `You can only finish after ${usersChangeTheirAns} interval has passed.`,
          );
        } else {
          changeAnswer(params);
        }
      } else {
        startQuest(params);
      }
    } else if (whichTypeQuestion === "multiple choise") {
      console.log("inside multiple");
      let answerSelected = [];
      let answerContended = [];
      let addedAnswerValue = "";

      for (let i = 0; i < answersSelection.length; i++) {
        if (answersSelection[i].check) {
          if (answersSelection[i].addedOptionByUser) {
            // If user Add his own option
            console.log("added answer ran");
            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
            });
            addedAnswerValue = answersSelection[i].label;
            console.log("added ans value"+addedAnswerValue);
          } else {
            answerSelected.push({ question: answersSelection[i].label });
          }
        }

        if (answersSelection[i].contend) {
          answerContended.push({ question: answersSelection[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: answerContended,
        created: new Date(),
      };

      if (btnText === "change answer") {
        const timeInterval = validateInterval();
        // Check if enough time has passed
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(lastInteractedAt) < timeInterval
        ) {
          // Alert the user if the time condition is not met
          toast.error(
            `You can only finish after ${usersChangeTheirAns} interval has passed.`,
          );
        } else {
          const params = {
            questId: id,
            answer: dataToSend,
            uuid: localStorage.getItem("uId"),
          };
          console.log("params", params);
          changeAnswer(params);
        }
      } else {
        const params = {
          questId: id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          uuid: localStorage.getItem("uId"),
        };
        console.log("params", params);
        startQuest(params);
      }
    }
  };

  console.log("answersSelection", answersSelection);

  return (
    <div className="rounded-[26px] border-[1px] border-[#F3F3F3] bg-[#F3F3F3] dark:border-[#858585] dark:bg-[#141618]">
      <CardTopbar
        title={title}
        img={img}
        alt={alt}
        badgeCount={badgeCount}
        isBookmarked={isBookmarked}
        handleClickBookmark={handleBookmark}
      />
      <h1 className="ml-[52.65px] mt-[5px] text-[25px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8]">
        {question.endsWith("?") ? "Q." : "S."} {question}
      </h1>
      {viewResult !== id ? (
        startTest === id ? (
          <StartTest
            title={title}
            answers={answers}
            multipleOption={multipleOption}
            correctCount={correctCount}
            SingleAnswer={SingleAnswer}
            quests={quests}
            whichTypeQuestion={whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
            handleMultipleChoiceCC={handleMultipleChoiceCC}
            handleSubmit={handleSubmit}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
            btnText={btnText}
            usersAddTheirAns={usersAddTheirAns}
            setAnswerSelection={setAnswerSelection}
            answersSelection={answersSelection}
          />
        ) : (
          <OptionBar
            id={id}
            isCorrect={isCorrect}
            correctCount={correctCount}
            time={time}
            btnText={btnText}
            btnColor={btnColor}
            handleStartTest={handleStartTest}
            handleViewResults={handleViewResults}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            whichTypeQuestion={whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
            handleMultipleChoiceCC={handleMultipleChoiceCC}
            handleRankedChoice={handleRankedChoice}
          />
        )
      ) : (
        <Result
          id={id}
          title={title}
          handleToggleCheck={handleToggleCheck}
          handleClose={handleClose}
          answers={answers}
          btnText={btnText}
          whichTypeQuestion={whichTypeQuestion}
          setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
          handleMultipleChoiceCC={handleMultipleChoiceCC}
          answersSelection={answersSelection}
        />
      )}
    </div>
  );
};

export default QuestionCard;
