import { useState } from 'react';
// import Navbar from './components/Navbar';
import YesNo from './pages/YesNo';
import AgreeDisagree from './pages/AgreeDisagree';
import LikeDislike from './pages/LikeDislikeQuest';
import MultipleChoice from './pages/MultipleChoice';
import RankChoice from './pages/RankChoice';
import OpenChoice from './pages/OpenChoice';
import CreateSlider from './components/CreateSlider';

const Quest = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className="w-full bg-[#F2F3F5] pb-8 md:pb-12 tablet:h-[calc(100vh-96px)] laptop:h-[calc(100vh-70px)] dark:bg-[#242424]">
      {/* <Navbar handleTab={handleTab} tab={tab} /> */}
      <div className="fixed left-auto right-auto w-full max-w-full laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <CreateSlider setTab={setTab} tab={tab} />
      </div>
      <div className="no-scrollbar mt-10 h-[calc(100dvh-141.89px)] overflow-y-auto tablet:mx-6 tablet:mt-[77.63px] tablet:h-[calc(100dvh-173.63px)] laptop:h-[calc(100dvh-174px)]">
        {tab === 0 && <YesNo />}
        {tab === 1 && <MultipleChoice />}
        {tab === 2 && <RankChoice />}
        {tab === 5 && <OpenChoice />}
        {tab === 4 && <LikeDislike />}
        {tab === 3 && <AgreeDisagree />}
      </div>
    </div>
  );
};

export default Quest;
