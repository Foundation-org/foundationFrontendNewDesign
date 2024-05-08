// import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { TopbarItems } from '../../../constants/topbar';
// import api from '../../../services/api/Axios';
// import * as filterActions from '../../../features/sidebar/filtersSlice';
import { useDispatch } from 'react-redux';
import * as createQuestActions from '../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../features/createQuest/pictureMediaSlice';
import { addSharedLinkPost } from '../../../features/quest/utilsSlice';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  // const handleLogout = async () => {
  //   try {
  //     const res = await api.post('user/logout');
  //     if (res.status === 200) {
  //       dispatch(filterActions.resetFilters());
  //       localStorage.clear();
  //       navigate('/signin');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response.data.message.split(':')[1]);
  //   }
  // };

  // const handleGuestLogout = async () => {
  //   navigate('/guest-signup');
  // };

  return (
    <div className="bg-[#389CE3]">
      <div className="static mx-auto flex h-[58px] max-h-[58px] min-h-[58px] w-full max-w-[1378px] flex-col items-center justify-between pb-2 tablet:h-24 tablet:min-h-24 laptop:h-[92px] laptop:max-h-[70px] laptop:min-h-[70px] laptop:flex-row laptop:pb-0">
        {/* logo */}
        <div className="relative flex w-full items-center justify-between px-4 py-2 tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:justify-center laptop:px-0 laptop:py-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
          <Link
            to={'/dashboard'}
            className="relative flex justify-center"
            onClick={() => {
              dispatch(createQuestActions.resetCreateQuest());
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/foundation_logo.svg`}
              alt="foundation_logo"
              className="h-2 w-[92.44px] tablet:h-auto tablet:w-auto"
            />
            <span className="absolute -bottom-[3px] -right-[24px] w-fit whitespace-nowrap font-poppins text-[7px] font-medium text-[#D0E4F2] tablet:-bottom-[18px] tablet:-right-8 tablet:left-0 tablet:text-[12px]">
              v 1.10.16
            </span>

            {/* <h1 className="relative font-neuropol text-[12px] font-normal text-white tablet:text-[20px]">
              FOUNDATION{' '}
              <span className="absolute -right-[26px] bottom-[2px] whitespace-nowrap font-poppins text-[7px] font-medium text-[#D0E4F2] tablet:-bottom-3 tablet:-right-8 tablet:left-0 tablet:text-[12px]">
                v 1.10.7
              </span>
            </h1> */}

            {/* <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`} alt="logo" className="" /> */}
          </Link>
          {persistedUserInfo.role !== 'user' && (
            <div
              className="flex h-full items-center justify-center space-x-2 laptop:hidden"
              onClick={() => {
                navigate('/dashboard/profile');
              }}
            >
              <div className="relative block h-fit w-fit laptop:hidden">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
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
                    navigate('/dashboard/profile');
                  }}
                >
                  Guest User
                </h3>
                <h3 className="font-inter font-small text-[7px] text-[#E9F6FF] tablet:text-[12px] dark:text-white">
                  {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
                </h3>
              </div>
            </div>
          )}

          <div className="flex w-fit items-center justify-end gap-3 text-[11.8px] font-semibold leading-normal text-white tablet:w-[149.47px] tablet:gap-8 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
            {persistedUserInfo.role === 'user' && (
              <div
                className="flex cursor-pointer items-center gap-[2.4px] tablet:hidden"
                onClick={() => {
                  navigate('/dashboard/profile');
                }}
              >
                <div className="relative h-fit w-fit">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                    alt="badge"
                    className="h-[15px] w-3 tablet:h-[47px] tablet:w-[38px]"
                  />
                  <p className="transform-center absolute z-50 pb-[1px] pr-[1px] text-[7.5px] font-medium leading-normal text-[#7A7016] tablet:text-[20px]">
                    {persistedUserInfo?.badges?.length}
                  </p>
                </div>
                <p className="font-inter hidden text-[7.5px] font-medium leading-[11.523px] text-white tablet:block tablet:text-[18px] tablet:leading-[18px] dark:text-[#D2D2D2]">
                  {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
                </p>
                <div>
                  <p className="font-inter text-[7.5px] font-medium leading-[7.5px] text-white dark:text-[#D2D2D2]">
                    {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0}
                  </p>
                  <p className="font-inter text-[7.5px] font-medium leading-[7.5px] text-white dark:text-[#D2D2D2]">
                    FDX
                  </p>
                </div>
              </div>
            )}
            {/* <div
            className="relative cursor-pointer "
            onClick={() => toast.error("err coming soon")}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/notification_icon.svg`}
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
                className="h-[15px] w-[15px] tablet:h-[32px] tablet:w-[32px] laptop:h-[36px] laptop:w-[36px]"
              />
            </Link>
            {/* {localStorage.getItem('isGuestMode') ? (
              <div onClick={handleGuestLogout}>
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/signupIcon.png`}
                  alt="signup Icon"
                  className="w-[16.2px] cursor-pointer tablet:h-[36px] tablet:w-[28px] laptop:h-8"
                />
              </div>
            ) : (
              <div onClick={handleLogout}>
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/arrow-right-outline.svg`}
                  alt="arrow-right"
                  className="h-[13px] w-[16.2px] cursor-pointer tablet:h-[36px] tablet:w-[28px]"
                />
              </div>
            )} */}
          </div>
        </div>
        {/* items */}
        <ul className="flex w-full items-end justify-around px-4 text-[28px] font-semibold leading-normal text-[#DADADA] 2xl:text-[30px] tablet:px-0 laptop:gap-0">
          {TopbarItems?.map((item) => (
            <li key={item.id} className="relative flex items-center">
              <Link
                to={item.path}
                className={`flex items-center gap-1 text-[12px] font-semibold leading-[12px] tablet:gap-[13.6px] tablet:text-[24px] tablet:leading-[25px] laptop:gap-[10px] laptop:text-[25px] ${
                  item.activePaths?.some((path) => location.pathname === path) || location.pathname === `${item.path}/`
                    ? 'text-white'
                    : persistedTheme === 'dark'
                      ? 'text-[#92959D]'
                      : 'text-[#BEDEF4]'
                }`}
                onClick={() => {
                  dispatch(createQuestActions.resetCreateQuest());
                  dispatch(pictureMediaAction.resetToInitialState());
                  dispatch(addSharedLinkPost(null));
                }}
              >
                {item.activePaths?.some((path) => location.pathname === path) ||
                location.pathname === `${item.path}/` ? (
                  <img
                    src={item.icon}
                    alt={item.title}
                    className={`absolute -left-[12px] h-[10.4px] w-[10.4px] tablet:-left-7 tablet:h-[20.5px] tablet:w-[20.5px] laptop:w-auto`}
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
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/notification_icon.svg`}
            alt="arrow-right"
          />
          <p className="absolute right-0 top-0 h-5 w-5 rounded-full bg-[#FF2C2C] text-center text-[14px] font-medium">
            2
          </p>
        </div> */}
          <Link
            to={'/dashboard/faq'}
            className={`${location.pathname === '/dashboard/faq' || location.pathname === '/dashboard/faq/contact-us' ? 'bg-[#2B85C5]' : ''} flex h-full items-center`}
          >
            <img src="/assets/navbar/faqlogo.png" alt="arrow-right" className="h-[30px] w-[30px]" />
          </Link>
          {/* {persistedUserInfo.role !== 'user' ? (
            <div onClick={handleGuestLogout}>
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/signupIcon.png`}
                alt="signup Icon"
                className="laptop:h-8"
              />
            </div>
          ) : (
            <div onClick={handleLogout}>
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/arrow-right-outline.svg`}
                alt="arrow-right"
                className="h-[26px] w-[26px]"
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

// ${
//   item.id === 4
//     ? 'left-[10px] tablet:left-[40px] laptop:left-[10px]'
//     : item.id === 5
//       ? '-left-[4px] tablet:left-[11px] laptop:left-[6px]'
//       : item.id === 2
//         ? 'left-[8px] tablet:left-[40px] laptop:left-[20px]'
//         : 'left-[10px] tablet:left-[40px] laptop:left-[26px]'
// }
