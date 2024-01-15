import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getStartQuestInfo } from "../../../../../services/api/questsApi";
import { resetQuests } from "../../../../../features/quest/questsSlice";
import {
  getButtonClassName,
  getButtonText,
} from "../../../../../utils/questionCard/SingleQuestCard";

const OptionBar = ({
  id,
  btnText,
  btnColor,
  handleStartTest,
  handleViewResults,
  answersSelection,
  setHowManyTimesAnsChanged,
  whichTypeQuestion,
  handleToggleCheck,
  setAnswerSelection,
  rankedAnswers,
  setRankedAnswers,
  startStatus,
  setLoadingDetail,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);

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
      setHowManyTimesAnsChanged(res.data.data.length);
      if (
        whichTypeQuestion === "agree/disagree" ||
        whichTypeQuestion === "yes/no" ||
        whichTypeQuestion === "like/dislike"
      ) {
        if (
          res?.data.data[res.data.data.length - 1].selected === "Agree" ||
          res?.data.data[res.data.data.length - 1].selected === "Yes" ||
          res?.data.data[res.data.data.length - 1].selected === "Like"
        ) {
          console.log("ran 1");
          handleToggleCheck(
            res.data.data[res.data.data.length - 1].selected,
            true,
            false,
          );
        }
        if (
          res?.data.data[res.data.data.length - 1].contended === "Agree" ||
          res?.data.data[res.data.data.length - 1].contended === "Yes" ||
          res?.data.data[res.data.data.length - 1].contended === "Like"
        ) {
          console.log("ran 2");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res?.data.data[res.data.data.length - 1].contended === "Disagree" ||
          res?.data.data[res.data.data.length - 1].contended === "No" ||
          res?.data.data[res.data.data.length - 1].contended === "Dislike"
        ) {
          console.log("ran 3");

          handleToggleCheck(
            res.data.data[res.data.data.length - 1].contended,
            false,
            true,
          );
        }
        if (
          res?.data.data[res.data.data.length - 1].selected === "Disagree" ||
          res?.data.data[res.data.data.length - 1].selected === "No" ||
          res?.data.data[res.data.data.length - 1].selected === "Dislike"
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
      setLoadingDetail(false);
    },
  });

  const handleStartChange = () => {
    if (btnText === "") {
      dispatch(resetQuests());
      handleStartTest(id);
    }
    if (btnText === "change answer") {
      setLoadingDetail(true);
      const data = { questForeignKey: id, uuid: persistedUserInfo?.uuid };
      getStartQuestDetail(data);
      handleStartTest(id);
    }
    if (btnText === "completed") {
      setLoadingDetail(true);
      handleViewResults(id);
    }
  };

  return (
    <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:mr-[30px] tablet:gap-10">
      {getButtonText(btnText) !== "Completed" ? (
        <button
          className={`${getButtonClassName(
            persistedTheme,
            btnText,
            btnColor,
          )} mt-[16.2px] h-[23.48px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-white tablet:mt-12 tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
          onClick={handleStartChange}
        >
          {getButtonText(btnText)}
        </button>
      ) : null}

      <button
        className={`${
          startStatus?.trim() !== ""
            ? "border-none bg-[#04AD66] text-white dark:bg-[#707175] dark:text-white"
            : "border-[#20D47E] dark:border-[#7C7C7C]"
        } mt-[16.2px] h-[23.48px] w-[81.8px] rounded-[7.1px] border-[1.42px] border-[#20D47E] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-[#20D47E] tablet:mt-12 tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:border-[3px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:border-[#7C7C7C] dark:text-[#C9C8C8]`}
        onClick={() => {
          if (btnText !== "") {
            handleViewResults(id);
          } else {
            toast.error("First give your response to see Results");
          }
        }}
      >
        Results
      </button>
    </div>
  );
};

export default OptionBar;
