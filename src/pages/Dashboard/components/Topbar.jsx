import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TopbarItems } from '../../../constants/topbar';
import {
  addSharedLinkPost,
  resetPlayingIds,
  setIsShowPlayer,
  setPlayingPlayerId,
} from '../../../features/quest/utilsSlice';
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
      <div className="static mx-auto flex h-[48px] max-h-[48px] min-h-[48px] w-full max-w-[1378px] flex-col items-center justify-between tablet:h-20 tablet:min-h-20 laptop:h-[92px] laptop:max-h-[70px] laptop:min-h-[70px] laptop:flex-row">
        <div className="relative flex h-full w-full items-center justify-between px-4 py-2 tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:px-0 laptop:py-0 laptop:pl-[31px] desktop:pl-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
          <div className="flex w-full items-center justify-between gap-[25px] laptop:justify-center">
            <div className="flex items-center gap-[10px] tablet:gap-[25px]">
              <Link
                to={'/'}
                className="relative flex justify-center"
                onClick={() => {
                  dispatch(setIsShowPlayer(false));
                  dispatch(setPlayingPlayerId(''));
                  dispatch(resetPlayingIds());
                  dispatch(createQuestActions.resetCreateQuest());
                }}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/${location.pathname === '/' ? 'home-filled.svg' : 'home.svg'}`}
                  alt="foundation_logo"
                  className="size-5 tablet:size-8"
                />
              </Link>
              <Link
                to={'/'}
                className="flex items-center gap-[5px] tablet:flex-col tablet:items-start tablet:gap-0"
                onClick={() => {
                  dispatch(createQuestActions.resetCreateQuest());
                }}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/foundation_logo.svg`}
                  alt="foundation_logo"
                  className="h-[10px] w-auto tablet:h-auto"
                />
                <span className="w-fit whitespace-nowrap font-poppins text-[10px] font-medium text-[#D0E4F2] tablet:pt-1 tablet:text-[13px] tablet:leading-[13px]">
                  v 1.14.98
                </span>
              </Link>
            </div>
            {/* Mobile */}
            <div className="flex w-fit items-center justify-end gap-3 text-[11.8px] font-semibold leading-normal text-white tablet:w-[149.47px] tablet:gap-8 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
              {TopbarItems.map((item) => (
                <Link
                  key={item.id}
                  to={persistedUserInfo.role === 'guest' && item.id === 1 ? item.signupPath : item.path}
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
                      persistedUserInfo.role === 'guest' && item.id === 1
                        ? item.signupIcon
                        : item.activePaths?.some((path) => location.pathname === path) ||
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
        </div>

        {/* Desktop */}
        <div className="hidden h-full w-[23rem] min-w-[23rem] cursor-pointer items-center justify-center gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px] laptop:flex laptop:w-[18.25rem] laptop:min-w-[18.25rem] laptop:gap-[35px]">
          {TopbarItems.map((item) => (
            <Link
              key={item.id}
              to={persistedUserInfo.role === 'guest' && item.id === 1 ? item.signupPath : item.path}
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
                  persistedUserInfo.role === 'guest' && item.id === 1
                    ? item.signupIcon
                    : item.activePaths?.some((path) => location.pathname === path) ||
                        location.pathname === `${item.path}/`
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
