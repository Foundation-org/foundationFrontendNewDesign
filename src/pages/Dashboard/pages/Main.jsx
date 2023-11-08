import QuestionCard from '../../../components/QuestionCard';

const Main = () => {
  return (
    <div className="bg-[#FCFCFD] dark:bg-[#06070a] shadow-inner-md w-full py-[27px] pl-6 pr-[23px] flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <QuestionCard
        id={1}
        img="/assets/svgs/dashboard/badge.svg"
        alt="badge"
        badgeCount="5"
        title="Ranked Choice"
        question="Q. Technology is highly diverse and versatile?"
        btnColor={'bg-[#BB9D02]'}
        btnText={'Change'}
        isBookmarked={false}
      />
      <QuestionCard
        id={2}
        img="/assets/svgs/dashboard/badge-g.svg"
        alt="badge"
        badgeCount="Me"
        title="Multiple Choice"
        question="Q. Technology is highly diverse and versatile?"
        correctAnswers={true}
        btnColor={'bg-[#148339]'}
        btnText={'Correct'}
        isBookmarked={true}
      />
      <QuestionCard
        id={3}
        img="/assets/svgs/dashboard/badge.svg"
        alt="badge"
        badgeCount="5"
        title="Agree/Disagree"
        question="Q. Technology is highly diverse and versatile?"
        btnColor={'bg-[#C13232]'}
        btnText={'Incorrect'}
        isBookmarked={false}
      />
    </div>
  );
};

export default Main;
