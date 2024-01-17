import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuests,
  toggleCheck,
} from "../../../../../features/quest/questsSlice";
import { updateChangeAnsStartQuest } from "../../../../../services/api/questsApi";
import Result from "./Result";
import OptionBar from "../../../../../components/question-card/ButtonGroup";
import StartTest from "./StartTest";
import { userInfo } from "../../../../../services/api/userAuth";
import { addUser } from "../../../../../features/auth/authSlice";
import { updateOptionLimit } from "../../../../../features/quest/utilsSlice";
import { capitalizeFirstLetter, validateInterval } from "../../../../../utils";
import { getQuestionTitle } from "../../../../../utils/questionCard/SingleQuestCard";
import QuestCardLayout from "../../../../../components/question-card/QuestCardLayout";
import { useStartQuest } from "../../../../../services/mutations/quest";
import QuestInfoText from "../../../../../components/question-card/QuestInfoText";
import ConditionalTextFullScreen from "../../../../../components/question-card/ConditionalTextFullScreen";

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
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const startTestMutation = useStartQuest();

  const [open, setOpen] = useState(false);
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

  const handleStartQuest = (params) => {
    startTestMutation.mutate(params);

    if (startTestMutation.isSuccess) {
      setLoading(false);
      handleViewResults(questStartData._id);
      userInfo().then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    }

    if (startTestMutation.error) {
      setLoading(false);
    }
  };

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

        const timeInterval = validateInterval(
          questStartData.usersChangeTheirAns,
        );
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
        handleStartQuest(params);
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
        // startQuest(params);
        handleStartQuest(params);
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

        // startQuest(params);
        handleStartQuest(params);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("lastInteractedAt", questStartData.lastInteractedAt);
    localStorage.setItem("howManyTimesAnsChanged", howManyTimesAnsChanged);
  }, [questStartData.lastInteractedAt, howManyTimesAnsChanged]);

  const renderQuestContent = () => {
    if (viewResult === questStartData._id) {
      return (
        <>
          <QuestInfoText
            show={false}
            questType={questStartData.whichTypeQuestion}
          />
          <Result
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            handleToggleCheck={handleToggleCheck}
            answers={questStartData.QuestAnswers}
            btnText={questStartData.startStatus}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            handleViewResults={handleViewResults}
            usersChangeTheirAns={questStartData.usersChangeTheirAns}
            lastInteractedAt={questStartData.lastInteractedAt}
            howManyTimesAnsChanged={howManyTimesAnsChanged}
          />
          <ConditionalTextFullScreen
            show={false}
            answersSelection={answersSelection}
            rankedAnswers={rankedAnswers}
          />
        </>
      );
    }

    if (startTest === questStartData._id) {
      return (
        <>
          <QuestInfoText
            show={true}
            questType={questStartData.whichTypeQuestion}
          />
          <StartTest
            questStartData={questStartData}
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            answers={questStartData.QuestAnswers}
            multipleOption={questStartData.userCanSelectMultiple}
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
          <ConditionalTextFullScreen
            show={true}
            answersSelection={answersSelection}
            rankedAnswers={rankedAnswers}
          />
        </>
      );
    } else {
      return (
        <QuestInfoText
          show={false}
          questType={questStartData.whichTypeQuestion}
        />
      );
    }
  };

  return (
    <QuestCardLayout
      questStartData={questStartData}
      isBookmarked={isBookmarked}
      handleStartTest={handleStartTest}
    >
      {renderQuestContent()}
      <OptionBar
        questStartData={questStartData}
        id={questStartData._id}
        btnText={questStartData.startStatus}
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
        setLoadingDetail={setLoadingDetail}
        handleOpen={handleOpen}
        usersAddTheirAns={questStartData.usersAddTheirAns}
        answers={questStartData.QuestAnswers}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        expandedView={expandedView}
        setStartTest={setStartTest}
        viewResult={viewResult}
        handleSubmit={handleSubmit}
        loading={loading}
        startTest={startTest}
      />
    </QuestCardLayout>
  );
};

export default QuestionCard;