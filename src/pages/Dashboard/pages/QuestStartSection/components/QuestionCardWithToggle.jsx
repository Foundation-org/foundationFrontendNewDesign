import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userInfo } from "../../../../../services/api/userAuth";
import { addUser } from "../../../../../features/auth/authSlice";
import { resetQuests } from "../../../../../features/quest/questsSlice";
// import { getStartQuestInfo } from "../../../../../services/api/questsApi";
import { capitalizeFirstLetter, validateInterval } from "../../../../../utils";
import { getQuestionTitle } from "../../../../../utils/questionCard/SingleQuestCard";

import Result from "./Result";
import StartTest from "./StartTest";
import ButtonGroup from "../../../../../components/question-card/ButtonGroup";
import QuestInfoText from "../../../../../components/question-card/QuestInfoText";
import QuestCardLayout from "../../../../../components/question-card/QuestCardLayout";
// import SingleAnswer from "../../../../../components/question-card/options/SingleAnswer";
import ConditionalTextFullScreen from "../../../../../components/question-card/ConditionalTextFullScreen";

// import * as questAction from "../../../../../features/quest/questsSlice";
import * as questServices from "../../../../../services/api/questsApi";
import { questSelectionInitial } from "../../../../../constants/quests";

const QuestionCardWithToggle = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const quests = useSelector(questAction.getQuests);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { questStartData, isBookmarked } = props;

  const [open, setOpen] = useState(false);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(0);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [openResults, setOpenResults] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [startTest, setStartTest] = useState("");
  const [viewResult, setViewResult] = useState("");
  const [questSelection, setQuestSelection] = useState(questSelectionInitial);

  const handleQuestSelection = (actionPayload) => {
    setQuestSelection((prevState) => {
      const newState = { ...prevState, id: actionPayload.id };

      if (actionPayload.label === "yes/no") {
        newState["yes/no"] = {
          ...prevState["yes/no"],
          yes: { check: actionPayload.option === "Yes" ? true : false },
          no: { check: actionPayload.option === "No" ? true : false },
        };
      }

      if (actionPayload.label === "agree/disagree") {
        newState["agree/disagree"] = {
          ...prevState["agree/disagree"],
          agree: { check: actionPayload.option === "Agree" ? true : false },
          disagree: {
            check: actionPayload.option === "Disagree" ? true : false,
          },
        };
      }

      if (actionPayload.label === "like/dislike") {
        newState["like/dislike"] = {
          ...prevState["like/dislike"],
          like: { check: actionPayload.option === "Like" ? true : false },
          dislike: {
            check: actionPayload.option === "Dislike" ? true : false,
          },
        };
      }

      return newState;
    });
  };

  const [answersSelection, setAnswerSelection] = useState(
    questStartData.QuestAnswers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
      uuid: answer.uuid,
    })),
  );

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

  const handleStartTest = (testId) => {
    setViewResult("");
    setStartTest((prev) => (prev === testId ? "" : testId));
  };

  const handleViewResults = (testId) => {
    setStartTest("");
    setViewResult((prev) => (prev === testId ? "" : testId));
  };

  const handleChange = () => {
    setOpenResults(false);
    const data = {
      questForeignKey: questStartData._id,
      uuid: persistedUserInfo.uuid,
    };
    // getStartQuestDetail(data);
    handleStartTest(questStartData._id);
  };

  // const handleOpen = () => {
  //   setAddOptionField(1);
  //   handleAddOption();
  // };

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
    setAddOptionLimit(1);
  };

  const handleToggleCheck = (label, option, check, id) => {
    console.log("called", label, option, check, id);
    const actionPayload = {
      label,
      option,
      check,
      id,
    };

    handleQuestSelection(actionPayload);
    // dispatch(questAction.toggleCheck(actionPayload));
  };

  useEffect(() => {
    if (questStartData.whichTypeQuestion === "yes/no") {
      handleToggleCheck(
        questStartData.whichTypeQuestion,
        questStartData?.startQuestData &&
          questStartData?.startQuestData?.data[
            questStartData?.startQuestData?.data.length - 1
          ]?.selected === "Yes"
          ? "Yes"
          : "No",
        questStartData?.startQuestData &&
          questStartData?.startQuestData?.data[
            questStartData?.startQuestData?.data.length - 1
          ]?.selected === "Yes"
          ? true
          : false,
        questStartData._id,
      );
    }
    if (questStartData.whichTypeQuestion === "agree/disagree") {
      handleToggleCheck(
        questStartData.whichTypeQuestion,
        questStartData?.startQuestData &&
          questStartData?.startQuestData?.data[
            questStartData?.startQuestData?.data.length - 1
          ]?.selected === "Yes"
          ? "Agree"
          : "Disagree",
        true,
        // questStartData?.startQuestData &&
        //   questStartData?.startQuestData?.data[
        //     questStartData?.startQuestData?.data.length - 1
        //   ]?.selected === "Yes"
        //   ? true
        //   : true,
        questStartData._id,
      );
    }
  }, [questStartData]);

  console.log("questSelection", questSelection);

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: questServices.createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Start Quest Created Successfully") {
        toast.success("Successfully Completed");
        setLoading(false);
        queryClient.invalidateQueries("FeedData");
      }
      handleViewResults(questStartData._id);
      userInfo(persistedUserInfo?.uuid).then((resp) => {
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
    mutationFn: questServices.updateChangeAnsStartQuest,
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
        toast.warning("You can change your option once every 1 hour.");
        setLoading(false);
      }
      if (resp.data.message === "Start Quest Updated Successfully") {
        toast.success("Successfully Changed");
        setLoading(false);
        handleViewResults(questStartData._id);
      }
      userInfo(persistedUserInfo?.uuid).then((resp) => {
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

  // const extractSelectedAndContended = (quests) => {
  //   let selected = null;
  //   let contended = null;

  //   for (const key in quests) {
  //     const option = quests[key];

  //     if (option.check) {
  //       selected = key;
  //     }

  //     if (option.contend) {
  //       contended = key;
  //     }
  //   }

  //   return { selected, contended };
  // };

  // function updateAnswerSelection(apiResponse, answerSelectionArray) {
  //   answerSelectionArray.forEach((item, index) => {
  //     if (
  //       apiResponse.selected.some(
  //         (selectedItem) => selectedItem.question === item.label,
  //       )
  //     ) {
  //       answerSelectionArray[index].check = true;
  //     }

  //     if (
  //       apiResponse.contended.some(
  //         (contendedItem) => contendedItem.question === item.label,
  //       )
  //     ) {
  //       answerSelectionArray[index].contend = true;
  //     }
  //   });
  //   setAnswerSelection(answerSelectionArray);
  // }

  // const { mutateAsync: getStartQuestDetail } = useMutation({
  //   mutationFn: getStartQuestInfo,
  //   onSuccess: (res) => {
  //     setHowManyTimesAnsChanged(res.data.data.length);
  //     if (
  //       questStartData.whichTypeQuestion === "agree/disagree" ||
  //       questStartData.whichTypeQuestion === "yes/no" ||
  //       questStartData.whichTypeQuestion === "like/dislike"
  //     ) {
  //       if (
  //         res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
  //           "agree" ||
  //         res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
  //           "yes"
  //       ) {
  //         handleToggleCheck(
  //           res.data.data[res.data.data.length - 1].selected,
  //           true,
  //           false,
  //         );
  //       }
  //       if (
  //         res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
  //           "agree" ||
  //         res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
  //           "yes"
  //       ) {
  //         handleToggleCheck(
  //           res.data.data[res.data.data.length - 1].contended,
  //           false,
  //           true,
  //         );
  //       }
  //       if (
  //         res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
  //           "disagree" ||
  //         res.data.data[res.data.data.length - 1].contended?.toLowerCase() ===
  //           "no"
  //       ) {
  //         handleToggleCheck(
  //           res.data.data[res.data.data.length - 1].contended,
  //           false,
  //           true,
  //         );
  //       }
  //       if (
  //         res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
  //           "disagree" ||
  //         res.data.data[res.data.data.length - 1].selected?.toLowerCase() ===
  //           "no"
  //       ) {
  //         handleToggleCheck(
  //           res.data.data[res.data.data.length - 1].selected,
  //           true,
  //           false,
  //         );
  //       }
  //     }
  //     if (questStartData.whichTypeQuestion === "multiple choise") {
  //       updateAnswerSelection(
  //         res?.data.data[res.data.data.length - 1],
  //         answersSelection,
  //       );
  //     }
  //     if (questStartData.whichTypeQuestion === "ranked choise") {
  //       const updatedRankedAnswers = res?.data.data[
  //         res.data.data.length - 1
  //       ].selected.map((item) => {
  //         const correspondingRankedAnswer = rankedAnswers.find(
  //           (rankedItem) => rankedItem.label === item.question,
  //         );

  //         if (correspondingRankedAnswer) {
  //           return {
  //             id: correspondingRankedAnswer.id,
  //             label: correspondingRankedAnswer.label,
  //             check: false,
  //             contend: false,
  //           };
  //         }

  //         return null;
  //       });
  //       // Filter out any null values (items not found in rankedAnswers)
  //       const filteredRankedAnswers = updatedRankedAnswers.filter(Boolean);

  //       // Update the state with the new array
  //       setRankedAnswers(filteredRankedAnswers);
  //     }
  //     setLoadingDetail(false);
  //   },
  //   onError: (err) => {
  //     toast.error(err.response?.data);
  //     console.log("Mutation Error", err);
  //   },
  // });

  // console.log("first", ["yes/no"].yes.check === true ? "Yes" : "No");
  // questSelection;

  const handleSubmit = () => {
    setLoading(true);
    if (
      questStartData.whichTypeQuestion === "agree/disagree" ||
      questStartData.whichTypeQuestion === "yes/no" ||
      questStartData.whichTypeQuestion === "like/dislike"
    ) {
      // const { selected, contended } = extractSelectedAndContended(
      //   questStartData.whichTypeQuestion === "agree/disagree"
      //     ? quests.agreeDisagree
      //     : questStartData.whichTypeQuestion === "yes/no"
      //       ? quests.yesNo
      //       : quests.likeDislike,
      // );

      let ans = {
        created: new Date(),
      };
      if (questStartData.whichTypeQuestion === "yes/no") {
        ans.selected =
          questSelection["yes/no"].yes.check === true ? "Yes" : "No";
      }

      if (questStartData.whichTypeQuestion === "agree/disagree") {
        ans.selected =
          questSelection["agree/disagree"].agree.check === true ? "Yes" : "No";
      }

      if (questStartData.whichTypeQuestion === "like/dislike") {
        ans.selected =
          questSelection["like/dislike"].like.check === true ? "Yes" : "No";
      }

      // if (selected) {
      //   ans.selected = selected.charAt(0).toUpperCase() + selected.slice(1);
      // }
      // if (contended) {
      //   ans.contended = contended.charAt(0).toUpperCase() + contended.slice(1);
      // }

      // if(questSelection[questStartData.whichTypeQuestion])

      const params = {
        questId: questStartData._id,
        answer: ans,
        addedAnswer: "",
        uuid: persistedUserInfo?.uuid,
      };

      if (!params.answer.selected) {
        toast.warning("You cannot submit without answering");
        setLoading(false);
        return;
      }

      if (questStartData.startStatus === "change answer") {
        const currentDate = new Date();

        const timeInterval = validateInterval();
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(questStartData.lastInteractedAt) < timeInterval
        ) {
          toast.error(
            `You can change your selection again in ${questStartData.usersChangeTheirAns}`,
          );
          setLoading(false);
        } else {
          changeAnswer(params);
        }
      } else {
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
            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
              uuid: answersSelection[i].uuid,
            });
            addedAnswerValue = answersSelection[i].label;
            addedAnswerUuidValue = answersSelection[i].uuid;
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

      if (questStartData.startStatus === "change answer") {
        const timeInterval = validateInterval();
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(questStartData.lastInteractedAt) < timeInterval
        ) {
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

        if (!isSubmit) setLoading(false);

        startQuest(params);
      }
    } else if (questStartData.whichTypeQuestion === "ranked choise") {
      let addedAnswerValue = "";
      let addedAnswerUuidValue = "";
      let answerSelected = [];

      for (let i = 0; i < rankedAnswers.length; i++) {
        if (rankedAnswers[i].addedOptionByUser) {
          // If user Add his own option

          answerSelected.push({
            question: rankedAnswers[i].label,
            addedAnswerByUser: true,
          });
          addedAnswerValue = rankedAnswers[i].label;
          addedAnswerUuidValue = answersSelection[i].uuid;
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
        if (
          howManyTimesAnsChanged > 1 &&
          currentDate - new Date(questStartData.lastInteractedAt) < timeInterval
        ) {
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

        startQuest(params);
      }
    }
    setLoadingDetail(false);
  };

  useEffect(() => {
    if (questStartData.startStatus === "") {
      dispatch(resetQuests());
      setOpenResults(false);
      handleStartTest(questStartData._id);
    }
    if (questStartData.startStatus === "change answer") {
      setOpenResults(true);
      handleViewResults(questStartData._id);
    }
    if (questStartData.startStatus === "completed") {
      setOpenResults(true);
      handleViewResults(questStartData._id);
    }
  }, []);

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

    setAnswerSelection((prevAnswers) =>
      updateAnswersSelectionForRanked(prevAnswers, actionPayload),
    );
  };

  const renderQuestContent = () => {
    if (viewResult !== questStartData._id && openResults !== true) {
      return (
        <>
          <QuestInfoText
            show={true}
            questType={questStartData.whichTypeQuestion}
          />
          <StartTest
            questStartData={questStartData}
            handleToggleCheck={handleToggleCheck}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            setIsSubmit={setIsSubmit}
            loadingDetail={loadingDetail}
            questSelection={questSelection}
          />
          <ConditionalTextFullScreen
            questStartData={questStartData}
            show={true}
            answersSelection={answersSelection}
            rankedAnswers={rankedAnswers}
          />
        </>
      );
    } else {
      return (
        <>
          <QuestInfoText
            show={false}
            questType={questStartData.whichTypeQuestion}
          />
          <Result
            questStartData={questStartData}
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            handleToggleCheck={handleToggleCheck}
            handleClose={handleClose}
            answers={questStartData.QuestAnswers}
            btnText={questStartData.startStatus}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            answersSelection={answersSelection}
            addOptionField={addOptionField}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            questSelection={questSelection}
          />
          <ConditionalTextFullScreen
            questStartData={questStartData}
            show={false}
            answersSelection={answersSelection}
            rankedAnswers={rankedAnswers}
          />
        </>
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
      <ButtonGroup
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
        handleOpen={handleAddOption}
        usersAddTheirAns={questStartData.usersAddTheirAns}
        answers={questStartData.QuestAnswers}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        viewResult={viewResult}
        handleSubmit={handleSubmit}
        loading={loading}
        startTest={startTest}
        handleChange={handleChange}
      />
    </QuestCardLayout>
  );
};

export default QuestionCardWithToggle;
