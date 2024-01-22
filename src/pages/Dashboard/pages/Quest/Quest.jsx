import { useState } from "react";
import Navbar from "./components/Navbar";
import YesNo from "./pages/YesNo";
import AgreeDisagree from "./pages/AgreeDisagree";
import LikeDislike from "./pages/LikeDislikeQuest";
import MultipleChoice from "./pages/MultipleChoice";
import RankChoice from "./pages/RankChoice";

const Quest = () => {
  const [tab, setTab] = useState(0);

  const handleTab = (id) => setTab(id);

  return (
    <div className="h-[calc(100vh-96px)] w-full overflow-y-auto bg-white py-[20px] dark:bg-[#0A0A0C] tablet:h-[calc(100vh-116px)] tablet:py-[60px] laptop:h-[calc(100vh-96px)]">
      <Navbar handleTab={handleTab} tab={tab} />
      {tab === 0 && <RankChoice />}
      {tab === 1 && <MultipleChoice />}
      {tab === 2 && <AgreeDisagree />}
      {tab === 3 && <YesNo />}
      {tab === 4 && <LikeDislike />}
    </div>
  );
};

export default Quest;
