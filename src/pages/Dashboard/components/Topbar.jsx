import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { TopbarItems } from '../../../constants/topbar';
import api from '../../../services/api/Axios';
import * as filterActions from '../../../features/sidebar/filtersSlice';
import { useDispatch } from 'react-redux';
import * as createQuestActions from '../../../features/createQuest/createQuestSlice';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      const res = await api.post('user/logout');
      if (res.status === 200) {
        dispatch(filterActions.resetFilters());
        localStorage.clear();
        navigate('/signin');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  const handleGuestLogout = async () => {
    navigate('/guest-signup');
  };

  return (
    <div
      className={`${
        persistedTheme === 'dark' ? 'bg-[#0C0C0D]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
      } fixed flex h-[4.18rem] min-h-[4.18rem] w-full flex-col items-center justify-between pb-2 tablet:h-[116px] tablet:min-h-[116px] laptop:h-[92px] laptop:min-h-[92px] laptop:flex-row laptop:pb-0`}
    >
      {/* logo */}
      <div className="relative flex w-full items-center justify-between px-[17px] py-2 tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:justify-center laptop:px-0 laptop:py-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
        {persistedUserInfo.role !== 'user' ? (
          <div
            className="flex h-full items-center justify-center space-x-2 laptop:hidden"
            onClick={() => {
              navigate('/profile');
            }}
          >
            <div className="relative block h-fit w-fit laptop:hidden">
              <img
                src="/assets/svgs/dashboard/guestBadge.svg"
                alt="badge"
                className="h-6 w-[19.8px] tablet:h-[51.5px] tablet:w-[42px]"
              />
              <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-white tablet:text-[19px] tablet:font-semibold">
                {persistedUserInfo?.badges?.length ? persistedUserInfo?.badges?.length : 'G'}
              </p>
            </div>
            <div className="text-blue-100 flex flex-col ">
              <h3
                className="text-blue-300 font-inter text-[11px] font-medium text-[#E9F6FF] tablet:text-[20px] dark:text-white"
                onClick={() => {
                  navigate('/profile');
                }}
              >
                Guest User
              </h3>
              <h3 className="font-inter font-small text-[7px] text-[#E9F6FF] tablet:text-[12px] dark:text-white">
                {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
              </h3>
            </div>
          </div>
        ) : (
          <div
            className="flex h-full cursor-pointer items-center justify-center space-x-2 laptop:hidden"
            onClick={() => {
              navigate('/profile');
            }}
          >
            <div className="relative block h-fit w-fit laptop:hidden">
              <img
                src="/assets/svgs/dashboard/MeBadge.svg"
                alt="badge"
                className="h-6 w-[19.8px] tablet:h-[51.5px] tablet:w-[42px]"
              />
              <p className="transform-center absolute z-50 pb-1 text-[8.6px] font-normal leading-normal text-[#7A7016] tablet:text-[19px] tablet:font-semibold">
                {persistedUserInfo?.badges?.length}
              </p>
            </div>
            <div className="text-blue-100 flex flex-col ">
              <h3 className="text-blue-300 font-inter text-[11px] font-medium text-[#E9F6FF] tablet:text-[20px] dark:text-white">
                My Profile
              </h3>
              <h3 className="font-inter font-small text-[7px] text-[#E9F6FF] tablet:text-[12px] dark:text-white">
                {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
              </h3>
            </div>
          </div>
        )}
        <Link
          to={'/dashboard'}
          className="flex w-[85.81px] justify-center tablet:w-[149.47px]"
          onClick={() => {
            dispatch(createQuestActions.resetCreateQuest());
          }}
        >
          <img src="/assets/svgs/logo.svg" alt="logo" className="w-[34.5px] tablet:w-[69.2px] laptop:w-[5.75rem]" />
        </Link>
        <div className="flex w-[85.81px] items-center justify-end gap-4 text-[11.8px] font-semibold leading-normal text-white tablet:w-[149.47px] tablet:gap-8 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
          {/* <div
            className="relative cursor-pointer "
            onClick={() => toast.error("err coming soon")}
          >
            <img
              src="/assets/svgs/dashboard/notification_icon.svg"
              alt="arrow-right"
              className="h-[18px] w-[15.3px] tablet:h-[32px] tablet:w-6"
            />
            <p className="absolute right-0 top-0 h-[7px] w-[7px] rounded-full bg-[#FF2C2C] text-center text-[4.667px] font-medium tablet:h-4 tablet:w-4 tablet:text-[10px]">
              2
            </p>
          </div> */}
          <Link to={'/dashboard/faq'} className="flex h-full items-center">
            <img
              src="/assets/navbar/faqlogo.png"
              alt="arrow-right"
              className="h-5 w-5 tablet:h-[36px] tablet:w-[36px]"
            />
          </Link>
          {localStorage.getItem('isGuestMode') ? (
            <div onClick={handleGuestLogout}>
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
        {TopbarItems?.map((item) => (
          <li
            key={item.id}
            className={`${
              item.id === 2 ? 'mr-[5px]' : ''
            } relative flex w-[85.8px] items-center justify-center tablet:w-[210px] `}
          >
            <Link
              to={item.path}
              className={`flex items-center gap-1 text-[12px] font-semibold tablet:gap-[13.6px] tablet:text-[23.9px] laptop:gap-[10px] laptop:text-[30px] ${
                location.pathname === item.path || location.pathname === `${item.path}/`
                  ? 'text-white'
                  : persistedTheme === 'dark'
                    ? 'text-[#92959D]'
                    : 'text-[#BEDEF4]'
              }`}
              onClick={() => {
                dispatch(createQuestActions.resetCreateQuest());
              }}
            >
              {location.pathname === item.path || location.pathname === `${item.path}/` ? (
                <img
                  src={item.icon}
                  alt={item.title}
                  className={`absolute h-3 w-3 tablet:h-[20.5px] tablet:w-[20.5px] laptop:h-[27px] laptop:w-[26px] ${
                    item.id === 3
                      ? '-left-[4px] tablet:left-[11px] laptop:-left-[13px]'
                      : item.id === 2
                        ? 'left-[8px] tablet:left-[40px] laptop:left-[20px]'
                        : 'left-[10px] tablet:left-[40px] laptop:left-[26px]'
                  }`}
                />
              ) : null}
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      {/* logout btn */}
      <div className="hidden h-full w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px] laptop:flex laptop:w-[18.25rem] laptop:min-w-[18.25rem] laptop:gap-[35px]">
        {/* <div
          className="relative"
          onClick={() => toast.error("err coming soon")}
        >
          <img
            src="/assets/svgs/dashboard/notification_icon.svg"
            alt="arrow-right"
          />
          <p className="absolute right-0 top-0 h-5 w-5 rounded-full bg-[#FF2C2C] text-center text-[14px] font-medium">
            2
          </p>
        </div> */}
        <Link
          to={'/dashboard/faq'}
          className={`${location.pathname === '/dashboard/faq' || location.pathname === '/dashboard/faq/contact-us' ? 'bg-[#2B85C5]' : ''} flex h-full items-center px-[30px]`}
        >
          <img src="/assets/navbar/faqlogo.png" alt="arrow-right" className="h-11 w-11" />
        </Link>
        {persistedUserInfo.role !== 'user' ? (
          <div onClick={handleGuestLogout}>
            <img src="/assets/svgs/dashboard/signupIcon.png" alt="signup Icon" />
          </div>
        ) : (
          <div onClick={handleLogout}>
            <img src="/assets/svgs/dashboard/arrow-right-outline.svg" alt="arrow-right" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
