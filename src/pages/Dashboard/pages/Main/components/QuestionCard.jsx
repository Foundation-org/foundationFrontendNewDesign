import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
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

const QuestionCard = ({
  id,
  img,
  alt,
  badgeCount,
  title,
  answers,
  question,
  whichTypeQuestion,
  correctAnswers,
  btnText,
  btnColor,
  isBookmarked,
  handleStartTest,
  startTest,
  viewResult,
  handleViewResults,
  lastInteractedAt,
  usersChangeTheirAns,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(getQuests);
  const [open, setOpen] = useState(false);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleToggleCheck = (option, check, contend) => {
    const actionPayload = {
      option,
      check,
      contend,
    };

    dispatch(toggleCheck(actionPayload));
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

  const handleSubmit = () => {
    const { selected, contended } = extractSelectedAndContended(
      whichTypeQuestion === "Agree/Disagree"
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

      // Define the time interval (in milliseconds) based on usersChangeTheirAns value
      let timeInterval = 0;
      if (usersChangeTheirAns === "Daily") {
        timeInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      } else if (usersChangeTheirAns === "Weekly") {
        timeInterval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      } else if (usersChangeTheirAns === "Monthly") {
        // Assuming 30 days in a month for simplicity
        timeInterval = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      } else if (usersChangeTheirAns === "Yearly") {
        // Assuming 365 days in a year for simplicity
        timeInterval = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
      } else if (usersChangeTheirAns === "TwoYears") {
        // Assuming 2 years
        timeInterval = 2 * 365 * 24 * 60 * 60 * 1000; // 2 years in milliseconds
      } else if (usersChangeTheirAns === "FourYears") {
        // Assuming 4 years
        timeInterval = 4 * 365 * 24 * 60 * 60 * 1000; // 4 years in milliseconds
      }

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
  };

  return (
    <div className="rounded-[26px] border-[1px] border-[#F3F3F3] bg-[#F3F3F3] dark:border-[#858585] dark:bg-[#141618]">
      <CardTopbar
        title={title}
        img={img}
        alt={alt}
        badgeCount={badgeCount}
        isBookmarked={isBookmarked}
      />
      <h1 className="ml-[52.65px] mt-[5px] text-[25px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8]">
        {question.endsWith("?") ? "Q." : "S."} {question}
      </h1>
      {viewResult !== id ? (
        startTest === id ? (
          <StartTest
            title={title}
            answers={answers}
            SingleAnswer={SingleAnswer}
            quests={quests}
            handleToggleCheck={handleToggleCheck}
            handleSubmit={handleSubmit}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
          />
        ) : (
          <OptionBar
            id={id}
            correctAnswers={correctAnswers}
            btnText={btnText}
            btnColor={btnColor}
            handleStartTest={handleStartTest}
            handleViewResults={handleViewResults}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            whichTypeQuestion={whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
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
          
        />
      )}
    </div>
  );
};

export default QuestionCard;
