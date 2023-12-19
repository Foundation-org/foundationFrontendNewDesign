import { useSelector } from "react-redux";
import { getQuests } from "../../../../../features/quest/questsSlice";
import { useQuery } from "@tanstack/react-query";
import { getStartQuestPercent } from "../../../../../api/questsApi";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { getRankedQuestPercent } from "../../../../../api/questsApi";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SingleAnswer from "../../../components/SingleAnswer";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";
import RankedResult from "../../../components/RankedResult";

const Result = (props) => {
  const quests = useSelector(getQuests);
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
    props.setAnswerSelection(answerSelectionArray);
  }

  useEffect(() => {
    const data = {
      questForeignKey: props.id,
      uuid: localStorage.getItem("uId"),
    };
    getStartQuestDetail(data);
  }, []);

  const { mutateAsync: getStartQuestDetail } = useMutation({
    mutationFn: getStartQuestInfo,
    onSuccess: (res) => {
      // console.log(res?.data?.data);
      // console.log(props.whichTypeQuestion);
      if (res.data) {
        if (
          props.whichTypeQuestion === "agree/disagree" ||
          props.whichTypeQuestion === "yes/no"
        ) {
          props.setHowManyTimesAnsChanged(res?.data.data.length);
          if (
            res?.data.data[res.data.data.length - 1].selected === "Agree" ||
            res?.data.data[res.data.data.length - 1].selected === "Yes"
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
            res?.data.data[res.data.data.length - 1].contended === "Yes"
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
            res?.data.data[res.data.data.length - 1].contended === "No"
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
            res?.data.data[res.data.data.length - 1].selected === "No"
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
          console.log(
            "ranked response" +
              res?.data.data[res.data.data.length - 1].selected,
          );

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
        uuid: localStorage.getItem("uId"),
      };
      if (props.whichTypeQuestion === "ranked choise") {
        return await getRankedQuestPercent(params);
      } else {
        return await getStartQuestPercent(params);
      }
    },
    queryKey: ["ResultsData"],
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

  console.log(props);

  return (
    <div className="mt-[26px] flex flex-col gap-[10px]">
      {console.log(props.title)}
      {props.title === "Yes/No" || props.title === "Agree/Disagree" ? (
        <>
          {props.title === "Yes/No" ? (
            <>
              {/* {console.log(ResultsData?.data[ResultsData?.data.length - 1])} */}
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
          ) : props.title === "Agree/Disagree" ? (
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
          ) : null}
        </>
      ) : props.title === "Multiple Choice" ? (
        props.answers?.map((item, index) => (
          <SingleAnswerMultipleChoice
            number={"#" + (index + 1)}
            answer={item.question}
            title={props.title}
            checkInfo={true}
            percentages={ResultsData?.data[ResultsData?.data.length - 1]}
            check={findLabelChecked(props.answersSelection, item.question)}
            contend={findLabelContend(props.answersSelection, item.question)}
            btnText={"Results"}
            answersSelection={props.answersSelection}
            setAnswerSelection={props.setAnswerSelection}
          />
        ))
      ) : props.title === "Ranked Choice" ? (
        props.rankedAnswers?.map((item, index) => (
          <RankedResult
            number={"#" + (index + 1)}
            answer={item.label}
            answersSelection={props.answersSelection}
            setAnswerSelection={props.setAnswerSelection}
            title={props.title}
            percentages={ResultsData?.data[ResultsData?.data.length - 1]}
            checkInfo={false}
            setAddOptionLimit={props.setAddOptionLimit}
            btnText={"Results"}
          />
        ))
      ) : (
        <></>
      )}
      <div className="my-8 flex justify-end">
        <button
          className={`${
            persistedTheme === "dark"
              ? "bg-[#333B46]"
              : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
          } inset-0 mr-[14px] w-[81.8px] rounded-[7.1px] px-[9.4px] py-[3.7px] text-[9.4px] font-semibold leading-normal text-[#FFF] shadow-inner dark:text-[#B6B6B6] tablet:mr-[30px] tablet:w-[173px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[20px]`}
          onClick={() => {
            props.handleViewResults(null);
          }}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default Result;
