import { GrClose } from 'react-icons/gr';
import { FaSpinner } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../../../../../utils/useDebounce';
import { hiddenPostFilters, updateSearch } from '../../../../../features/profile/hiddenPosts';
import QuestionCard from '../../QuestStartSection/components/QuestionCard';
import api from '../../../../../services/api/Axios';

export default function HiddenPosts() {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const getHiddenPostFilters = useSelector(hiddenPostFilters);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [hiddenSearch, setHiddenSearch] = useState('');

  const handleHiddenPostSearch = (e) => {
    setHiddenSearch(e.target.value);
  };

  const debouncedHiddenSearch = useDebounce(hiddenSearch, 1000);

  useEffect(() => {
    dispatch(updateSearch(debouncedHiddenSearch));
  }, [debouncedHiddenSearch]);

  useEffect(() => {
    if (getHiddenPostFilters.searchData === '') {
      setHiddenSearch('');
    }
  }, [getHiddenPostFilters.searchData]);

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

  const fetchPosts = async function getInfoQuestions({ pageParam }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      type: 'All',
      Page: 'Hidden',
      terms: getHiddenPostFilters.searchData,
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['hiddenPosts', getHiddenPostFilters.searchData],
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
            postProperties={'HiddenPosts'}
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
            postProperties={'HiddenPosts'}
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

  return (
    <>
      {/* Summary Section */}
      <div className="mx-[15px] mb-3 tablet:mx-6 tablet:mb-5">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/summary/hidden-post-logo.svg`}
              alt={'badge'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Hidden Posts</h1>
          </div>
          {/* <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            3/10
          </h1> */}
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Not every post may be for you - and that’s ok. If you decide to unhide a post, you can earn FDX by engaging
            with it.
          </h1>
          <div className="mt-[10px] flex items-center justify-center gap-2 tablet:mt-4 tablet:gap-6">
            <div className="max-w-28 pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                Posts you’ve hidden
              </h1>
              <h5 className="text-center text-[18px] font-normal text-[#85898C]">3</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-[15px] my-2 mr-4 flex justify-end tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
        {/* <h1 className="text-[12px] font-semibold leading-[17px] text-[#4A8DBD] tablet:text-[25px] tablet:font-semibold  tablet:leading-[30px] dark:text-[#B8B8B8]">
          Hidden Posts
        </h1> */}
        <div className="relative">
          <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:outline-none focus:ring-0 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px] dark:border-gray-600 dark:text-[#707175]"
              value={hiddenSearch}
              placeholder=""
              onChange={handleHiddenPostSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175]  duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C]"
            >
              Search
            </label>
            {getHiddenPostFilters.searchData && (
              <button
                className="absolute right-1.5 top-[55%] -translate-y-1/2 transform tablet:right-3 tablet:top-1/2 "
                onClick={() => {
                  dispatch(updateSearch(''));
                }}
              >
                <GrClose className="h-2 w-2 text-[#ACACAC] tablet:h-4 tablet:w-4 dark:text-white" />
              </button>
            )}
            {!getHiddenPostFilters.searchData && (
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
              {getHiddenPostFilters.searchData && data?.pages[0].length == 0 ? (
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
                      onClick={() => dispatch(updateSearch(''))}
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              ) : !getHiddenPostFilters.searchData && data?.pages[0].length === 0 ? (
                <p className="text-center text-[4vw] laptop:text-[2vw]">
                  <b>No hidden posts!</b>
                </p>
              ) : !getHiddenPostFilters.searchData ? (
                <p className="text-center text-[4vw] laptop:text-[2vw]">
                  <b>No more hidden posts!</b>
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
                    onClick={() => dispatch(updateSearch(''))}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
