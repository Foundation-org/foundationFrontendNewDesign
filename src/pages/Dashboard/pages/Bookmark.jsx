import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// components
import QuestionCard from './QuestStartSection/components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import QuestionCardWithToggle from './QuestStartSection/components/QuestionCardWithToggle';

// extras
import { FaSpinner } from 'react-icons/fa';
import { useDebounce } from '../../../utils/useDebounce';
import { initialColumns } from '../../../constants/preferences';
import { printEndMessage } from '../../../utils';
import * as QuestServices from '../../../services/queries/quest';
import * as prefActions from '../../../features/preferences/prefSlice';
import * as filtersActions from '../../../features/sidebar/bookmarkFilterSlice';

const Bookmark = () => {
  const getPreferences = useSelector(prefActions.getPrefs);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const filterStates = useSelector(filtersActions.getFilters);
  const debouncedSearch = useDebounce(filterStates.searchData, 1000);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const pageLimit = 5;
  const isBookmarked = true;
  const [pagination, setPagination] = useState({
    page: 1,
    sliceStart: 0,
    sliceEnd: pageLimit,
  });
  const [allData, setAllData] = useState([]);
  let params = {
    _page: pagination.page,
    _limit: pageLimit,
    start: pagination.sliceStart,
    end: pagination.sliceEnd,
    uuid: persistedUserInfo?.uuid,
    Page: 'Bookmark',
  };
  const [viewResult, setViewResult] = useState(null);
  const [startTest, setStartTest] = useState(null);

  useEffect(() => {
    if (filterStates.expandedView === false) {
      setStartTest(null);
      setViewResult(null);
    }
  }, [filterStates.expandedView]);

  // preferences start
  const [columns, setColumns] = useState(initialColumns);

  const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();

  const { data: prefSearchRes } = QuestServices.useSearchTopics(getPreferences);

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
  }, [topicsData, prefSearchRes]);
  // preferences end

  const { data: bookmarkedData } = QuestServices.useGetBookmarkData();

  const { data: feedData } = QuestServices.useGetBookmarkFeedData(
    filterStates,
    filterStates.searchData===""?filterStates.searchData:debouncedSearch,
    pagination,
    columns,
    params,
  );

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      sliceStart: 0,
      sliceEnd: pageLimit,
      page: 1,
    }));
    setAllData([]);
  }, [filterStates, filterStates.searchData]);

  useEffect(() => {
    if (pagination.page === 1) {
      setAllData([]);
    }
    if (feedData && feedData.data) {
      if (allData.length === 0) {
        setAllData(feedData.data);
      } else {
        setAllData((prevData) => [...prevData, ...(feedData.data || [])]);
      }
    }
  }, [feedData, filterStates]);

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

  const fetchMoreData = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

  const handleStartTest = (testId) => {
    setStartTest((prev) => (prev === testId ? null : testId));
  };

  const handleViewResults = (testId) => {
    setViewResult((prev) => (prev === testId ? null : testId));
  };

  // const printNoRecords = (persistedTheme) => {
  //   <div className="my-[15vh] flex  flex-col justify-center">
  //     {persistedTheme === 'dark' ? (
  //       <img src="../../../../../public/assets/svgs/dashboard/noposts.png" alt="noposts image" />
  //     ) : (
  //       <img src="../../../../../public/assets/svgs/dashboard/noposts.png" alt="noposts image" />
  //     )}
  //     <p className="text-[#9F9F9F]-600 font-inter mt-[1.319vw] text-center text-[2.083vw] dark:text-gray">
  //       No Matching Posts Found
  //     </p>
  //   </div>
  // };

  console.log({ allData });

  return (
    <div className="flex w-full flex-col bg-white dark:bg-black laptop:flex-row">
      <SidebarLeft columns={columns} setColumns={setColumns} />
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-[#F3F3F3] px-[1.13rem] py-[0.63rem] dark:bg-[#242424] tablet:min-h-[calc(100vh-92px)] tablet:py-[0.94rem]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          endMessage={printEndMessage(feedData, filterStates, allData, persistedTheme, isBookmarked)}
          // endMessage={
          //   feedData?.hasNextPage === false ? (
          //     <div className="flex justify-between gap-4 px-4 py-3 tablet:py-[27px]">
          //       <div></div>
          //       {filterStates.searchData && allData.length == 0 ? (
          //         <div className="my-[15vh] flex  flex-col justify-center">
          //           {persistedTheme === 'dark' ? (
          //             <img src="../../../../../public/assets/svgs/dashboard/noposts.png" alt="noposts image" />
          //           ) : (
          //             <img src="../../../../../public/assets/svgs/dashboard/noposts.png" alt="noposts image" />
          //           )}
          //           <p className="text-[#9F9F9F]-600 font-inter mt-[1.319vw] text-center text-[2.083vw] dark:text-gray">
          //             No Matching Posts Found
          //           </p>
          //         </div>
          //       ) : !filterStates.searchData && allData.length === 0 ? (
          //         <>{printNoRecords(persistedTheme)}</>
          //       ) : (
          //         !filterStates.searchData && (
          //           <p className="text-center  text-[2vw] dark:text-gray">
          //             <b>No more bookmarks!</b>
          //           </p>
          //         )
          //       )}
          //       <div></div>
          //     </div>
          //   ) : (
          //     <div className="flex items-center justify-center">
          //       <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
          //     </div>
          //   )
          // }
          height={'88vh'}
          className="no-scrollbar "
        >
          <div id="section-1" className="flex flex-col gap-2 tablet:gap-[0.94rem]">
            {filterStates.expandedView
              ? allData?.map((item, index) => (
                  <div key={index + 1}>
                    <QuestionCardWithToggle
                      questStartData={item}
                      id={item._id}
                      img="/assets/svgs/dashboard/badge.svg"
                      alt="badge"
                      badgeCount="5"
                      title={
                        item?.whichTypeQuestion === 'agree/disagree'
                          ? 'Agree/Disagree'
                          : item?.whichTypeQuestion === 'like/dislike'
                            ? 'Like/Dislike'
                            : item?.whichTypeQuestion === 'multiple choise'
                              ? 'Multiple Choice'
                              : item?.whichTypeQuestion === 'ranked choise'
                                ? 'Ranked Choice'
                                : item?.whichTypeQuestion === 'yes/no'
                                  ? 'Yes/No'
                                  : null
                      }
                      answers={item?.QuestAnswers}
                      time={item?.createdAt}
                      multipleOption={item?.userCanSelectMultiple}
                      question={item?.Question}
                      whichTypeQuestion={item?.whichTypeQuestion}
                      startTest={startTest}
                      setStartTest={setStartTest}
                      viewResult={viewResult}
                      setViewResult={setViewResult}
                      handleViewResults={handleViewResults}
                      handleStartTest={handleStartTest}
                      usersAddTheirAns={item?.usersAddTheirAns}
                      startStatus={item?.startStatus}
                      createdBy={item?.uuid}
                      btnColor={
                        item?.startStatus === 'completed'
                          ? 'bg-[#4ABD71]'
                          : item?.startStatus === 'change answer'
                            ? 'bg-[#FDD503]'
                            : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                      }
                      btnText={item?.startStatus}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => {
                        return bookmark.questForeignKey === item._id;
                      })}
                      lastInteractedAt={item.lastInteractedAt}
                      usersChangeTheirAns={item.usersChangeTheirAns}
                      expandedView={filterStates.expandedView}
                      QuestTopic={item.QuestTopic}
                      isBookmarkTab={true}
                    />
                  </div>
                ))
              : allData?.map((item, index) => (
                  <div key={index + 1}>
                    <QuestionCard
                      questStartData={item}
                      id={item._id}
                      img="/assets/svgs/dashboard/badge.svg"
                      alt="badge"
                      badgeCount="5"
                      title={
                        item?.whichTypeQuestion === 'agree/disagree'
                          ? 'Agree/Disagree'
                          : item?.whichTypeQuestion === 'like/dislike'
                            ? 'Like/Dislike'
                            : item?.whichTypeQuestion === 'multiple choise'
                              ? 'Multiple Choice'
                              : item?.whichTypeQuestion === 'ranked choise'
                                ? 'Ranked Choice'
                                : item?.whichTypeQuestion === 'yes/no'
                                  ? 'Yes/No'
                                  : null
                      }
                      answers={item?.QuestAnswers}
                      time={item?.createdAt}
                      multipleOption={item?.userCanSelectMultiple}
                      question={item?.Question}
                      whichTypeQuestion={item?.whichTypeQuestion}
                      startTest={startTest}
                      setStartTest={setStartTest}
                      viewResult={viewResult}
                      usersAddTheirAns={item?.usersAddTheirAns}
                      handleViewResults={handleViewResults}
                      handleStartTest={handleStartTest}
                      startStatus={item?.startStatus}
                      createdBy={item?.uuid}
                      btnColor={
                        item?.startStatus === 'completed'
                          ? 'bg-[#4ABD71]'
                          : item?.startStatus === 'change answer'
                            ? 'bg-[#FDD503]'
                            : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                      }
                      btnText={item?.startStatus}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => {
                        return bookmark.questForeignKey === item._id;
                      })}
                      lastInteractedAt={item.lastInteractedAt}
                      usersChangeTheirAns={item.usersChangeTheirAns}
                      expandedView={filterStates.expandedView}
                      QuestTopic={item.QuestTopic}
                      isBookmarkTab={true}
                    />
                  </div>
                ))}
          </div>
        </InfiniteScroll>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Bookmark;
