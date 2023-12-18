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
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { resetQuests } from "../../../../../features/quest/questsSlice";

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
  isBookmarked,
  handleStartTest,
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
  const [bookmarkStatus, setbookmarkStatus] = useState(isBookmarked);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(0);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [answersSelection, setAnswerSelection] = useState(
    answers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
    })),
  );

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

  console.log({ answers, answersSelection, rankedAnswers });

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
      toast.error(err.response.data.message.split(':')[1]);
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

    console.log({ actionPayload });

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

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Start Quest Created Successfully") {
        toast.success("Successfully Answered Quest");
        queryClient.invalidateQueries("FeedData");
      }
      handleViewResults(id);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
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
        handleViewResults(id);
      }
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
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

  function updateAnswerSelection(apiResponse, answerSelectionArray) {
    answerSelectionArray.forEach((item, index) => {
      // Check in selected array
      if (
        apiResponse.selected.some(
          (selectedItem) => selectedItem.question === item.label,
        )
      ) {
        answerSelectionArray[index].check = true;
      }

      // Check in contended array
      if (
        apiResponse.contended.some(
          (contendedItem) => contendedItem.question === item.label,
        )
      ) {
        answerSelectionArray[index].contend = true;
      }
    });
    setAnswerSelection(answerSelectionArray);
  }

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
          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
      }
      if (whichTypeQuestion === "multiple choise") {
        updateAnswerSelection(
          res?.data.data[res.data.data.length - 1],
          answersSelection,
        );
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

      // if (!(params.answer.selected && params.answer.contended)) {
      if (!params.answer.selected) {
        toast.warning("You cannot submit without answering");
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

  useEffect(() => {
    if (btnText === "") {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === "change answer") {
      const data = { questForeignKey: id, uuid: localStorage.getItem("uId") };
      getStartQuestDetail(data);
      handleStartTest(id);
    }
    if (btnText === "completed") {
      handleViewResults(id);
    }
   
  }, []);

  // console.log({ rankedAnswers });
  // console.log({ answersSelection });

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
          <StartTest
          id={id}
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
            createdBy={createdBy}
            img={img}
            alt={alt}
            badgeCount={badgeCount}
            question={question}
            time={time}

          />
       
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
        />
      )}
    </div>
  );
};

export default QuestionCard;
