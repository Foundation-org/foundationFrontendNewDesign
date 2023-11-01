import React from "react";
import QuestionCard from "../../../components/QuestionCard";

const Main = () => {
  return (
    <div className="bg-[#121213] w-full py-[25px] px-6 flex flex-col gap-16 h-[calc(100vh-96px)] overflow-y-auto no-scrollbar">
      <QuestionCard
        img="/assets/svgs/dashboard/badge.svg"
        alt="badge"
        badgeCount="5"
        title="Ranked Choice"
        question="Q. Technology is highly diverse and versatile?"
      />
      <QuestionCard
        img="/assets/svgs/dashboard/badge-g.svg"
        alt="badge"
        badgeCount="Me"
        title="Multiple Choice"
        question="Q. Technology is highly diverse and versatile?"
        correctAnswers={true}
      />
      <QuestionCard
        img="/assets/svgs/dashboard/badge.svg"
        alt="badge"
        badgeCount="5"
        title="Agree/Disagree"
        question="Q. Technology is highly diverse and versatile?"
      />
    </div>
  );
};

export default Main;
