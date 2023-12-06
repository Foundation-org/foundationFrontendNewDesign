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
      } tablet:flex-row tablet:items-end flex h-24 w-full flex-col items-center justify-between pb-4`}
    >
      {/* logo */}
      <div className="tablet:w-[18.25rem] tablet:min-w-[18.25rem] tablet:justify-center tablet:px-0 tablet:py-0 flex w-full justify-between px-[17px] py-2 5xl:w-[23rem] 5xl:min-w-[23rem]">
        <div className="tablet:hidden relative block h-fit w-fit">
          <img
            src="/assets/svgs/dashboard/badge.svg"
            alt="badge"
            className="h-6 w-[19.8px]"
          />
          <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-white">
            5
          </p>
        </div>
        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="tablet:w-[5.75rem] w-[34.5px]"
        />
        <div className="tablet:hidden flex w-fit cursor-pointer items-center justify-center gap-[6px] text-[11.8px] font-semibold leading-normal text-white">
          <img
            src="/assets/svgs/dashboard/arrow-right-outline.svg"
            alt="arrow-right"
            className="h-[12.6px] w-[12.6px]"
          />
          Logout
        </div>
      </div>
      {/* items */}
      <ul className="tablet:gap-28 tablet:px-0 flex items-end gap-16 px-5 text-[28px] font-semibold leading-normal text-[#DADADA] 2xl:text-[30px]">
        <li>
          <Link
            to={"/dashboard"}
            className={`tablet:gap-[10px] tablet:text-[30px] flex items-center gap-2 text-[14px] font-semibold ${
              location.pathname === "/dashboard" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard" &&
              (persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/home.svg"
                  alt="home"
                  className="tablet:h-auto tablet:w-auto h-3 w-3"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/home-white.svg"
                  alt="home-white"
                  className="tablet:h-auto tablet:w-auto h-3 w-3"
                />
              ))}
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/quest"}
            className={`tablet:text-[30px] flex items-center gap-[10px] text-[14px] font-semibold ${
              location.pathname === "/dashboard/quest" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard/quest" && (
              <img
                src="/assets/svgs/dashboard/quest.svg"
                alt="quest"
                className="tablet:h-auto tablet:w-auto h-3 w-3"
              />
            )}
            Quests
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/bookmark"}
            className={`tablet:text-[30px] flex items-center gap-[10px] text-[14px] font-semibold ${
              location.pathname === "/dashboard/bookmark" ? "text-white" : ""
            }`}
          >
            {location.pathname === "/dashboard/bookmark" && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
                className="tablet:h-auto tablet:w-auto h-3 w-3"
              />
            )}
            Bookmarks
          </Link>
        </li>
      </ul>
      {/* logout btn */}
      <div className="tablet:flex hidden w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px]">
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
