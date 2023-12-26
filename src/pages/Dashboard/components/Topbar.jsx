import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/Axios";

const Topbar = () => {
  const location = useLocation();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post(`user/logout/${localStorage.getItem("uId")}`);
      if (res.status === 200) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message.split(":")[1]);
    }
  };

  return (
    <div
      className={`${
        persistedTheme === "dark"
          ? "bg-gray-600"
          : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
      } flex h-[4.18rem] w-full flex-col items-center justify-between pb-2 tablet:h-[116px] laptop:h-[90px] laptop:flex-row laptop:pb-0 `}
    >
      {/* logo */}
      <div className="relative flex w-full items-center justify-between px-[17px] py-2 tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:justify-center laptop:px-0 laptop:py-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
        {localStorage.getItem("isGuestMode") ? (
          <div
            className="flex h-full items-center justify-center space-x-2 laptop:hidden"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <div className="relative block h-fit w-fit laptop:hidden">
              <img
                src="/assets/svgs/dashboard/yellowBadge.svg"
                alt="badge"
                className="h-6 w-[19.8px] tablet:h-[51.5px] tablet:w-[42px]"
              />
              <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-[#362E04]">
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
                Guest User
              </h3>
              <h3 className="font-inter font-small text-[7px] text-[#E9F6FF] dark:text-white tablet:text-[12px]">
                Balance:{" "}
                {persistedUserInfo?.balance
                  ? persistedUserInfo?.balance.toFixed(2)
                  : 0}
              </h3>
            </div>
          </div>
        ) : (
          <div
            className="flex h-full items-center justify-center space-x-2 laptop:hidden"
            onClick={() => {
              navigate("/profile");
            }}
          >
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
              <h3 className="text-blue-300 font-inter text-[11px] font-medium text-[#E9F6FF] dark:text-white tablet:text-[20px]">
                My Profile
              </h3>
              <h3 className="font-inter font-small text-[7px] text-[#E9F6FF] dark:text-white tablet:text-[12px]">
                Balance:{" "}
                {persistedUserInfo?.balance
                  ? persistedUserInfo?.balance.toFixed(2)
                  : 0}
              </h3>
            </div>
          </div>
        )}
        <Link
          to={"/dashboard"}
          className="flex w-[85.81px] justify-center tablet:w-[149.47px]"
        >
          <img
            src="/assets/svgs/logo.svg"
            alt="logo"
            className="w-[34.5px] tablet:w-[69.2px] laptop:w-[5.75rem]"
          />
        </Link>
        <div className="flex w-[85.81px] items-center justify-end gap-4 text-[11.8px] font-semibold leading-normal text-white tablet:w-[149.47px] tablet:gap-8 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
          <div className="relative cursor-pointer ">
            <img
              src="/assets/svgs/dashboard/notification_icon.svg"
              alt="arrow-right"
              className="h-[18px] w-[15.3px] tablet:h-[32px] tablet:w-6"
            />
            <p className="absolute right-0 top-0 h-[7px] w-[7px] rounded-full bg-[#FF2C2C] text-center text-[4.667px] font-medium tablet:h-4 tablet:w-4 tablet:text-[10px]">
              2
            </p>
          </div>
          {localStorage.getItem("isGuestMode") ? (
            <div
              onClick={() => {
                navigate("/signup");
              }}
            >
              <img
                src="/assets/svgs/dashboard/signupIcon.png"
                alt="signup Icon"
                className="h-[18px] w-[16.2px] cursor-pointer tablet:h-[36px] tablet:w-[28px]"
              />
            </div>
          ) : (
            <div onClick={handleLogout}>
              <img
                src="/assets/svgs/dashboard/arrow-right-outline.svg"
                alt="arrow-right"
                className="h-[18px] w-[16.2px] cursor-pointer tablet:h-[36px] tablet:w-[28px]"
              />
            </div>
          )}
        </div>
      </div>
      {/* items */}
      <ul className="flex w-full items-end justify-around gap-[2.19rem] px-5 text-[28px] font-semibold leading-normal text-[#DADADA] 2xl:text-[30px] tablet:px-[57px] laptop:gap-[3.12rem] laptop:px-0">
        <li>
          <Link
            to={"/dashboard"}
            className={`flex items-center gap-1 text-[12px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard" ||
              location.pathname === "/dashboard/"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
          >
            {(location.pathname === "/dashboard" ||
              location.pathname === "/dashboard/") && (
              <img
                src="/assets/svgs/dashboard/home-white.svg"
                alt="home"
                className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-[27px] laptop:w-[27px]"
              />
            )}
            Home
          </Link>
        </li>
        <li>
          <Link
            to={"/dashboard/quest"}
            className={`flex items-center gap-1 text-[12px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard/quest" ||
              location.pathname === "/dashboard/quest/"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
          >
            {(location.pathname === "/dashboard/quest" ||
              location.pathname === "/dashboard/quest/") && (
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
            className={`flex items-center gap-1 text-[12px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard/bookmark" ||
              location.pathname === "/dashboard/bookmark/"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
          >
            {(location.pathname === "/dashboard/bookmark" ||
              location.pathname === "/dashboard/bookmark/") && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
                className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-auto laptop:w-auto"
              />
            )}
            Bookmarks
          </Link>
        </li>
        <li>
          <Link
            // to={"/dashboard/bookmark"}
            className={`flex items-center gap-1 text-[12px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
              location.pathname === "/dashboard/marketplace" ||
              location.pathname === "/dashboard/marketplace/"
                ? "text-white"
                : persistedTheme === "dark"
                  ? "text-[#92959D]"
                  : "text-[#BEDEF4]"
            }`}
            onClick={() => toast.info("Marketplace is comming soon")}
          >
            {(location.pathname === "/dashboard/marketplace" ||
              location.pathname === "/dashboard/marketplace/") && (
              <img
                src="/assets/svgs/dashboard/bookmark-white.svg"
                alt="bookmark"
                className="h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-auto laptop:w-auto"
              />
            )}
            Marketplace
          </Link>
        </li>
      </ul>
      {/* logout btn */}
      <div className="hidden w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px] laptop:flex laptop:w-[18.25rem] laptop:min-w-[18.25rem] laptop:gap-[35px]">
        <div className="relative">
          <img
            src="/assets/svgs/dashboard/notification_icon.svg"
            alt="arrow-right"
          />
          <p className="absolute right-0 top-0 h-5 w-5 rounded-full bg-[#FF2C2C] text-center text-[14px] font-medium">
            2
          </p>
        </div>

        {localStorage.getItem("isGuestMode") ? (
          <div
            onClick={() => {
              navigate("/signup");
            }}
          >
            <img
              src="/assets/svgs/dashboard/signupIcon.png"
              alt="signup Icon"
            />
          </div>
        ) : (
          <div onClick={handleLogout}>
            <img
              src="/assets/svgs/dashboard/arrow-right-outline.svg"
              alt="arrow-right"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
