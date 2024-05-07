import { GrClose } from 'react-icons/gr';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sharedLinksFilters, updateSharedLinkSearch } from '../../../../../../features/profile/sharedLinks';
import * as questUtilsActions from '../../../../../../features/quest/utilsSlice';
import DisabledLinkPopup from '../../../../../../components/dialogue-boxes/DisabledLinkPopup';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../../../../utils/useDebounce';
import api from '../../../../../../services/api/Axios';
import { hideReasons } from '../../../../../../constants/hiddenPosts';

const QuestCard = ({ innerRef, persistedUserInfo, post }) => {
  return (
    <div
      ref={innerRef}
      className="max-w-[730px] rounded-[12.3px] border-2 border-[#D9D9D9] bg-white tablet:rounded-[15px] dark:border-white dark:bg-[#000] "
    >
      <div className="mb-2 flex justify-between border-b border-[#D9D9D9] px-2 py-2 tablet:mb-5 tablet:border-b-2 tablet:px-5 tablet:py-4 laptop:px-5">
        <div className="flex w-full items-center justify-between gap-[10px] tablet:gap-[18px]">
          <div className="flex items-center gap-2 tablet:gap-4 ">
            {post.uuid === persistedUserInfo?.uuid ? (
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                  {post.getUserBadge?.badges?.length}
                </p>
              </div>
            ) : (
              <div className="relative z-50 h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                  {post.getUserBadge?.badges?.length}
                </p>
              </div>
            )}

            {post.suppressed && (
              <div className="mt-[1.5px] flex items-center gap-1.5 pr-5 tablet:mt-[3px] tablet:gap-3 tablet:pr-6">
                <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#FF2C2C] tablet:text-[1.25rem] tablet:leading-[23px]">
                  SUPRESSED
                </h4>
              </div>
            )}
          </div>
          <div className="flex items-center gap-[15px]">
            <h4 className="text-[0.75rem] font-normal leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
              {post.hiddenCount} Post Hidden
            </h4>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/hidden-eye.svg`}
              alt="popup logo"
              className="h-6 w-6 tablet:h-auto tablet:w-auto"
            />
          </div>
        </div>
      </div>
      <h1 className="ml-8 text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
        {post.Question}
      </h1>
      <div className="mb-[26px] ml-[60px] mt-[15px] grid grid-cols-2 gap-x-[50px] gap-y-[15px] ">
        {hideReasons.map((item) => {
          const feedbackItem = post.feedback.find((feedback) => feedback.id === item.title);
          const feedbackCount = feedbackItem ? feedbackItem.count : 0;
          const feedbackViolated = feedbackItem ? feedbackItem.violated : false;

          return (
            <p
              key={item.id}
              className={`${post.suppressedReason === item.title && item.title === 'Invalid Media' ? 'font-semibold text-[#DC1010]' : feedbackViolated ? 'font-semibold text-[#DC1010]' : feedbackCount >= 1 ? 'text-[#4A8DBD]' : 'font-normal text-[#BABABA]'} text-[18px]`}
            >
              {feedbackCount} {item.title}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default function Feedback() {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const getSharedLinksFilters = useSelector(sharedLinksFilters);
  const [sharedlinkSearch, setSharedlinkSearch] = useState('');

  const handleSharedLinkSearch = (e) => {
    setSharedlinkSearch(e.target.value);
  };

  const debouncedSharedSearch = useDebounce(sharedlinkSearch, 1000);

  useEffect(() => {
    dispatch(updateSharedLinkSearch(debouncedSharedSearch));
  }, [debouncedSharedSearch]);

  useEffect(() => {
    if (getSharedLinksFilters.searchData === '') {
      setSharedlinkSearch('');
    }
  }, [getSharedLinksFilters.searchData]);

  const showHidePostClose = () => {
    dispatch(questUtilsActions.updateDialogueBox({ type: null, status: false, link: null, id: null }));
  };

  const fetchPosts = async function getInfoQuestions({ pageParam }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      Page: 'Feedback',
      terms: '',
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['feedback', getSharedLinksFilters.searchData],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nexPage = lastPage.length ? allPages.length + 1 : undefined;
      return nexPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  const content = data?.pages.map((posts) =>
    posts.map((post, index) => {
      if (posts.length == index + 1) {
        return <QuestCard innerRef={ref} persistedUserInfo={persistedUserInfo} post={post} />;
      } else {
        return <QuestCard persistedUserInfo={persistedUserInfo} post={post} />;
      }
    }),
  );

  return (
    <div>
      <div className="mx-[15px] my-2 mr-4 flex justify-between tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
        <DisabledLinkPopup handleClose={showHidePostClose} modalVisible={questUtils.sharedQuestStatus.isDialogueBox} />
        <h1 className="text-[12px] font-semibold leading-[17px] text-[#4A8DBD] tablet:text-[25px] tablet:font-semibold  tablet:leading-[30px] dark:text-[#B8B8B8]">
          Feedback
        </h1>
        <div className="relative">
          <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:outline-none focus:ring-0 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
              value={sharedlinkSearch}
              placeholder=""
              onChange={handleSharedLinkSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175]  duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
            >
              Search
            </label>
            {getSharedLinksFilters.searchData && (
              <button
                className="absolute right-1.5 top-[55%] -translate-y-1/2 transform tablet:right-3 tablet:top-1/2 "
                onClick={() => {
                  dispatch(updateSharedLinkSearch(''));
                }}
              >
                <GrClose className="h-2 w-2 text-[#ACACAC] tablet:h-4 tablet:w-4 dark:text-white" />
              </button>
            )}
            {!getSharedLinksFilters.searchData && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                alt="search"
                className="absolute right-1.5 top-[55%] h-2 w-2 -translate-y-1/2 transform tablet:right-3 tablet:top-1/2 tablet:h-4 tablet:w-4"
              />
            )}
          </div>
        </div>
      </div>

      <div className="no-scrollbar tablet:w-fulls mx-auto flex h-full max-w-full flex-col overflow-y-auto bg-[#F2F3F5] dark:bg-[#242424]">
        <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-5">
          {content}
          {!isFetching ? (
            <div className="flex justify-center gap-4 px-4 pb-8 pt-3 tablet:py-[27px]">
              {getSharedLinksFilters.searchData && data?.pages[0].length == 0 ? (
                <div className="my-[15vh] flex  flex-col items-center justify-center">
                  {persistedTheme === 'dark' ? (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/noMatchingDark.svg`}
                      alt="noposts image"
                    />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/noMatchingLight.svg`}
                      alt="noposts image"
                      className="h-[173px] w-[160px]"
                    />
                  )}
                  <div className="flex flex-col items-center gap-[6px] tablet:gap-4">
                    <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold text-[#9F9F9F] tablet:text-[2.083vw] dark:text-gray">
                      No matching posts found!
                    </p>
                    <button
                      className={`${
                        persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                      }  inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
                      onClick={() => {
                        dispatch(updateSharedLinkSearch(''));
                      }}
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              ) : !getSharedLinksFilters.searchData && data?.pages[0].length === 0 ? (
                <p className="text-center text-[4vw] laptop:text-[2vw]">
                  <b>No Feedback posts!</b>
                </p>
              ) : !getSharedLinksFilters.searchData ? (
                <p className="text-center text-[4vw] laptop:text-[2vw]">
                  <b>No more posts!</b>
                </p>
              ) : (
                <div className="flex flex-col items-center gap-[6px] tablet:gap-4">
                  <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold text-[#9F9F9F] tablet:text-[2.083vw] dark:text-gray">
                    You are all caught up!
                  </p>
                  <button
                    className={`${
                      persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                    }  inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem] dark:text-[#EAEAEA]`}
                    onClick={() => {
                      dispatch(updateSharedLinkSearch(''));
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              )}
              <div></div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
