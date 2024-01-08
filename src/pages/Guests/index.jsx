import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuestById } from "../../api/homepageApis";
import Topbar from "../Dashboard/components/Topbar";
import SidebarRight from "../Dashboard/components/SidebarRight";
import QuestionCard from "./components/QuestionCard";

const Guests = () => {
  let { id } = useParams();
  const [tab, setTab] = useState("Participate");
  const [viewResult, setViewResult] = useState(null);

  const { data: singleQuest } = useQuery({
    queryFn: async () => {
      const result = await getQuestById(id);
      return result.data.data;
    },
    queryKey: [id],
    staleTime: 0,
  });

  function getQuestionTitle(whichTypeQuestion) {
    switch (whichTypeQuestion) {
      case "agree/disagree":
        return "Agree/Disagree";
      case "multiple choise":
        return "Multiple Choice";
      case "ranked choise":
        return "Ranked Choice";
      case "yes/no":
        return "Yes/No";
      default:
        return null;
    }
  }

  const handleViewResults = (testId) => {
    setStartTest(null);
    setViewResult((prev) => (prev === testId ? null : testId));
  };

  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100vh-90px)] bg-white dark:bg-[#0A0A0C]">
        <div className="quest-scrollbar w-full overflow-y-auto py-7 tablet:py-[3.81rem]">
          <div className="mb-7 flex justify-center gap-5 tablet:mb-[3.81rem] tablet:gap-[5.69rem]">
            <button
              className="w-[81.8px] rounded-[7.1px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:w-[250px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[23.63px]"
              onClick={() => setTab("Participate")}
            >
              Participate
            </button>
            <button
              className="w-[81.8px] rounded-[7.1px] bg-[#0FB063] px-[9.4px] py-1 text-[9.4px] font-semibold leading-normal text-white tablet:w-[250px] tablet:rounded-[15px] tablet:px-5 tablet:py-2 tablet:text-[23.63px]"
              onClick={() => setTab("Result")}
            >
              Result
            </button>
          </div>
          <div>
            <QuestionCard
              tab={tab}
              id={singleQuest?._id}
              img="/assets/svgs/dashboard/badge.svg"
              alt="badge"
              badgeCount="5"
              time={singleQuest?.createdAt}
              title={getQuestionTitle(singleQuest?.whichTypeQuestion)}
              question={singleQuest?.Question}
              answers={singleQuest?.QuestAnswers}
              usersAddTheirAns={singleQuest?.usersAddTheirAns}
              whichTypeQuestion={singleQuest?.whichTypeQuestion}
              btnText={singleQuest?.startStatus}
              startStatus={singleQuest?.startStatus}
              viewResult={viewResult}
              handleViewResults={handleViewResults}
              multipleOption={singleQuest?.userCanSelectMultiple}
              QuestTopic={singleQuest?.QuestTopic}
              createdBy={singleQuest?.uuid}
            />
          </div>
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default Guests;
