import React from "react";
import QuestionCard from "../pages/Main/components/QuestionCard";

const Main = () => {
  return (
    <div className="no-scrollbar flex h-[calc(100vh-96px)] w-full flex-col gap-16 overflow-y-auto bg-[#06070A] px-6 py-[25px]">
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
