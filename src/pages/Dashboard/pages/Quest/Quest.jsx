import { useState } from 'react';
import Navbar from './components/Navbar';
import YesNo from './pages/YesNo';
import AgreeDisagree from './pages/AgreeDisagree';
import LikeDislike from './pages/LikeDislikeQuest';
import MultipleChoice from './pages/MultipleChoice';
import RankChoice from './pages/RankChoice';
import OpenChoice from './pages/OpenChoice';

const Quest = () => {
  const [tab, setTab] = useState(0);

  const handleTab = (id) => setTab(id);

  return (
    <div className="w-full overflow-y-scroll bg-[#F2F3F5] pb-8 pt-5 md:pb-12 tablet:h-[calc(100vh-116px)] tablet:pt-[60px] laptop:h-[calc(100vh-70px)] dark:bg-[#242424]">
      <Navbar handleTab={handleTab} tab={tab} />
      {tab === 0 && <YesNo />}
      {tab === 1 && <MultipleChoice />}
      {tab === 2 && <RankChoice />}
      {tab === 5 && <OpenChoice />}
      {tab === 4 && <LikeDislike />}
      {tab === 3 && <AgreeDisagree />}
    </div>
  );
};

export default Quest;
