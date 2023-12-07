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
      } tablet:h-[116px] flex h-24 w-full flex-col items-center justify-between pb-4 xl:flex-row xl:items-end`}
    >
      {/* logo */}
      <div className="tablet:min-w-[18.25rem] flex w-full items-center justify-between px-[17px] py-2 xl:w-[18.25rem] xl:justify-center xl:px-0 xl:py-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
        <div className="relative block h-fit w-fit xl:hidden">
          <img
            src="/assets/svgs/dashboard/badge.svg"
            alt="badge"
            className="tablet:w-[42px] tablet:h-[51.5px] h-6 w-[19.8px]"
          />
          <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-white">
            5
          </p>
        </div>
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="tablet:w-[69.2px] w-[34.5px] xl:w-[5.75rem]"
        />
        <div className="tablet:text-[21.4px] flex w-fit cursor-pointer items-center justify-center gap-[6px] text-[11.8px] font-semibold leading-normal text-white xl:hidden">
          <img
            src="/assets/svgs/dashboard/arrow-right-outline.svg"
            alt="arrow-right"
            className="tablet:h-[22.94px] tablet:w-[22.94px] h-[12.6px] w-[12.6px]"
          />
          Logout
        </div>
      </div>
      {/* items */}
      <ul className="tablet:px-[57px] flex w-full items-end justify-between gap-16 px-5 text-[28px] font-semibold leading-normal text-[#DADADA] xl:gap-28 xl:px-0 2xl:text-[30px]">
        <li>
          <Link
            to={"/dashboard"}
            className={`tablet:gap-[13.6px] tablet:text-[23.9px] flex items-center gap-2 text-[14px] font-semibold xl:gap-[10px] xl:text-[30px] ${
              location.pathname === "/dashboard" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard" &&
              (persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/home.svg"
                  alt="home"
                  className="tablet:w-[20.5px] tablet:h-[20.5px] h-3 w-3 xl:h-auto xl:w-auto"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/home-white.svg"
                  alt="home-white"
                  className="tablet:w-[20.5px] tablet:h-[20.5px] h-3 w-3 xl:h-auto xl:w-auto"
                />
              ))}
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/quest"}
            className={`tablet:gap-[13.6px] tablet:text-[23.9px] flex items-center gap-2 text-[14px] font-semibold xl:gap-[10px] xl:text-[30px] ${
              location.pathname === "/dashboard/quest" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard/quest" && (
              <img
                src="/assets/svgs/dashboard/quest.svg"
                alt="quest"
                className="tablet:w-[20.5px] tablet:h-[20.5px] h-3 w-3 xl:h-auto xl:w-auto"
              />
            )}
            Quests
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/bookmark"}
            className={`tablet:gap-[13.6px] tablet:text-[23.9px] flex items-center gap-2 text-[14px] font-semibold xl:gap-[10px] xl:text-[30px] ${
              location.pathname === "/dashboard/bookmark" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard/bookmark" && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
                className="tablet:w-[20.5px] tablet:h-[20.5px] h-3 w-3 xl:h-auto xl:w-auto"
              />
            )}
            Bookmarks
          </Link>
        </li>
      </ul>
      {/* logout btn */}
      <div className="hidden w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white xl:flex 2xl:w-[25rem] 2xl:text-[30px]">
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
