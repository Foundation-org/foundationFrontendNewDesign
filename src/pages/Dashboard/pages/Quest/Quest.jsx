import { useState } from 'react';
import Navbar from './components/Navbar';
import YesNo from './pages/YesNo';
import AgreeDisagree from './pages/AgreeDisagree';
import LikeDislike from './pages/LikeDislikeQuest';
import MultipleChoice from './pages/MultipleChoice';
import RankChoice from './pages/RankChoice';

const Quest = () => {
  const [tab, setTab] = useState(0);

  const handleTab = (id) => setTab(id);

  return (
    <div className=" w-full overflow-y-auto bg-[#F3F3F3] pb-4 pt-[20px] dark:bg-[#242424] md:pb-1 tablet:h-[calc(100vh-116px)] tablet:pt-[60px] laptop:h-[calc(100vh-96px)]">
      <Navbar handleTab={handleTab} tab={tab} />
      {tab === 0 && <YesNo />}
      {tab === 1 && <MultipleChoice />}
      {tab === 2 && <RankChoice />}
      {tab === 4 && <LikeDislike />}
      {tab === 3 && <AgreeDisagree />}
    </div>
  );
};

export default Quest;
