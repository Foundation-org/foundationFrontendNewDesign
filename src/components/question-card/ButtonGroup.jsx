import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getStartQuestInfo } from "../../services/api/questsApi";
import { resetQuests } from "../../features/quest/questsSlice";
import {
  getButtonText,
  getButtonVariants,
} from "../../utils/questionCard/SingleQuestCard";
import { Button } from "../ui/Button";
import { FaSpinner } from "react-icons/fa";

import * as questUtilsActions from "../../features/quest/utilsSlice";

const ButtonGroup = ({
  usersAddTheirAns,
  title,
  id,
  btnText,
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
  answers,
  handleOpen,
  expandedView,
  setStartTest,
  viewResult,
  openResults,
  setViewResult,
  setOpenResults,
  handleSubmit,
  loading,
  addOptionField,
  questStartData,
  startTest,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const getQuestUtilsState = useSelector(questUtilsActions.getQuestUtils);
  const uuidExists =
    answers &&
    answers?.some(
      (item) =>
        item.uuid === persistedUserInfo?.uuid || localStorage.getItem("uId"),
    );

  console.log("getQuestUtilsState", getQuestUtilsState);
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
    dispatch(questUtilsActions.resetaddOptionLimit());
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

  if (startTest === questStartData._id) {
    return (
      <div className="flex w-full justify-between gap-2 pl-7 pr-[0.87rem] tablet:gap-[0.75rem] tablet:pl-[3.19rem] tablet:pr-[3.44rem]">
        {/* Add Options */}
        {getQuestUtilsState.addOptionLimit === 0 ? (
          <div className="flex items-center justify-center">
            {usersAddTheirAns && uuidExists === false ? (
              <div>
                {title === "Yes/No" ||
                title === "Agree/Disagree" ||
                title === "Like/Dislike" ? null : (
                  <Button onClick={handleOpen} variant={"addOption"}>
                    {persistedTheme === "dark" ? (
                      <img
                        src="/assets/svgs/dashboard/add-dark.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    ) : (
                      <img
                        src="/assets/svgs/dashboard/add.svg"
                        alt="add"
                        className="h-[7.398px] w-[7.398px] tablet:h-[15.6px] tablet:w-[15.6px]"
                      />
                    )}
                    Add Option
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div></div>
        )}

        {/* Go back / Submit */}
        <div
          className={`${
            title === "Multiple Choice"
              ? ""
              : addOptionField === 1
                ? "mt-[4rem] tablet:mt-[10rem]"
                : ""
          }`}
        >
          <div className="flex gap-[0.69rem] tablet:gap-[0.75rem]">
            {!expandedView ? (
              <Button
                variant="cancel"
                onClick={() => {
                  setStartTest(null);
                }}
              >
                Go Back
              </Button>
            ) : null}
            {startStatus === "change answer" &&
              viewResult === null &&
              openResults === false && (
                <Button
                  variant="cancel"
                  onClick={() => {
                    setViewResult(id);
                    setOpenResults(true);
                  }}
                >
                  Go Back
                </Button>
              )}
            <Button
              variant="submit"
              onClick={() => handleSubmit()}
              disabled={loading === true ? true : false}
            >
              {loading === true ? (
                <FaSpinner className="animate-spin text-[#EAEAEA]" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-end gap-2 pr-[14.4px] tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
      {/* Start / Change */}
      {getButtonText(btnText) !== "Completed" ? (
        <Button
          variant={getButtonVariants(btnText)}
          onClick={handleStartChange}
        >
          {getButtonText(btnText)}
        </Button>
      ) : null}

      {/* Result / Result Outline */}
      <Button
        variant={startStatus?.trim() !== "" ? "result" : "result-outline"}
        onClick={() => {
          if (btnText !== "") {
            handleViewResults(id);
          } else {
            toast.error("First give your response to see Results");
          }
        }}
      >
        Results
      </Button>
    </div>
  );
};

export default ButtonGroup;
