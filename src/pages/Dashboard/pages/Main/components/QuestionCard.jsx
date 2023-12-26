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
import { userInfo } from "../../../../../api/userAuth";
import { addUser } from "../../../../../features/auth/authSlice";

const QuestionCard = ({
  id,
  img,
  alt,
  badgeCount,
  title,
  answers,
  question,
  whichTypeQuestion,
  time,
  btnText,
  btnColor,
  isBookmarked,
  handleStartTest,
  startTest,
  setStartTest,
  viewResult,
  handleViewResults,
  lastInteractedAt,
  usersChangeTheirAns,
  usersAddTheirAns,
  multipleOption,
  startStatus,
  createdBy,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(getQuests);
  const [open, setOpen] = useState(false);
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(0);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [loading,setLoading]=useState(false);
  const [answersSelection, setAnswerSelection] = useState(
    answers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
    })),
  );
  useEffect(() => {
    setbookmarkStatus(isBookmarked)
  }, [isBookmarked])
  

  useEffect(() => {
    setAnswerSelection(
      answers?.map((answer) => ({
        label: answer.question,
        check: false,
        contend: false,
      })),
    );
  }, [answers]);

  const [rankedAnswers, setRankedAnswers] = useState(
    answersSelection?.map((item, index) => ({
      id: `unique-${index}`,
      ...item,
    })),
  );

  useEffect(() => {
    setRankedAnswers(
      answersSelection?.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
      })),
    );
  }, [answersSelection]);

  const handleOpen = () => {
    setAddOptionField(1);
    handleAddOption();
  };

  const handleClose = () => setOpen(false);

  const handleAddOption = () => {
    const newOption = {
      label: "",
      check: true,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
    };

    setAnswerSelection([newOption, ...answersSelection]);

    setAddOptionField(0);
    setAddOptionLimit(1);
  };

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
      toast.error(err.response.data.message.split(":")[1]);
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
    setbookmarkStatus((prevIsBookmarked) => !prevIsBookmarked);
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

    dispatch(toggleCheck(actionPayload));
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
        setLoading(false)
        queryClient.invalidateQueries("FeedData");
      }
      handleViewResults(id);
      userInfo(localStorage.getItem("uId")).then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(":")[1]);
      setLoading(false)
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Answer has not changed") {
        setLoading(false)
        toast.warning(
          "You have selected the same option as last time. Your option was not changed.",
        );
      }
      if (
        resp.data.message === "You can change your answer once every 1 hour"
      ) {
        setLoading(false)
        toast.warning("You can change your option once every 1 hour.");
      }
      if (resp.data.message === "Start Quest Updated Successfully") {
        toast.success("Successfully Changed Quest");
        setLoading(false)
        handleViewResults(id);
      }
      userInfo(localStorage.getItem("uId")).then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(":")[1]);
      setLoading(false)
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
    setLoading(true);
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

      // if (!(params.answer.selected && params.answer.contended)) {
      if (!params.answer.selected) {
        toast.warning("You cannot submit without answering");
        setLoading(false)
        return;
      }

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
          setLoading(false)
        } else {
          changeAnswer(params);
        }
      } else {
        startQuest(params);
      }
    } else if (whichTypeQuestion === "multiple choise") {
      let answerSelected = [];
      let answerContended = [];
      let addedAnswerValue = "";

      for (let i = 0; i < answersSelection.length; i++) {
        if (answersSelection[i].check) {
          if (answersSelection[i].addedOptionByUser) {
            // If user Add his own option

            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
            });
            addedAnswerValue = answersSelection[i].label;
            console.log("added ans value" + addedAnswerValue);
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
      const currentDate = new Date();

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
          setLoading(false)
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

        // && params.answer.contended.length === 0
        if (params.answer.selected.length === 0) {
          toast.warning("You cannot submit without answering");
          setLoading(false)
          return;
        }

        console.log("params", params);
        startQuest(params);
      }
    } else if (whichTypeQuestion === "ranked choise") {
      let addedAnswerValue = "";
      let answerSelected = [];

      for (let i = 0; i < rankedAnswers.length; i++) {
        if (rankedAnswers[i].addedOptionByUser) {
          // If user Add his own option
          console.log("added answer ran");
          answerSelected.push({
            question: rankedAnswers[i].label,
            addedAnswerByUser: true,
          });
          addedAnswerValue = rankedAnswers[i].label;
          console.log("added ans value" + addedAnswerValue);
        } else {
          answerSelected.push({ question: rankedAnswers[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: "",
        created: new Date(),
      };
      const currentDate = new Date();

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
          setLoading(false)
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

  return (
    <div className="rounded-[12.3px] border-[1px] border-[#F3F3F3] bg-[#F3F3F3] dark:border-[#858585] dark:bg-[#141618] tablet:rounded-[26px]">
      <CardTopbar
        title={title}
        img={img}
        alt={alt}
        badgeCount={badgeCount}
        isBookmarked={isBookmarked}
        handleClickBookmark={handleBookmark}
        bookmarkStatus={bookmarkStatus}
        createdBy={createdBy}
      />
      <h1 className="ml-6 mt-[5px] text-[11.83px] font-semibold leading-normal text-[#7C7C7C] dark:text-[#B8B8B8] tablet:ml-[52.65px] tablet:text-[25px]">
        {question?.endsWith("?") ? "Q." : "S."} {question}
      </h1>
      {viewResult !== id ? (
        startTest === id ? (
          <StartTest
            title={title}
            answers={answers}
            multipleOption={multipleOption}
            SingleAnswer={SingleAnswer}
            quests={quests}
            whichTypeQuestion={whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
            handleSubmit={handleSubmit}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
            btnText={btnText}
            usersAddTheirAns={usersAddTheirAns}
            setAnswerSelection={setAnswerSelection}
            answersSelection={answersSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            addOptionField={addOptionField}
            setAddOptionField={setAddOptionField}
            addOptionLimit={addOptionLimit}
            setAddOptionLimit={setAddOptionLimit}
            time={time}
            setStartTest={setStartTest}
            loading={loading}
          />
        ) : (
          <OptionBar
            id={id}
            time={time}
            btnText={btnText}
            btnColor={btnColor}
            handleStartTest={handleStartTest}
            handleViewResults={handleViewResults}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            whichTypeQuestion={whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
            handleRankedChoice={handleRankedChoice}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            startStatus={startStatus}
            createdBy={createdBy}
            img={img}
            alt={alt}
            badgeCount={badgeCount}
            title={title}
            question={question}
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
          answersSelection={answersSelection}
          setAnswerSelection={setAnswerSelection}
          rankedAnswers={rankedAnswers}
          setRankedAnswers={setRankedAnswers}
          viewResult={viewResult}
          handleViewResults={handleViewResults}
          startStatus={startStatus}
          time={time}
        />
      )}
    </div>
  );
};

export default QuestionCard;
