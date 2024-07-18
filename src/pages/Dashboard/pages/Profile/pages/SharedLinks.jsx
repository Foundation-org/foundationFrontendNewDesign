import { GrClose } from 'react-icons/gr';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import QuestionCard from '../../QuestStartSection/components/QuestionCard';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';
import DisabledLinkPopup from '../../../../../components/dialogue-boxes/DisabledLinkPopup';
import { useDispatch } from 'react-redux';
import { sharedLinksFilters, updateSharedLinkSearch } from '../../../../../features/profile/sharedLinks';
import { setAreShareLinks } from '../../../../../features/quest/utilsSlice';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../../../../../services/api/Axios';
import { useDebounce } from '../../../../../utils/useDebounce';
import ContentCard from '../../../../../components/ContentCard';

export default function SharedLinks() {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const getSharedLinksFilters = useSelector(sharedLinksFilters);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const { ref, inView } = useInView();
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

  const memoizedStartTest = useCallback(
    (testId) => {
      setViewResult(null);
      setStartTest((prev) => (prev === testId ? null : testId));
    },
    [setViewResult, setStartTest],
  );

  const memoizedViewResults = useCallback(
    (testId) => {
      setStartTest(null);
      setViewResult((prev) => (prev === testId ? null : testId));
    },
    [setStartTest, setViewResult],
  );

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
      Page: 'SharedLink',
      terms: getSharedLinksFilters.searchData,
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['sharedLink', getSharedLinksFilters.searchData],
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
        return (
          <QuestionCard
            innerRef={ref}
            key={post._id}
            questStartData={post}
            postProperties={'SharedLinks'}
            startTest={startTest}
            setStartTest={setStartTest}
            viewResult={viewResult}
            handleViewResults={memoizedViewResults}
            handleStartTest={memoizedStartTest}
          />
        );
      } else {
        return (
          <QuestionCard
            key={post._id}
            questStartData={post}
            postProperties={'SharedLinks'}
            startTest={startTest}
            setStartTest={setStartTest}
            viewResult={viewResult}
            handleViewResults={memoizedViewResults}
            handleStartTest={memoizedStartTest}
          />
        );
      }
    }),
  );

  useEffect(() => {
    if (data?.pages[0].length !== 0) {
      dispatch(setAreShareLinks(true));
    } else {
      dispatch(setAreShareLinks(false));
    }
  }, [data]);

  return (
    <div>
      {/* Shared Posts Insights */}
      <ContentCard icon="assets/summary/share-posts-logo.svg" title="Shared Posts">
        <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
          Sharing posts is a great way to earn FDX - especially if people engage with them.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Posts you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal text-[#85898C] dark:text-gray-300">
              {persistedUserInfo?.sharedQuestsStatistics.sharedQuests}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total shared link clicks
            </h1>
            <h5 className="text-center text-[18px] font-normal text-[#85898C] dark:text-gray-300">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsImpression}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total post engagement
            </h1>
            <h5 className="text-center text-[18px] font-normal text-[#85898C] dark:text-gray-300">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted}
            </h5>
          </div>
        </div>
      </ContentCard>

      <div className="mx-[15px] my-2 mr-4 flex justify-end tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
        <DisabledLinkPopup handleClose={showHidePostClose} modalVisible={questUtils.sharedQuestStatus.isDialogueBox} />
        <div className="relative">
          <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="focus:border-blue-600 peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-[#707175] dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px]"
              value={sharedlinkSearch}
              placeholder=""
              onChange={handleSharedLinkSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="peer-focus:text-blue-600 absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175] duration-300  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-[#0A0A0C] peer-focus:dark:text-blue-500 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
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
                <GrClose className="h-2 w-2 text-[#ACACAC] dark:text-white tablet:h-4 tablet:w-4" />
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

      <div className="no-scrollbar tablet:w-fulls mx-auto flex h-full max-w-full flex-col overflow-y-auto bg-[#F2F3F5] dark:bg-black">
        <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-5">
          {content}
          <div className="flex flex-col justify-center gap-4 px-4 pb-8 pt-3 tablet:py-[27px]">
            {isFetching ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="text-blue animate-spin text-[10vw] tablet:text-[4vw]" />
              </div>
            ) : getSharedLinksFilters.searchData && data?.pages[0].length === 0 ? (
              <div className="my-[15vh] flex  flex-col items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/error-bot.svg' : 'assets/svgs/dashboard/noMatchingLight.svg'}`}
                  alt="noposts image"
                  className="h-[173px] w-[160px]"
                />
                <div className="flex flex-col items-center gap-[6px] tablet:gap-4">
                  <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold text-[#9F9F9F] dark:text-gray-900 tablet:text-[2.083vw]">
                    No matching posts found!
                  </p>
                  <button
                    className={`${
                      persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                    }  inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
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
                <b>No shared posts!</b>
              </p>
            ) : !getSharedLinksFilters.searchData && data?.pages[0].length !== 0 ? (
              <p className="text-center text-[4vw] laptop:text-[2vw]">
                <b>No more shared posts!</b>
              </p>
            ) : (
              <div className="flex flex-col items-center gap-[6px] tablet:gap-4">
                <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold text-[#9F9F9F] dark:text-gray-900 tablet:text-[2.083vw]">
                  You are all caught up!
                </p>
                <button
                  className={`${
                    persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                  }  inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                  onClick={() => {
                    dispatch(updateSharedLinkSearch(''));
                  }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
