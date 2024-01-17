import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { getQuests } from "../../../../../features/quest/questsSlice";
import { getStartQuestPercent } from "../../../../../services/api/questsApi";
import { getStartQuestInfo } from "../../../../../services/api/questsApi";
import { getRankedQuestPercent } from "../../../../../services/api/questsApi";

import SingleAnswer from "../../../../../components/question-card/options/SingleAnswer";
import SingleAnswerMultipleChoice from "../../../../../components/question-card/options/SingleAnswerMultipleChoice";
import RankedResult from "../../../components/RankedResult";
import Loader from "../../../../../components/ui/Loader";

const Result = (props) => {
  const { isFullScreen } = useParams();
  const quests = useSelector(getQuests);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [checkLoading, setCheckLoading] = useState(true);

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
    props.setAnswerSelection(answerSelectionArray);
  }

  useEffect(() => {
    const data = {
      questForeignKey: props.id,
      uuid: persistedUserInfo?.uuid,
    };

    getStartQuestDetail(data);
  }, []);

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      if (res.data) {
        if (
          props.whichTypeQuestion === "agree/disagree" ||
          props.whichTypeQuestion === "yes/no" ||
          props.whichTypeQuestion === "like/dislike"
        ) {
          props.setHowManyTimesAnsChanged(res?.data.data.length);
          if (
            res?.data.data[res.data.data.length - 1].selected === "Agree" ||
            res?.data.data[res.data.data.length - 1].selected === "Yes" ||
            res?.data.data[res.data.data.length - 1].selected === "Like"
          ) {
            console.log("ran 1");
            props.handleToggleCheck(
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

            props.handleToggleCheck(
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

            props.handleToggleCheck(
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

            props.handleToggleCheck(
              res.data.data[res.data.data.length - 1].selected,
              true,
              false,
            );
          }
        }

        if (props.whichTypeQuestion === "multiple choise") {
          updateAnswerSelection(
            res?.data.data[res.data.data.length - 1],
            props.answersSelection,
          );
        }
        if (props.whichTypeQuestion === "ranked choise") {
          const updatedRankedAnswers = res?.data.data[
            res.data.data.length - 1
          ].selected.map((item) => {
            const correspondingRankedAnswer = props.rankedAnswers.find(
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
          props.setRankedAnswers(filteredRankedAnswers);
        }
      }
      setCheckLoading(false);
    },
    onError: (err) => {
      toast.error(err.response?.data);
      console.log("Mutation Error", err);
    },
  });

  const { data: ResultsData } = useQuery({
    queryFn: async () => {
      const params = {
        questForeignKey: props.id,
        uuid: persistedUserInfo?.uuid,
      };
      if (props.whichTypeQuestion === "ranked choise") {
        return await getRankedQuestPercent(params);
      } else {
        return await getStartQuestPercent(params);
      }
    },
    queryKey: ["ResultsData", props.id],
  });

  function findLabelChecked(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    if (labelFound[0]?.check === true) {
      return true;
    } else {
      return false;
    }
  }

  function findLabelContend(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    if (labelFound[0]?.contend === true) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-[5.7px]">
      {props.title === "Yes/No" ||
      props.title === "Agree/Disagree" ||
      props.title === "Like/Dislike" ? (
        <>
          {props.title === "Yes/No" ? (
            checkLoading === true || ResultsData === undefined ? (
              <Loader />
            ) : (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Yes"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.yesNo.yes.check}
                  contend={quests.yesNo.yes.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"No"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.yesNo.no.check}
                  contend={quests.yesNo.no.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
              </>
            )
          ) : props.title === "Agree/Disagree" ? (
            checkLoading === true || ResultsData === undefined ? (
              <Loader />
            ) : (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Agree"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.agreeDisagree.agree.check}
                  contend={quests.agreeDisagree.agree.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"Disagree"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.agreeDisagree.disagree.check}
                  contend={quests.agreeDisagree.disagree.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
              </>
            )
          ) : props.title === "Like/Dislike" ? (
            checkLoading === true || ResultsData === undefined ? (
              <Loader />
            ) : (
              <>
                <SingleAnswer
                  number={"#1"}
                  answer={"Like"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.likeDislike.like.check}
                  contend={quests.likeDislike.like.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
                <SingleAnswer
                  number={"#2"}
                  answer={"Dislike"}
                  checkInfo={true}
                  percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                  check={quests.likeDislike.dislike.check}
                  contend={quests.likeDislike.dislike.contend}
                  handleToggleCheck={props.handleToggleCheck}
                  btnText={"Results"}
                />
              </>
            )
          ) : null}
        </>
      ) : props.title === "Multiple Choice" ? (
        checkLoading === true || ResultsData === undefined ? (
          <Loader />
        ) : (
          <div
            className={`${
              isFullScreen === undefined
                ? "quest-scrollbar max-h-[187px] min-h-fit overflow-auto md:max-h-[366px]"
                : ""
            }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
          >
            {props.answers?.map((item, index) => (
              <SingleAnswerMultipleChoice
                number={"#" + (index + 1)}
                answer={item.question}
                addedAnswerUuid={item.uuid}
                title={props.title}
                checkInfo={true}
                percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                check={findLabelChecked(props.answersSelection, item.question)}
                contend={findLabelContend(
                  props.answersSelection,
                  item.question,
                )}
                btnText={"Results"}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
              />
            ))}
          </div>
        )
      ) : props.title === "Ranked Choice" ? (
        checkLoading === true || ResultsData === undefined ? (
          <Loader />
        ) : (
          <div
            className={`${
              isFullScreen === undefined
                ? "quest-scrollbar max-h-[187px] min-h-fit overflow-auto md:max-h-[366px]"
                : ""
            }  mr-1 flex flex-col gap-[5.7px] tablet:gap-[10px]`}
          >
            {props.rankedAnswers?.map((item, index) => (
              <RankedResult
                number={"#" + (index + 1)}
                answer={item.label}
                addedAnswerUuid={item.uuid}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                title={props.title}
                percentages={ResultsData?.data[ResultsData?.data.length - 1]}
                checkInfo={false}
                setAddOptionLimit={props.setAddOptionLimit}
                btnText={"Results"}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
};

export default Result;
