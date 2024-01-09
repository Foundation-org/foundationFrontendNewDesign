import { useEffect, useState } from "react";
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
import { createBookmark } from "../../../../../api/homepageApis";
import { deleteBookmarkById } from "../../../../../api/homepageApis";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { resetQuests } from "../../../../../features/quest/questsSlice";
import { userInfo } from "../../../../../api/userAuth";
import { addUser } from "../../../../../features/auth/authSlice";
import Cookies from "js-cookie";

const QuestionCardWithToggle = ({
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
  setViewResult,
  handleViewResults,
  lastInteractedAt,
  usersChangeTheirAns,
  usersAddTheirAns,
  multipleOption,
  startStatus,
  createdBy,
  expandedView,
  QuestTopic,
}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(getQuests);
  const [open, setOpen] = useState(false);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [bookmarkStatus, setbookmarkStatus] = useState(isBookmarked);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(0);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [openResults, setOpenResults] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [answersSelection, setAnswerSelection] = useState(
    answers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
      uuid: answer.uuid,
    })),
  );

  useEffect(() => {
    setAnswerSelection(
      answers?.map((answer) => ({
        label: answer.question,
        check: false,
        contend: false,
        uuid: answer.uuid,
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

  const handleChange = () => {
    console.log("change clicked");
    setOpenResults(false);
    const data = { questForeignKey: id, uuid: Cookies.get("uId") };
    getStartQuestDetail(data);
    handleStartTest(id);
  };

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
      toast.success("Bookmark Removed");
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
        uuid: Cookies.get("uId"),
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: id,
        uuid: Cookies.get("uId"),
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

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === "Start Quest Created Successfully") {
        toast.success("Successfully Answered Quest");
        queryClient.invalidateQueries("FeedData");
      }
      handleViewResults(id);
      userInfo(Cookies.get("uId")).then((resp) => {
        if (resp.status === 200) {
          dispatch(addUser(resp.data));
        }
      });
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(":")[1]);
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
        setLoading(false);
      }
      if (resp.data.message === "Start Quest Updated Successfully") {
        toast.success("Successfully Changed Quest");
        setLoading(false);
        handleViewResults(id);
      }
      userInfo(Cookies.get("uId")).then((resp) => {
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
        whichTypeQuestion === "yes/no" ||
        whichTypeQuestion === "like/unlike"
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
      setLoadingDetail(false);
    },
    onError: (err) => {
      toast.error(err.response?.data);
      console.log("Mutation Error", err);
    },
  });

  const handleSubmit = () => {
    setLoading(true);
    if (
      whichTypeQuestion === "agree/disagree" ||
      whichTypeQuestion === "yes/no" ||
      whichTypeQuestion === "like/unlike"
    ) {
      const { selected, contended } = extractSelectedAndContended(
        whichTypeQuestion === "agree/disagree"
          ? quests.agreeDisagree
          : whichTypeQuestion === "yes/no"
            ? quests.yesNo
            : quests.likeUnlike,
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
        uuid: Cookies.get("uId"),
      };

      // if (!(params.answer.selected && params.answer.contended)) {
      if (!params.answer.selected) {
        toast.warning("You cannot submit without answering");
        setLoading(false);
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
          setLoading(false);
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
          setLoading(false);
        } else {
          const params = {
            questId: id,
            answer: dataToSend,
            uuid: Cookies.get("uId"),
          };
          console.log("params", params);
          changeAnswer(params);
        }
      } else {
        const params = {
          questId: id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: Cookies.get("uId"),
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
    } else if (whichTypeQuestion === "ranked choise") {
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
          setLoading(false);
        } else {
          const params = {
            questId: id,
            answer: dataToSend,
            uuid: Cookies.get("uId"),
          };
          console.log("params", params);
          changeAnswer(params);
        }
      } else {
        const params = {
          questId: id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: Cookies.get("uId"),
        };
        console.log("params", params);

        startQuest(params);
      }
    }
    setLoadingDetail(false);
  };

  useEffect(() => {
    if (startStatus === "") {
      dispatch(resetQuests());
      setOpenResults(false);
      handleStartTest(id);
    }
    console.log({ startStatus });
    if (startStatus === "change answer") {
      setOpenResults(true);
      handleViewResults(id);
    }
    if (startStatus === "completed") {
      setOpenResults(true);
      handleViewResults(id);
    }
  }, []);

  console.log("hamza", viewResult, openResults);

  return (
    <div className="rounded-[12.3px] border-2 border-[#D9D9D9] bg-[#F3F3F3] tablet:rounded-[15px] dark:border-white dark:bg-[#141618]">
      <CardTopbar
        title={title}
        img={img}
        alt={alt}
        badgeCount={badgeCount}
        isBookmarked={isBookmarked}
        handleClickBookmark={handleBookmark}
        bookmarkStatus={bookmarkStatus}
        createdBy={createdBy}
        QuestTopic={QuestTopic}
      />
      <div className="ml-6 mr-[1.38rem] mt-[1.56rem] flex items-center justify-between tablet:ml-[52.65px]">
        <h1 className="text-[11.83px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[25px] dark:text-[#B8B8B8]">
          {question?.endsWith("?") ? "Q." : "S."} {question}
        </h1>
        <div
          className="pl-[21.72px]"
          onClick={() => handleBookmark(isBookmarked)}
        >
          {bookmarkStatus ? (
            persistedTheme !== "dark" ? (
              <img
                src="/assets/bookmark/bookmark.png"
                alt="save icon"
                className="h-[17px] w-[12.7px] cursor-pointer tablet:h-8 tablet:w-6"
              />
            ) : (
              <img
                src="/assets/bookmark/darkbookmark.png"
                alt="save icon"
                className="h-[17px] w-[12.7px] cursor-pointer tablet:h-8 tablet:w-6"
              />
            )
          ) : (
            <img
              src="/assets/bookmark/darkdisablebookmark.png"
              alt="save icon"
              className="h-[17px] w-[12.7px] cursor-pointer tablet:h-8 tablet:w-6"
            />
          )}
        </div>
      </div>
      {viewResult !== id && openResults !== true ? (
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
          expandedView={expandedView}
          viewResult={viewResult}
          setViewResult={setViewResult}
          openResults={openResults}
          setOpenResults={setOpenResults}
          startStatus={startStatus}
          usersChangeTheirAns={usersChangeTheirAns}
          lastInteractedAt={lastInteractedAt}
          howManyTimesAnsChanged={howManyTimesAnsChanged}
          loadingDetail={loadingDetail}
          loading={loading}
          setIsSubmit={setIsSubmit}
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
          addOptionField={addOptionField}
          setAnswerSelection={setAnswerSelection}
          rankedAnswers={rankedAnswers}
          setRankedAnswers={setRankedAnswers}
          viewResult={viewResult}
          handleViewResults={handleViewResults}
          startStatus={startStatus}
          expanded={expandedView}
          handleChange={handleChange}
          createdBy={createdBy}
          img={img}
          alt={alt}
          badgeCount={badgeCount}
          question={question}
          time={time}
          loading={loading}
        />
      )}
    </div>
  );
};

export default QuestionCardWithToggle;
