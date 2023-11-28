import { useSelector } from "react-redux";
import { getQuests } from "../../../../../features/quest/questsSlice";
import SingleAnswer from "../../../components/SingleAnswer";

const Result = (props) => {
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="mt-[26px] flex flex-col gap-[10px]">
      {props.title === "Yes/No" || props.title === "Agree/Disagree" ? (
        <>
          {props.title === "Yes/No" ? (
            <>
              <SingleAnswer
                number={"#1"}
                answer={"Yes"}
                checkInfo={true}
                check={quests.yesNo.yes.check}
                contend={quests.yesNo.yes.contend}
                handleToggleCheck={props.handleToggleCheck}
              />
              <SingleAnswer
                number={"#2"}
                answer={"No"}
                checkInfo={true}
                check={quests.yesNo.no.check}
                contend={quests.yesNo.no.contend}
                handleToggleCheck={props.handleToggleCheck}
              />
            </>
          ) : (
            <>
              <SingleAnswer
                number={"#1"}
                answer={"Agree"}
                checkInfo={true}
                check={quests.agreeDisagree.agree.check}
                contend={quests.agreeDisagree.agree.contend}
                handleToggleCheck={props.handleToggleCheck}
              />
              <SingleAnswer
                number={"#2"}
                answer={"Disagree"}
                checkInfo={true}
                check={quests.agreeDisagree.disagree.check}
                contend={quests.agreeDisagree.disagree.contend}
                handleToggleCheck={props.handleToggleCheck}
              />
            </>
          )}
        </>
      ) : (
        props.answers?.map((item, index) => (
          <SingleAnswer number={"#" + (index + 1)} answer={item.question} />
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
