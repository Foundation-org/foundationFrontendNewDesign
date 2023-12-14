import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/Axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
      const res = await api.post(`user/logout/${localStorage.getItem("uId")}`);
      if(res.status === 200) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]); 
    }
  }

  return (
    <div
      className={`${
        persistedTheme === "dark"
          ? "bg-gray-600"
          : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
      } flex h-24 w-full flex-col items-center justify-between pb-4 tablet:h-[116px] laptop:h-[90px] laptop:flex-row laptop:pb-0 `}
    >
      {/* logo */}
      <div className="flex w-full items-center justify-between px-[17px] py-2 tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:justify-center laptop:px-0 laptop:py-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
        <div className="flex h-full items-center justify-center space-x-2 laptop:hidden">
          <div className="relative block h-fit w-fit laptop:hidden">
            <img
              src="/assets/svgs/dashboard/badge.svg"
              alt="badge"
              className="h-6 w-[19.8px] tablet:h-[51.5px] tablet:w-[42px]"
            />
            <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-white">
              5
            </p>
          </div>
          <div className="text-blue-100 flex flex-col ">
            <h3
              className="text-blue-300 font-inter text-[11px] font-medium text-[#E9F6FF] dark:text-white tablet:text-[20px]"
              onClick={() => {
                navigate("/profile");
              }}
            >
              My Profile
            </h3>
            <h3 className="font-inter font-small text-[7px] text-[#E9F6FF] dark:text-white tablet:text-[12px]">
              Balance 0.5
            </h3>
          </div>
        </div>

        <Link to={"/dashboard"}>
          <img
            src="/assets/svgs/logo.svg"
            alt="logo"
            className="w-[34.5px] tablet:w-[69.2px] laptop:w-[5.75rem]"
          />
        </Link>
        <div className="flex w-fit cursor-pointer items-center justify-center gap-[6px] text-[11.8px] font-semibold leading-normal text-white tablet:gap-3 tablet:text-[21.4px] laptop:hidden" onClick={handleLogout}>
          <div className="relative">
            <img
              src="/assets/svgs/dashboard/notification_icon.svg"
              alt="arrow-right"
              className="h-[18px] w-[15.3px] tablet:h-[32px] tablet:w-6"
            />
            <p className="absolute right-0 top-0 h-[7px] w-[7px] rounded-full bg-[#FF2C2C] text-center text-[4.667px] font-medium tablet:h-4 tablet:w-4 tablet:text-[10px]">
              2
            </p>
          </div>
          <img
            src="/assets/svgs/dashboard/arrow-right-outline.svg"
            alt="arrow-right"
            className="h-[12.6px] w-[12.6px] tablet:h-[22.94px] tablet:w-[22.94px]"
          />
        </div>
      </div>
      {/* items */}
      <ul className="flex w-full items-end justify-around gap-16 px-5 text-[28px] font-semibold leading-normal text-[#DADADA] 2xl:text-[30px] tablet:px-[57px] laptop:gap-28 laptop:px-0">
        <li>
          <Link
            to={"/dashboard"}
            className={`flex items-center gap-2 text-[14px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
          >
            {location.pathname === "/dashboard" &&
              (persistedTheme === "dark" ? (
                <img
                  src="/assets/svgs/dashboard/home.svg"
                  alt="home"
                  className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-[27px] laptop:w-[27px]"
                />
              ) : (
                <img
                  src="/assets/svgs/dashboard/home-white.svg"
                  alt="home-white"
                  className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-auto laptop:w-auto"
                />
              ))}
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/quest"}
            className={`flex items-center gap-2 text-[14px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard/quest"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
          >
            {location.pathname === "/dashboard/quest" && (
              <img
                src="/assets/svgs/dashboard/quest.svg"
                alt="quest"
                className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-auto laptop:w-auto"
              />
            )}
            Quests
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/bookmark"}
            className={`flex items-center gap-2 text-[14px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard/bookmark"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
          >
            {location.pathname === "/dashboard/bookmark" && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
                className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-auto laptop:w-auto"
              />
            )}
            Bookmarks
          </Link>
        </li>
      </ul>
      {/* logout btn */}
      <div className="hidden w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px] laptop:flex laptop:gap-[72px]" onClick={handleLogout}>
        <div className="relative">
          <img
            src="/assets/svgs/dashboard/notification_icon.svg"
            alt="arrow-right"
          />
          <p className="absolute right-0 top-0 h-5 w-5 rounded-full bg-[#FF2C2C] text-center text-[14px] font-medium">
            2
          </p>
        </div>
        <img
          src="/assets/svgs/dashboard/arrow-right-outline.svg"
          alt="arrow-right"
        />
      </div>
    </div>
  );
};

export default Topbar;
