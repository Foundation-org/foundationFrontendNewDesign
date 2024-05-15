import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TopbarItems } from '../../../constants/topbar';
import { addSharedLinkPost } from '../../../features/quest/utilsSlice';
import * as createQuestActions from '../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../features/createQuest/pictureMediaSlice';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="bg-[#389CE3]">
      <div className="static mx-auto flex h-[58px] max-h-[58px] min-h-[58px] w-full max-w-[1378px] flex-col items-center justify-between tablet:h-24 tablet:min-h-24 laptop:h-[92px] laptop:max-h-[70px] laptop:min-h-[70px] laptop:flex-row">
        <div className="relative flex h-full w-full items-center justify-between px-4 py-2 tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:px-0 laptop:py-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
          <div className="flex w-full items-center justify-between gap-12">
            <Link
              to={'/dashboard'}
              className="relative flex justify-center"
              onClick={() => {
                dispatch(createQuestActions.resetCreateQuest());
              }}
            >
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/${location.pathname === '/dashboard' ? 'home-filled.svg' : 'home.svg'}`}
                alt="foundation_logo"
                className="size-5 tablet:size-8"
              />
            </Link>
            <Link
              to={'/dashboard'}
              className="flex items-center justify-center gap-[6px]"
              onClick={() => {
                dispatch(createQuestActions.resetCreateQuest());
              }}
            >
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/foundation_logo.svg`}
                alt="foundation_logo"
                className="h-[10px] w-auto tablet:h-auto"
              />
              <span className="w-fit whitespace-nowrap font-poppins text-[10px] font-medium text-[#D0E4F2] tablet:pt-1 tablet:text-[12px]">
                v 1.11.6
              </span>
            </Link>
            <div className="flex w-fit items-center justify-end gap-3 text-[11.8px] font-semibold leading-normal text-white tablet:w-[149.47px] tablet:gap-8 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
              {TopbarItems.map((item) => (
                <Link
                  to={item.path}
                  className={`${
                    item.activePaths?.some((path) => location.pathname === path) ||
                    location.pathname === `${item.path}/`
                      ? 'text-white'
                      : persistedTheme === 'dark'
                        ? 'text-[#92959D]'
                        : 'text-[#BEDEF4]'
                  } flex h-full items-center`}
                  onClick={() => {
                    dispatch(createQuestActions.resetCreateQuest());
                    dispatch(pictureMediaAction.resetToInitialState());
                    dispatch(addSharedLinkPost(null));
                  }}
                >
                  <img
                    src={
                      item.activePaths?.some((path) => location.pathname === path) ||
                      location.pathname === `${item.path}/`
                        ? item.iconSelected
                        : item.icon
                    }
                    alt="arrow-right"
                    className="size-5 tablet:size-8"
                  />
                </Link>
              ))}
            </div>
          </div>
          {/* {persistedUserInfo.role !== 'user' && (
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
          )} */}
        </div>
        {/* {persistedUserInfo.role === 'user' && (
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
            )} */}
        {/* <div className="flex w-fit items-center justify-end gap-3 text-[11.8px] font-semibold leading-normal text-white tablet:w-[149.47px] tablet:gap-8 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
            {TopbarItems.map((item) => (
              <Link
                to={item.path}
                className={`${
                  item.activePaths?.some((path) => location.pathname === path) || location.pathname === `${item.path}/`
                    ? 'text-white'
                    : persistedTheme === 'dark'
                      ? 'text-[#92959D]'
                      : 'text-[#BEDEF4]'
                } flex h-full items-center`}
                onClick={() => {
                  dispatch(createQuestActions.resetCreateQuest());
                  dispatch(pictureMediaAction.resetToInitialState());
                  dispatch(addSharedLinkPost(null));
                }}
              >
                <img
                  src={item.icon}
                  alt="arrow-right"
                  className={`${item.title === 'Faqs' ? 'size-5' : 'size-[16px]'}`}
                />
              </Link>
            ))}
          </div> */}
        {/* <Link to={'/dashboard/help/about'} className="flex h-full items-center">
              <img
                src="/assets/navbar/faqlogo.png"
                alt="arrow-right"
                className="h-[15px] w-[15px] tablet:h-[32px] tablet:w-[32px] laptop:h-[36px] laptop:w-[36px]"
              />
            </Link> */}

        {/* <ul className="flex w-full items-end justify-around px-4 text-[28px] font-semibold leading-normal text-[#DADADA] 2xl:text-[30px] tablet:px-0 laptop:gap-0">
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
        </ul> */}
        <div className="hidden h-full w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px] laptop:flex laptop:w-[18.25rem] laptop:min-w-[18.25rem] laptop:gap-[35px]">
          {TopbarItems.map((item) => (
            <Link
              to={item.path}
              className={`${
                item.activePaths?.some((path) => location.pathname === path) || location.pathname === `${item.path}/`
                  ? 'text-white'
                  : persistedTheme === 'dark'
                    ? 'text-[#92959D]'
                    : 'text-[#BEDEF4]'
              } flex h-full items-center`}
              onClick={() => {
                dispatch(createQuestActions.resetCreateQuest());
                dispatch(pictureMediaAction.resetToInitialState());
                dispatch(addSharedLinkPost(null));
              }}
            >
              <img
                src={
                  item.activePaths?.some((path) => location.pathname === path) || location.pathname === `${item.path}/`
                    ? item.iconSelected
                    : item.icon
                }
                alt="arrow-right"
                className="size-8"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
