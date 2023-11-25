import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        persistedTheme === "dark"
          ? "bg-gray-600"
          : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
      } w-full h-24 pb-4 flex items-end justify-between`}
    >
      <div className="w-[18.25rem] min-w-[18.25rem] 5xl:w-[23rem] 5xl:min-w-[23rem] flex justify-center">
        <img src="/assets/svgs/logo.svg" alt="logo" className="w-[5.75rem]" />
      </div>
      <ul className="text-[#DADADA] text-[28px] 2xl:text-[30px] font-semibold leading-normal flex items-end gap-28">
        <li>
          <Link
            to={"/dashboard"}
            className={`flex gap-[10px] items-center ${
              location.pathname === "/dashboard" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard" &&
              (persistedTheme === "dark" ? (
                <img src="/assets/svgs/dashboard/home.svg" alt="home" />
              ) : (
                <img
                  src="/assets/svgs/dashboard/home-white.svg"
                  alt="home-white"
                />
              ))}
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/quest"}
            className={`flex gap-[10px] items-center ${
              location.pathname === "/dashboard/quest" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard/quest" && (
              <img src="/assets/svgs/dashboard/quest.svg" alt="quest" />
            )}
            Quests
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/bookmark"}
            className={`flex gap-[10px] items-center ${
              location.pathname === "/dashboard/bookmark" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard/bookmark" && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
              />
            )}
            Bookmarks
          </Link>
        </li>
      </ul>
      <div className="flex gap-6 items-center justify-center text-white text-[28px] 2xl:text-[30px] font-semibold leading-normal cursor-pointer min-w-[23rem] w-[23rem] 2xl:w-[25rem]">
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
