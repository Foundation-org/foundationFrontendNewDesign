import { useSelector } from "react-redux";
import { getQuests } from "../../../../../features/quest/questsSlice";
import { useQuery } from "@tanstack/react-query";
import { getStartQuestPercent } from "../../../../../api/questsApi";
import { getStartQuestInfo } from "../../../../../api/questsApi";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SingleAnswer from "../../../components/SingleAnswer";
import SingleAnswerMultipleChoice from "../../../components/SingleAnswerMultipleChoice";

const Result = (props) => {
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);

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
              true,
              false,
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
              false,
              true,
            );
          }
        }

        if (props.whichTypeQuestion === "multiple choise") {
          if (res?.data.data[res.data.data.length - 1].selected) {
            res?.data.data[res.data.data.length - 1].selected.map(
              (item, index) => {
                props.handleMultipleChoiceCC(
                  "Multiple Choice",
                  true,
                  false,
                  item.question,
                );
              },
            );
          }
          if (res?.data.data[res.data.data.length - 1].contended) {
            res?.data.data[res.data.data.length - 1].contended.map(
              (item, index) => {
                props.handleMultipleChoiceCC(
                  "Multiple Choice",
                  false,
                  true,
                  item.question,
                );
              },
            );
          }
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
      return await getStartQuestPercent(params);
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

  return (
    <div className="mt-[26px] flex flex-col gap-[10px]">
      {props.title === "Yes/No" || props.title === "Agree/Disagree" ? (
        <>
          {props.title === "Yes/No" ? (
            <>
              {console.log(ResultsData?.data[ResultsData?.data.length - 1])}
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
      ) : (
        props.answers?.map((item, index) => (
          <SingleAnswerMultipleChoice
            number={"#" + (index + 1)}
            answer={item.question}
            title={props.title}
            checkInfo={true}
            percentages={ResultsData?.data[ResultsData?.data.length - 1]}
            check={findLabelChecked(quests.multipleChoice, item.question)}
            contend={findLabelContend(quests.multipleChoice, item.question)}
            handleMultipleChoiceCC={props.handleMultipleChoiceCC}
            btnText={"Results"}
          />
        ))
      )}
      <div className="my-8 flex w-full justify-center">
        <button
          className={`${
            persistedTheme === "dark"
              ? "bg-[#333B46]"
              : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
          } inset-0 mr-[30px] w-[173px] rounded-[15px] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner dark:text-[#B6B6B6]`}
          onClick={() => handleSubmit()}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default Result;
