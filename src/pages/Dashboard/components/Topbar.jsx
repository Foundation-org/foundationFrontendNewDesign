import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Topbar = () => {
  const location = useLocation();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const navigate = useNavigate();

  return (
    <div
      className={`${persistedTheme === "dark"
        ? "bg-gray-600"
        : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
        } laptop:h-[90px] laptop:flex-row laptop:pb-0 flex h-24 w-full flex-col items-center justify-between pb-4 tablet:h-[116px] `}
    >
      {/* logo */}
      <div className="laptop:w-[18.25rem] laptop:justify-center laptop:px-0 laptop:py-0 flex w-full items-center justify-between px-[17px] py-2 tablet:min-w-[18.25rem] 5xl:w-[23rem] 5xl:min-w-[23rem]">
        <div className="laptop:hidden flex h-full items-center justify-center space-x-2">
          <div className="laptop:hidden relative block h-fit w-fit">
            <img
              src="/assets/svgs/dashboard/badge.svg"
              alt="badge"
              className="h-6 w-[19.8px] tablet:h-[51.5px] tablet:w-[42px]"
            />
            <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-white">
              5
            </p>
          </div>
          <div className="flex flex-col text-blue-100 ">
            <h3 className="dark:text-white  text-blue-300 font-inter text-[#E9F6FF] font-medium" onClick={()=>{navigate("/profile")}}>My Profile</h3>
            <h3 className="dark:text-white text-[#E9F6FF] font-inter text-[10.182px] font-small">Balance 0.5</h3>
          </div>


        </div>

        <img
          src="/assets/svgs/logo.svg"
          alt="logo"
          className="laptop:w-[5.75rem] w-[34.5px] tablet:w-[69.2px]"
        />
        <div className="laptop:hidden flex w-fit cursor-pointer items-center justify-center gap-[6px] text-[11.8px] font-semibold leading-normal text-white tablet:text-[21.4px]">
          <img
            src="/assets/svgs/dashboard/arrow-right-outline.svg"
            alt="arrow-right"
            className="h-[12.6px] w-[12.6px] tablet:h-[22.94px] tablet:w-[22.94px]"
          />
          Logout
        </div>
      </div>
      {/* items */}
      <ul className="laptop:gap-28 laptop:px-0 flex w-full items-end justify-around gap-16 px-5 text-[28px] font-semibold leading-normal text-[#DADADA] 2xl:text-[30px] tablet:px-[57px]">
        <li>
          <Link
            to={"/dashboard"}
            className={`laptop:gap-[10px] laptop:text-[30px] flex items-center gap-2 text-[14px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] ${location.pathname === "/dashboard" ? "text-white" : persistedTheme === "dark" ? "text-[#92959D]" : "text-[#BEDEF4]"
              }`}
          >
            {location.pathname === "/dashboard" &&
              (persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/home.svg"
                  alt="home"
                  className="laptop:h-[27px] laptop:w-[27px] h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px]"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/home-white.svg"
                  alt="home-white"
                  className="laptop:h-auto laptop:w-auto h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px]"
                />
              ))}
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/quest"}
            className={`laptop:gap-[10px] laptop:text-[30px] flex items-center gap-2 text-[14px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] ${location.pathname === "/dashboard/quest" ? "text-white" : persistedTheme === "dark" ? "text-[#92959D]" : "text-[#BEDEF4]"
              }`}
          >
            {location.pathname === "/dashboard/quest" && (
              <img
                src="/assets/svgs/dashboard/quest.svg"
                alt="quest"
                className="laptop:h-auto laptop:w-auto h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px]"
              />
            )}
            Quests
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/bookmark"}
            className={`laptop:gap-[10px] laptop:text-[30px] flex items-center gap-2 text-[14px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] ${location.pathname === "/dashboard/bookmark" ? "text-white" : persistedTheme === "dark" ? "text-[#92959D]" : "text-[#BEDEF4]"
              }`}
          >
            {location.pathname === "/dashboard/bookmark" && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
                className="laptop:h-auto laptop:w-auto h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px]"
              />
            )}
            Bookmarks
          </Link>
        </li>
      </ul>
      {/* logout btn */}
      <div className="laptop:flex hidden w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px]">
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
