import React from "react";
import SidebarLeft from "./Dashboard/components/SidebarLeft";
import SidebarRight from "./Dashboard/components/SidebarRight";
import QuestCard from "../components/QuestCard";
import Topbar from "./Dashboard/components/Topbar";

const Test = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col justify-between bg-white laptop:flex-row dark:bg-black">
        <SidebarLeft />
        <div className="w-full px-[1.13rem] pt-[0.63rem] tablet:pt-[0.94rem]">
          <QuestCard />
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default Test;
