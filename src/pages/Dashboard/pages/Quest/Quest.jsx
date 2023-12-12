import { useState } from "react";
import Navbar from "./components/Navbar";
import YesNo from "./pages/YesNo";
import AgreeDisagree from "./pages/AgreeDisagree";
import MultipleChoice from "./pages/MultipleChoice";
import RankChoice from "./pages/RankChoice";

const Quest = () => {
  const [tab, setTab] = useState(0);

  const handleTab = (id) => setTab(id);

  return (
    <div className="laptop:h-[calc(100vh-96px)] h-[calc(100vh-96px)] w-full overflow-y-auto bg-white tablet:h-[calc(100vh-116px)] pt-[60px]">
      {/* <h1 className="laptop:mb-[40px] laptop:mt-[50px] laptop:text-[1.875rem] mb-[13.3px] mt-[15px] text-center text-[0.75rem] font-semibold leading-normal text-[#616161] tablet:mb-[19px] tablet:mt-[31px] tablet:text-[24.83px]">
        Quest Type
      </h1> */}
      <Navbar handleTab={handleTab} tab={tab} />
      {tab === 0 && <RankChoice />}
      {tab === 1 && <MultipleChoice />}
      {tab === 2 && <AgreeDisagree />}
      {tab === 3 && <YesNo />}
    </div>
  );
};

export default Quest;
