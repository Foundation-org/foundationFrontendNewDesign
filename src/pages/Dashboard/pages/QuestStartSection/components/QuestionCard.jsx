import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuests,
  toggleCheck,
} from "../../../../../features/quest/questsSlice";
import {
  createStartQuest,
  updateChangeAnsStartQuest,
} from "../../../../../services/api/questsApi";
import SingleAnswer from "../../../components/SingleAnswer";
import Result from "./Result";
import OptionBar from "./OptionBar";
import CardTopbar from "../../../../../components/question-card/CardTopbar";
import StartTest from "./StartTest";
import { createBookmark } from "../../../../../services/api/homepageApis";
import { deleteBookmarkById } from "../../../../../services/api/homepageApis";
import { userInfo } from "../../../../../services/api/userAuth";
import { addUser } from "../../../../../features/auth/authSlice";
import { updateOptionLimit } from "../../../../../features/quest/utilsSlice";

import * as questCardActions from "../../../../../features/quest/questCardSlice";
import { capitalizeFirstLetter, validateInterval } from "../../../../../utils";
import {
  getQuestionTitle,
  getButtonColor,
} from "../../../../../utils/questionCard/SingleQuestCard";
import BookmarkIcon from "./BookmarkIcon";
import QuestBottombar from "../../../../../components/question-card/QuestBottombar";

const QuestionCard = ({
  isBookmarked,
  handleStartTest,
  startTest,
  setStartTest,
  viewResult,
  handleViewResults,
  expandedView,
  questStartData,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [answersSelection, setAnswerSelection] = useState(
    questStartData.QuestAnswers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
      uuid: answer.uuid,
    })),
  );

  useEffect(() => {
    setbookmarkStatus(isBookmarked);
  }, [isBookmarked]);

  useEffect(() => {
    // console.log("answersSelection", answersSelection);
  }, [answersSelection]);

  useEffect(() => {
    setAnswerSelection(
      questStartData.QuestAnswers?.map((answer) => ({
        label: answer.question,
        check: false,
        contend: false,
        uuid: answer.uuid,
      })),
    );
  }, [questStartData.QuestAnswers]);

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
      uuid: persistedUserInfo.uuid,
    };

    setAnswerSelection([...answersSelection, newOption]);

    setAddOptionField(0);
    // setAddOptionLimit(1);

    dispatch(updateOptionLimit());
  };

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: createBookmark,
    onSuccess: (resp) => {
      toast.success("Bookmarked Added");
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
      toast.success("Bookmark Removed ");
      if (!isBookmarkTab) {
        queryClient.invalidateQueries("FeedData");
      }
      handleStartTest(null);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleBookmark = () => {
    setbookmarkStatus((prevIsBookmarked) => !prevIsBookmarked);
    if (bookmarkStatus) {
      const params = {
        questForeignKey: questStartData._id,
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: questStartData._id,
        Question: questStartData.Question,
        whichTypeQuestion: questStartData.whichTypeQuestion,
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
        toast.success("Successfully Completed");
        setLoading(false);
        queryClient.invalidateQueries("FeedData");
      }
      handleViewResults(questStartData._id);
      userInfo().then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(":")[1]);
      setLoading(false);
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Answer has not changed") {
        setLoading(false);
        toast.warning(
          "You have selected the same option as last time. Your option was not changed.",
        );
      }
      if (
        resp.data.message === "You can change your answer once every 1 hour"
      ) {
        setLoading(false);
        toast.warning("You can change your option once every 1 hour.");
      }
      if (resp.data.message === "Start Quest Updated Successfully") {
        toast.success("Successfully Changed");
        setLoading(false);
        queryClient.invalidateQueries("FeedData", "ResultsData");
        handleViewResults(questStartData._id);
      }
      userInfo().then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(":")[1]);
      setLoading(false);
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
    setLoading(true);
    if (
      questStartData.whichTypeQuestion === "agree/disagree" ||
      questStartData.whichTypeQuestion === "yes/no" ||
      questStartData.whichTypeQuestion === "like/dislike"
    ) {
      const { selected, contended } = extractSelectedAndContended(
        questStartData.whichTypeQuestion === "agree/disagree"
          ? quests.agreeDisagree
          : questStartData.whichTypeQuestion === "yes/no"
            ? quests.yesNo
            : quests.likeDislike,
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
        questId: questStartData._id,
        answer: ans,
        addedAnswer: "",
        uuid: persistedUserInfo?.uuid,
      };

      // if (!(params.answer.selected && params.answer.contended)) {
      if (!params.answer.selected) {
        toast.warning("You cannot submit without answering");
        setLoading(false);
        return;
      }

      if (questStartData.startStatus === "change answer") {
        console.log(howManyTimesAnsChanged);
        const currentDate = new Date();

        const timeInterval = validateInterval();
        // Check if enough time has passed
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(questStartData.lastInteractedAt) < timeInterval
        ) {
          // Alert the user if the time condition is not met
          toast.error(
            `You can change your selection again in ${questStartData.usersChangeTheirAns}`,
          );
          setLoading(false);
        } else {
          changeAnswer(params);
        }
      } else {
        console.log(questStartData.whichTypeQuestion);
        console.log(params);
        startQuest(params);
      }
    } else if (questStartData.whichTypeQuestion === "multiple choise") {
      let answerSelected = [];
      let answerContended = [];
      let addedAnswerValue = "";
      let addedAnswerUuidValue = "";

      for (let i = 0; i < answersSelection.length; i++) {
        if (answersSelection[i].check) {
          if (answersSelection[i].addedOptionByUser) {
            // If user Add his own option

            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
              uuid: answersSelection[i].uuid,
            });
            addedAnswerValue = answersSelection[i].label;
            addedAnswerUuidValue = answersSelection[i].uuid;
            console.log("added ans value" + addedAnswerValue);
          } else {
            answerSelected.push({ question: answersSelection[i].label });
          }
        }

        if (answersSelection[i].contend) {
          answerContended.push({ question: answersSelection[i].label });
        }

        // if(answersSelection[i].check === false && answersSelection[i].contend === false) {
        // empty check will come here
        // }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: answerContended,
        created: new Date(),
      };
      const currentDate = new Date();

      if (questStartData.startStatus === "change answer") {
        const timeInterval = validateInterval();
        // Check if enough time has passed
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(questStartData.lastInteractedAt) < timeInterval
        ) {
          // Alert the user if the time condition is not met
          toast.error(
            `You can change your selection again in ${questStartData.usersChangeTheirAns}`,
          );
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            uuid: persistedUserInfo?.uuid,
          };
          console.log("params", params);
          changeAnswer(params);
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid,
        };
        console.log("selected", params);
        // && params.answer.contended.length === 0
        if (params.answer.selected.length === 0) {
          toast.warning("You cannot submit without answering");
          setLoading(false);
          return;
        }
        const isEmptyQuestion = params.answer.selected.some(
          (item) => item.question.trim() === "",
        );

        if (isEmptyQuestion) {
          toast.error("You cannot leave the added option blank");
          setLoading(false);
          return;
        }
        console.log({ isSubmit });

        if (!isSubmit) setLoading(false);
        console.log("params", params);
        startQuest(params);
      }
    } else if (questStartData.whichTypeQuestion === "ranked choise") {
      let addedAnswerValue = "";
      let addedAnswerUuidValue = "";
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
          addedAnswerUuidValue = answersSelection[i].uuid;
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

      if (questStartData.startStatus === "change answer") {
        const timeInterval = validateInterval();
        // Check if enough time has passed
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(questStartData.lastInteractedAt) < timeInterval
        ) {
          // Alert the user if the time condition is not met
          toast.error(
            `You can change your selection again in ${questStartData.usersChangeTheirAns}`,
          );
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            uuid: persistedUserInfo?.uuid,
          };
          console.log("params", params);
          changeAnswer(params);
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid,
        };
        console.log("params", params);

        startQuest(params);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("lastInteractedAt", questStartData.lastInteractedAt);
    localStorage.setItem("howManyTimesAnsChanged", howManyTimesAnsChanged);
  }, [questStartData.lastInteractedAt, howManyTimesAnsChanged]);

  return (
    <div className="rounded-[12.3px] border-2 border-[#D9D9D9] bg-[#F3F3F3] tablet:rounded-[15px] dark:border-white dark:bg-[#141618]">
      <CardTopbar
        QuestTopic={questStartData.QuestTopic}
        img={"assets/svgs/dashboard/badge.svg"}
        alt={"badge"}
        badgeCount={5}
        createdBy={questStartData.uuid}
      />
      <div className="ml-6 mr-[1.38rem] mt-[1.56rem] flex items-center justify-between tablet:ml-[52.65px]">
        <h1 className="w-[93%] text-[11.83px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[25px] dark:text-[#B8B8B8]">
          {questStartData.Question?.endsWith("?") ? "Q." : "S."}{" "}
          {questStartData.Question}
        </h1>
        <BookmarkIcon
          bookmarkStatus={bookmarkStatus}
          persistedTheme={persistedTheme}
          handleBookmark={handleBookmark}
        />
      </div>
      {viewResult !== questStartData._id ? (
        startTest === questStartData._id ? (
          <StartTest
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            answers={questStartData.QuestAnswers}
            multipleOption={questStartData.userCanSelectMultiple}
            SingleAnswer={SingleAnswer}
            quests={quests}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
            handleSubmit={handleSubmit}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
            btnText={questStartData.startStatus}
            usersAddTheirAns={questStartData.usersAddTheirAns}
            setAnswerSelection={setAnswerSelection}
            answersSelection={answersSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            addOptionField={addOptionField}
            setAddOptionField={setAddOptionField}
            setStartTest={setStartTest}
            loading={loading}
            setIsSubmit={setIsSubmit}
            expandedView={expandedView}
            usersChangeTheirAns={questStartData.usersChangeTheirAns}
            howManyTimesAnsChanged={howManyTimesAnsChanged}
            loadingDetail={loadingDetail}
          />
        ) : (
          <OptionBar
            id={questStartData._id}
            time={questStartData.createdAt}
            btnText={questStartData.startStatus}
            btnColor={getButtonColor(questStartData.startStatus)}
            handleStartTest={handleStartTest}
            handleViewResults={handleViewResults}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            handleToggleCheck={handleToggleCheck}
            handleRankedChoice={handleRankedChoice}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            startStatus={questStartData.startStatus}
            createdBy={questStartData.uuid}
            setLoadingDetail={setLoadingDetail}
            img={"/assets/svgs/dashboard/badge.svg"}
            alt={"badge"}
            badgeCount={5}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            question={questStartData.Question}
          />
        )
      ) : (
        <Result
          id={questStartData._id}
          title={getQuestionTitle(questStartData.whichTypeQuestion)}
          handleToggleCheck={handleToggleCheck}
          handleClose={handleClose}
          answers={questStartData.QuestAnswers}
          btnText={questStartData.startStatus}
          whichTypeQuestion={questStartData.whichTypeQuestion}
          setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
          answersSelection={answersSelection}
          setAnswerSelection={setAnswerSelection}
          rankedAnswers={rankedAnswers}
          setRankedAnswers={setRankedAnswers}
          viewResult={viewResult}
          handleViewResults={handleViewResults}
          startStatus={questStartData.startStatus}
          time={questStartData.createdAt}
          usersChangeTheirAns={questStartData.usersChangeTheirAns}
          lastInteractedAt={questStartData.lastInteractedAt}
          howManyTimesAnsChanged={howManyTimesAnsChanged}
        />
      )}
      <QuestBottombar
        time={questStartData.createdAt}
        id={questStartData._id}
        createdBy={questStartData.uuid}
        img={"assets/svgs/dashboard/badge.svg"}
        alt={"badge"}
        badgeCount={5}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        question={questStartData.Question}
      />
    </div>
  );
};

export default QuestionCard;
