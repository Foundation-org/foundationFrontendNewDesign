import { useState } from 'react';
import Navbar from './components/Navbar';
import YesNo from './pages/YesNo';
import AgreeDisagree from './pages/AgreeDisagree';
import MultipleChoice from './pages/MultipleChoice';
import RankChoice from './pages/RankChoice';

const Quest = () => {
  const [tab, setTab] = useState(0);

  const handleTab = (id) => setTab(id);

  return (
    <div className="bg-white h-[calc(100vh-96px)] w-full overflow-y-auto">
      <h1 className="text-[#616161] text-[30px] font-semibold leading-normal text-center mt-[50px] mb-[40px]">
        Quest Type
      </h1>
      <Navbar handleTab={handleTab} tab={tab} />
      {tab === 0 && <RankChoice />}
      {tab === 1 && <MultipleChoice />}
      {tab === 2 && <AgreeDisagree />}
      {tab === 3 && <YesNo />}
    </div>
  );
};

export default Quest;
