import { useSelector } from "react-redux";
import { calculateRemainingTime } from "../../../../../utils";
import { getQuests } from "../../../../../features/quest/questsSlice";
import { useQuery } from "@tanstack/react-query";
import { getStartQuestPercent } from "../../../../../services/api/questsApi";
import { getStartQuestInfo } from "../../../../../services/api/questsApi";
import { getRankedQuestPercent } from "../../../../../services/api/questsApi";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SingleAnswer from "../../../components/SingleAnswer";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
import RankedResult from "../../../components/RankedResult";
import { useNavigate, useParams } from "react-router-dom";
import { MdFullscreen } from "react-icons/md";
import QuestTimeRemaining from "./QuestTimeRemaining";
import Loader from "../../../../../components/ui/Loader";

const Result = (props) => {
  const navigate = useNavigate();
  const { isFullScreen } = useParams();
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);
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
    <>
      <div className="mx-1 mt-[23.7px] flex flex-col gap-[5.7px] tablet:mt-[53px] tablet:gap-[10px] ">
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
                    percentages={
                      ResultsData?.data[ResultsData?.data.length - 1]
                    }
                    check={quests.yesNo.yes.check}
                    contend={quests.yesNo.yes.contend}
                    handleToggleCheck={props.handleToggleCheck}
                    btnText={"Results"}
                  />
                  <SingleAnswer
                    number={"#2"}
                    answer={"No"}
                    checkInfo={true}
                    percentages={
                      ResultsData?.data[ResultsData?.data.length - 1]
                    }
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
                    percentages={
                      ResultsData?.data[ResultsData?.data.length - 1]
                    }
                    check={quests.agreeDisagree.agree.check}
                    contend={quests.agreeDisagree.agree.contend}
                    handleToggleCheck={props.handleToggleCheck}
                    btnText={"Results"}
                  />
                  <SingleAnswer
                    number={"#2"}
                    answer={"Disagree"}
                    checkInfo={true}
                    percentages={
                      ResultsData?.data[ResultsData?.data.length - 1]
                    }
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
                    percentages={
                      ResultsData?.data[ResultsData?.data.length - 1]
                    }
                    check={quests.likeDislike.like.check}
                    contend={quests.likeDislike.like.contend}
                    handleToggleCheck={props.handleToggleCheck}
                    btnText={"Results"}
                  />
                  <SingleAnswer
                    number={"#2"}
                    answer={"Dislike"}
                    checkInfo={true}
                    percentages={
                      ResultsData?.data[ResultsData?.data.length - 1]
                    }
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
                  check={findLabelChecked(
                    props.answersSelection,
                    item.question,
                  )}
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

      {props.expanded && props.btnText === "change answer" ? (
        <div className="mr-[22px] mt-[15px] flex items-center justify-between tablet:mr-[48px]">
          <QuestTimeRemaining
            lastInteractedAt={props.lastInteractedAt}
            howManyTimesAnsChanged={props.howManyTimesAnsChanged}
            usersChangeTheirAns={props.usersChangeTheirAns}
          />
          {(isFullScreen === undefined && props.answersSelection?.length > 6) ||
          (isFullScreen === undefined && props.rankedAnswers?.length > 6) ? (
            <div
              className="flex cursor-pointer items-center justify-end gap-1 text-[#435059] tablet:gap-[10.48px] dark:text-[#ACACAC] "
              onClick={() => {
                navigate(`/quest/${props.id}/isfullscreen`);
              }}
            >
              <MdFullscreen className="text-[17px] tablet:text-[32px]" />
              <p className="text-[9px] font-medium tablet:text-[16px] ">
                Full Screen
              </p>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        props.expanded &&
        props.btnText === "completed" && (
          <div className="mr-[22px] mt-[15px] flex items-center justify-between tablet:mr-[48px]">
            <QuestTimeRemaining
              lastInteractedAt={props.lastInteractedAt}
              howManyTimesAnsChanged={props.howManyTimesAnsChanged}
              usersChangeTheirAns={props.usersChangeTheirAns}
            />
          </div>
        )
      )}

      {props.expanded && props.btnText === "change answer" ? (
        <div className="mt-2.5 flex justify-end tablet:mt-8">
          <button
            className={`inset-0 mr-[14.4px] h-[23.48px] w-[81.8px] rounded-[7.1px] ${
              calculateRemainingTime() === ", you are good to go!"
                ? "bg-[#FDD503] text-white dark:bg-[#BB9D02]"
                : "bg-[#7E6C01] text-[#CCCCCC]"
            } px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal  shadow-inner tablet:mr-[30px] tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] `}
            onClick={() => {
              props.handleChange(props.id);
            }}
          >
            Change
          </button>
        </div>
      ) : (props.expanded && props.btnText !== "completed") ||
        !props.expanded ? (
        <div className="mt-4 flex justify-end tablet:mt-10">
          <button
            className={`${
              persistedTheme === "dark"
                ? "bg-[#F4F4F4] text-[#707175]"
                : "bg-[#707175] text-white"
            } inset-0 mr-[14px] h-[23.48px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-[#FFF] shadow-inner tablet:mr-[30px] tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] dark:text-[#B6B6B6]`}
            onClick={() => {
              props.handleViewResults(null);
            }}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="mt-4 flex justify-end tablet:mt-10">
          <div
            className={`inset-0 mr-[14px] h-[23.48px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px]  tablet:mr-[30px] tablet:h-[52px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px] `}
          ></div>
        </div>
      )}
    </>
  );
};

export default Result;
