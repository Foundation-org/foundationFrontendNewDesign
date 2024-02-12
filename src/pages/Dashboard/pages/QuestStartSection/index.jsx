import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import QuestionCard from './components/QuestionCard';
import SidebarLeft from '../../components/SidebarLeft';
import SidebarRight from '../../components/SidebarRight';
import QuestionCardWithToggle from './components/QuestionCardWithToggle';

// Utilities and Constants
import { useDebounce } from '../../../../utils/useDebounce';
import { printEndMessage } from '../../../../utils';
import { initialColumns } from '../../../../constants/preferences';
import * as QuestServices from '../../../../services/queries/quest';
import * as filtersActions from '../../../../features/sidebar/filtersSlice';
import * as prefActions from '../../../../features/preferences/prefSlice';

const QuestStartSection = () => {
  // Redux State
  const getPreferences = useSelector(prefActions.getPrefs);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(filtersActions.getFilters);

  // Debounce Search

  // Pagination
  const pageLimit = 5;
  const [pagination, setPagination] = useState({
    page: 1,
    sliceStart: 0,
    sliceEnd: pageLimit,
  });

  // Data
  const [submitResponse, setSubmitResponse] = useState();
  const [allData, setAllData] = useState([]);

  // Test and Result States
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);

  // Preferences
  const [columns, setColumns] = useState(initialColumns);
  const [itemsWithCross, setItemsWithCross] = useState([]);

  // Quest Services
  const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();
  const { data: prefSearchRes } = QuestServices.useSearchTopics(getPreferences);
  const { data: bookmarkedData } = QuestServices.useGetBookmarkData();
  const { data: feedData } = QuestServices.useGetFeedData(filterStates, filterStates.searchData, pagination, columns, {
    _page: pagination.page,
    _limit: pageLimit,
    start: pagination.sliceStart,
    end: pagination.sliceEnd,
    uuid: persistedUserInfo?.uuid,
  });
  // Update Columns based on Preferences
  useEffect(() => {
    if (prefSearchRes?.length !== 0) {
      setColumns((prevColumns) => {
        const newList = prefSearchRes?.data.data || [];
        const filteredList = newList.filter(
          (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
        );

        return {
          ...prevColumns,
          All: {
            ...prevColumns.All,
            list: filteredList || [],
          },
        };
      });
    } else {
      if (isSuccess) {
        setColumns((prevColumns) => {
          const newList = topicsData?.data.data || [];
          const filteredList = newList.filter(
            (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
          );

          return {
            ...prevColumns,
            All: {
              ...prevColumns.All,
              list: filteredList || [],
            },
          };
        });
      }
    }
  }, [topicsData, prefSearchRes, isSuccess]);

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
    // if (pagination.page === 1 && !allData?.some((item) => item?.title === 'You are all caught up')) {
    // if (pagination.page === 1) {
    //   setAllData(feedData?.data || []);
    // } else {
    //   setAllData((prevData) => [...prevData, ...(feedData?.data || [])]);
    // }

    if (pagination.page === 1) {
      setPagination({
        page: 1,
        sliceStart: 0,
        sliceEnd: pageLimit,
      });

      setAllData((feedData?.data || []).map((item) => ({ ...item, pagination })));
    } else {
      setAllData((prevData) => [...prevData, ...(feedData?.data || []).map((item) => ({ ...item, pagination }))]);
      // setAllData((prevData) => {
      //   const newData = (feedData?.data || []).map((item) => ({ ...item, pagination }));

      //   const uniqueIds = new Set(prevData.map((item) => item._id));
      //   const filteredNewData = newData.filter((item) => !uniqueIds.has(item._id));

      //   return [...prevData, ...filteredNewData];
      // });
    }

    // if (feedData && !feedData?.hasNextPage) {
    //   const newItem = { title: 'You are all caught up' };
    //   setAllData((prevData) => [...prevData, newItem]);
    // }
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

  // Reset pagination and fetch new data when hasNextPage is false
  // useEffect(() => {
  //   console.log('i am getting called', feedData);
  //   if (feedData !== undefined && feedData?.hasNextPage === false) {
  //     setPagination({
  //       page: 1,
  //       sliceStart: 0,
  //       sliceEnd: pageLimit,
  //     });
  //   }
  // }, [feedData]);

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

  // Function to update allData based on submitResponse
  const updateAllData = () => {
    if (submitResponse) {
      setAllData((prevData) => {
        const newData = [...prevData];

        // Find the index of the existing question in allData
        const existingIndex = newData.findIndex((data) => data._id === submitResponse._id);

        // If the question exists in allData, replace the whole object; otherwise, add it to the array
        if (existingIndex !== -1) {
          newData[existingIndex] = submitResponse;
        } else {
          newData.push(submitResponse);
        }

        return newData;
      });
    }
  };

  // Call the function whenever submitResponse changes
  useEffect(() => {
    if (submitResponse !== null) {
      updateAllData();
    }
  }, [submitResponse]);

  console.log('🚀 ~ QuestStartSection ~ allData:', allData);

  return (
    <div className="flex w-full flex-col bg-white dark:bg-black laptop:flex-row">
      <SidebarLeft
        columns={columns}
        setColumns={setColumns}
        itemsWithCross={itemsWithCross}
        setItemsWithCross={setItemsWithCross}
      />
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-[#F3F3F3] px-[1.13rem] py-[0.63rem] dark:bg-[#242424] tablet:min-h-[calc(100vh-92px)] tablet:py-[0.94rem]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          endMessage={printEndMessage(feedData, filterStates, allData, persistedTheme)}
          height={'calc(100vh - 92px)'}
          className="no-scrollbar"
        >
          <div id="section-1" className="flex flex-col gap-2 tablet:gap-[0.94rem]">
            {allData &&
              allData?.map((item, index) => (
                <div key={index + 1}>
                  {filterStates.expandedView ? (
                    <QuestionCardWithToggle
                      questStartData={item}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => bookmark.questForeignKey === item._id)}
                      setPagination={setPagination}
                      submitResponse={submitResponse}
                      setSubmitResponse={setSubmitResponse}
                    />
                  ) : (
                    <QuestionCard
                      questStartData={item}
                      startTest={startTest}
                      setStartTest={setStartTest}
                      viewResult={viewResult}
                      handleViewResults={memoizedViewResults}
                      handleStartTest={memoizedStartTest}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => bookmark.questForeignKey === item._id)}
                      setPagination={setPagination}
                      setSubmitResponse={setSubmitResponse}
                    />
                  )}
                </div>
              ))}
          </div>
          {/* <div id="section-1" className="flex flex-col gap-2 tablet:gap-[0.94rem]">
            {allData &&
              allData?.map((item, index) => (
                <div key={index + 1}>
                  {!item.title ? (
                    filterStates.expandedView ? (
                      <QuestionCardWithToggle
                        questStartData={item}
                        isBookmarked={bookmarkedData?.data.some((bookmark) => bookmark.questForeignKey === item._id)}
                      />
                    ) : (
                      <QuestionCard
                        questStartData={item}
                        startTest={startTest}
                        setStartTest={setStartTest}
                        viewResult={viewResult}
                        handleViewResults={memoizedViewResults}
                        handleStartTest={memoizedStartTest}
                        isBookmarked={bookmarkedData?.data.some((bookmark) => bookmark.questForeignKey === item._id)}
                      />
                    )
                  ) : (
                    <p className="text-center text-[4vw] tablet:text-[2vw]">
                      <b>You are all caught up!</b>
                    </p>
                  )}
                </div>
              ))}
          </div> */}
        </InfiniteScroll>
      </div>
      <SidebarRight />
    </div>
  );
};

export default QuestStartSection;
