import React from 'react';
import QuestionCard from '../../../components/QuestionCard';

const Bookmark = () => {
  return (
    <div className="bg-[#FCFCFD] dark:bg-[#121213] w-full py-[27px] px-6 flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <QuestionCard
        img="/assets/svgs/dashboard/badge.svg"
        alt="badge"
        badgeCount="5"
        title="Ranked Choice"
        question="Q. Technology is highly diverse and versatile?"
        isBookmarked={true}
        btnText={'Change'}
      />
      <QuestionCard
        img="/assets/svgs/dashboard/badge-g.svg"
        alt="badge"
        badgeCount="Me"
        title="Multiple Choice"
        question="Q. Technology is highly diverse and versatile?"
        correctAnswers={true}
        isBookmarked={true}
        btnText={'Change'}
      />
      <QuestionCard
        img="/assets/svgs/dashboard/badge.svg"
        alt="badge"
        badgeCount="5"
        title="Agree/Disagree"
        question="Q. Technology is highly diverse and versatile?"
        isBookmarked={true}
        btnText={'Change'}
      />
    </div>
  );
};

export default Bookmark;
