import React from "react";

const Topbar = () => {
  return (
    <div className="bg-gray-600 w-full h-24 pb-4 flex items-end justify-around">
      <img src="/assets/svgs/logo.svg" alt="logo" className="w-[5.75rem]" />
      <ul className="text-[#DADADA] text-[30px] font-semibold leading-normal flex gap-28">
        <li className="flex gap-6 items-center">
          <img src="/assets/svgs/dashboard/home.svg" alt="home" />
          Home
        </li>
        <li>Quests</li>
        <li>Bookmarks</li>
      </ul>
      <div className="flex gap-6 items-center text-[#DADADA] text-[30px] font-semibold leading-normal">
        <img
          src="/assets/svgs/dashboard/arrow-right-outline.svg"
          alt="arrow-right"
        />
        Logout
      </div>
    </div>
  );
};

export default Topbar;
