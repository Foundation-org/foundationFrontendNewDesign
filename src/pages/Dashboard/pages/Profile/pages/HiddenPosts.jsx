import { GrClose } from 'react-icons/gr';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { initialColumns } from '../../../../../constants/preferences';

import InfiniteScroll from 'react-infinite-scroll-component';
import QuestionCard from '../../QuestStartSection/components/QuestionCard';

import * as QuestServices from '../../../../../services/queries/quest';

export default function HiddenPosts() {
  const pageLimit = 1000;
  const [pagination, setPagination] = useState({
    page: 1,
    sliceStart: 0,
    sliceEnd: pageLimit,
  });

  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const [allData, setAllData] = useState([]);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [filterStates, setFilterStates] = useState({
    filterBySort: 'Newest First',
    filterByType: '',
    searchData: '',
  });

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setFilterStates((prevState) => ({
      ...prevState,
      searchData: searchTerm,
    }));
  };

  const { data: feedData } = QuestServices.useGetHiddenFeedData(
    filterStates,
    filterStates.searchData,
    pagination,
    initialColumns,
    {
      Page: 'Hidden',
      _page: pagination.page,
      _limit: pageLimit,
      start: pagination.sliceStart,
      end: pagination.sliceEnd,
      uuid: persistedUserInfo?.uuid,
    },
  );

  // Update Data on Filter Changes
  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      sliceStart: 0,
      sliceEnd: pageLimit,
      page: 1,
    }));
    setAllData([]);
  }, [filterStates, filterStates.searchData]);

  // Update Data on FeedData Changes
  useEffect(() => {
    if (pagination.page === 1) {
      setAllData(feedData?.data || []);
    } else {
      setAllData((prevData) => {
        const newData = [...prevData, ...(feedData?.data || [])];

        const uniqueData = newData.filter(
          (item, index, array) => array.findIndex((data) => data._id === item._id) === index,
        );

        return uniqueData;
      });
    }
  }, [feedData, filterStates, pagination.page]);

  // Update Pagination on Page Change
  useEffect(() => {
    if (pagination.page === 1) {
      setPagination((prevPagination) => ({
        ...prevPagination,
        sliceStart: 0,
        sliceEnd: pageLimit,
      }));
    } else {
      setPagination((prevPagination) => ({
        ...prevPagination,
        sliceStart: prevPagination.sliceEnd,
        sliceEnd: prevPagination.sliceEnd + pageLimit,
      }));
    }
  }, [pagination.page]);

  // Fetch More Data on Infinite Scroll
  const fetchMoreData = useCallback(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  }, []);

  // Memoized Callbacks
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

  return (
    <div>
      <div className="pt-[5px] ml-[32px] mr-4 tablet:ml-[97px] tablet:mr-[70px] flex justify-between">
        <h1 className=" text-[12px] font-semibold leading-[14.52px] text-[#4A8DBD] tablet:leading-[30px] tablet:font-semibold  tablet:text-[25px] dark:text-[#B8B8B8]">
          Hidden Posts
        </h1>
        <div className="relative">
          <div className="relative h-[15.96px] tablet:h-[45px] w-[128px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[3.55px] tablet:rounded-[10px] border-[0.71px] tablet:border-2 border-[#707175] bg-transparent py-2 pl-2 tablet:pl-5 pr-8 leading-[7.25px] text-[#707175] focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-[#707175] text-[6px] tablet:text-[18.23px]"
              value={filterStates.searchData}
              placeholder=""
              onChange={handleSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 text-[8.33px] leading-[10px] absolute left-[15px] start-1 top-[10px] tablet:top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F3F3F3] px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C] tablet:text-[18px] tablet:leading-[21.78px]"
            >
              Search
            </label>
            {filterStates.searchData && (
              <button
                className="absolute right-1.5 tablet:right-3 top-[55%] tablet:top-1/2 transform -translate-y-1/2 "
                onClick={() => {
                  setFilterStates((prevState) => ({
                    ...prevState,
                    searchData: '',
                  }));
                }}
              >
                <GrClose className="h-2 w-2 tablet:h-4 tablet:w-4 text-[#ACACAC] dark:text-white" />
              </button>
            )}
            {!filterStates.searchData && (
              <img
                src="/assets/svgs/dashboard/search.svg"
                alt="search"
                className="absolute right-1.5 tablet:right-3 top-[55%] tablet:top-1/2 transform -translate-y-1/2 h-2 w-2 tablet:h-4 tablet:w-4"
              />
            )}
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex h-full w-[91.67%] tablet:w-[73.6%] mx-auto mt-5 flex-col overflow-y-auto bg-[#F3F3F3] dark:bg-[#242424] pb-[3rem] tablet:pt-[0.94rem] tablet:pb-[6rem]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          endMessage={
            feedData?.hasNextPage === false ? (
              <div className="flex justify-between gap-4 px-4 pt-3 pb-[5rem] tablet:py-[27px]">
                <div></div>
                {filterStates.searchData && allData.length == 0 ? (
                  <div className="my-[15vh] flex  flex-col justify-center items-center">
                    {persistedTheme === 'dark' ? (
                      <img src="/assets/svgs/dashboard/noMatchingDark.svg" alt="noposts image" />
                    ) : (
                      <img
                        src="/assets/svgs/dashboard/noMatchingLight.svg"
                        alt="noposts image"
                        className="w-[160px] h-[173px]"
                      />
                    )}
                    <div className="flex flex-col items-center gap-[6px] tablet:gap-4">
                      <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] tablet:text-[2.083vw] text-[#9F9F9F] dark:text-gray font-bold">
                        No matching posts found!
                      </p>
                      <button
                        className={`${
                          persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                        }  inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                        onClick={() => {
                          setFilterStates((prevState) => ({
                            ...prevState,
                            searchData: '',
                          }));
                        }}
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                ) : !filterStates.searchData && allData.length === 0 ? (
                  <p className="text-center text-[4vw] tablet:text-[2vw]">
                    <b>No hidden posts!</b>
                  </p>
                ) : !filterStates.searchData ? (
                  <p className="text-center text-[4vw] tablet:text-[2vw]">
                    <b>No more hidden posts!</b>
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-[6px] tablet:gap-4">
                    <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] tablet:text-[2.083vw] text-[#9F9F9F] dark:text-gray font-bold">
                      You are all caught up!
                    </p>
                    <button
                      className={`${
                        persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                      }  inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                      onClick={() => {
                        setFilterStates((prevState) => ({
                          ...prevState,
                          searchData: '',
                        }));
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
            )
          }
          height={'calc(100vh - 92px)'}
          className="no-scrollbar"
        >
          <div id="section-1" className="flex flex-col gap-2 tablet:gap-[0.94rem]">
            {allData &&
              allData.map((item, index) => (
                <div key={index + 1}>
                  <QuestionCard
                    isQuestHidden={'HiddenPosts'}
                    questStartData={item}
                    startTest={startTest}
                    setStartTest={setStartTest}
                    viewResult={viewResult}
                    handleViewResults={memoizedViewResults}
                    handleStartTest={memoizedStartTest}
                    setPagination={setPagination}
                  />
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
