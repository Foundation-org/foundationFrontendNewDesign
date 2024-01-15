import React from "react";
import SidebarLeft from "./Dashboard/components/SidebarLeft";
import SidebarRight from "./Dashboard/components/SidebarRight";
import QuestCard from "../components/QuestCard";
import Topbar from "./Dashboard/components/Topbar";

const Test = () => {
  return (
    <>
      <Topbar />
      <div className="flex flex-col justify-center bg-white laptop:flex-row dark:bg-black">
        <SidebarLeft />
        <div className="no-scrollbar flex h-[calc(100vh-92px)] flex-col gap-[0.94rem] overflow-y-auto px-[1.13rem] py-[0.63rem] tablet:min-h-[calc(100vh-92px)] tablet:py-[0.94rem]">
          <QuestCard />
          <QuestCard />
          <QuestCard />
          <QuestCard />
          <QuestCard />
          <QuestCard />
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

export default Test;
