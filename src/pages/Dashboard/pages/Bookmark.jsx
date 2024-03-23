import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

// components
import QuestionCard from './QuestStartSection/components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import QuestionCardWithToggle from './QuestStartSection/components/QuestionCardWithToggle';

// extras
import { initialColumns } from '../../../constants/preferences';
import { printEndMessage } from '../../../utils';
import * as QuestServices from '../../../services/queries/quest';
import * as filtersActions from '../../../features/sidebar/bookmarkFilterSlice';
import * as questUtilsActions from '../../../features/quest/utilsSlice';
import Slider from '../../../components/Slider';

const Bookmark = () => {
  const dispatch = useDispatch();

  // Redux State
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(filtersActions.getFilters);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);

  // Pagination
  const pageLimit = 5;
  const isBookmarked = true;
  const [pagination, setPagination] = useState({
    page: 1,
    sliceStart: 0,
    sliceEnd: pageLimit,
  });

  // Data
  const [submitResponse, setSubmitResponse] = useState();
  const [allData, setAllData] = useState([]);

  // Test and Result States
  const [viewResult, setViewResult] = useState(null);
  const [startTest, setStartTest] = useState(null);

  // Preferences
  const columnsData = localStorage.getItem('bookmarkColumns');
  const parsedColumns = JSON.parse(columnsData);
  const [columns, setColumns] = useState(parsedColumns || initialColumns);
  const [itemsWithCross, setItemsWithCross] = useState(filterStates.itemsWithCross || []);

  const [height, setHeight] = useState('calc(100vh - 164.3px)');

  // Quest Services
  const { data: bookmarkedData } = QuestServices.useGetBookmarkData();
  const { data: feedData } = QuestServices.useGetBookmarkFeedData(
    filterStates,
    filterStates.searchData,
    pagination,
    columns,
    {
      _page: pagination.page,
      _limit: pageLimit,
      start: pagination.sliceStart,
      end: pagination.sliceEnd,
      uuid: persistedUserInfo?.uuid,
      Page: 'Bookmark',
      moderationRatingFilter: filterStates.moderationRatingFilter,
    },
  );

  // Reset Preferences
  useEffect(() => {
    if (!filterStates.isColumns) {
      const currentColumns = { ...columns };

      const stateString = JSON.stringify({
        All: {
          id: 'All',
          list: [],
        },
        Block: {
          id: 'Block',
          list: [],
        },
      });
      localStorage.setItem('bookmarkColumns', stateString);

      currentColumns.Block = {
        id: 'Block',
        list: [],
      };

      setColumns(currentColumns);
    }
  }, [filterStates.isColumns]);

  // Make StartTest and ViewResult fall initially for bookmark
  // useEffect(() => {
  //   if (filterStates.expandedView === false) {
  //     setStartTest(null);
  //     setViewResult(null);
  //   }
  // }, [filterStates.expandedView]);

  // Update Preferences Columns in redux
  useEffect(() => {
    const stateString = JSON.stringify(columns);
    localStorage.setItem('bookmarkColumns', stateString);
    dispatch(filtersActions.setIsColumn());
  }, [columns]);

  // Update Columns based on Preferences
  useEffect(() => {
    dispatch(filtersActions.setItemWithCross(itemsWithCross));
  }, [itemsWithCross]);

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
  // useEffect(() => {
  //   if (pagination.page === 1) {
  //     setPagination({
  //       page: 1,
  //       sliceStart: 0,
  //       sliceEnd: pageLimit,
  //     });

  //     setAllData((feedData?.data || []).map((item) => ({ ...item, pagination })));
  //   } else {
  //     setAllData((prevData) => [...prevData, ...(feedData?.data || []).map((item) => ({ ...item, pagination }))]);
  //   }
  // }, [feedData, filterStates, pagination.page]);

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
  const fetchMoreData = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

  // Memoized Callbacks
  const handleStartTest = (testId) => {
    setStartTest((prev) => (prev === testId ? null : testId));
  };

  const handleViewResults = (testId) => {
    setViewResult((prev) => (prev === testId ? null : testId));
  };

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

  function addSharedLinkObjById() {
    const updatedArray = allData.map((item) => {
      if (item._id === questUtils?.sharedLinkPost.questForeignKey) {
        return {
          ...item,
          userQuestSetting: questUtils?.sharedLinkPost,
        };
      }
      return item;
    });

    setAllData(updatedArray);
  }

  // Call the function whenever submitResponse changes of sharedLink
  useEffect(() => {
    if (questUtils?.sharedLinkPost !== null) {
      addSharedLinkObjById();
    }
  }, [questUtils?.sharedLinkPost]);

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerWidth <= 744 ? 'calc(100vh - 164.3px)' : 'calc(100vh - 92px)';
      setHeight(newHeight);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // console.log('🚀 ~ Bookmark ~ allData:', allData);

  return (
    <div className="w-full bg-[#F3F3F3] dark:bg-black">
      <div className="mx-auto flex w-full max-w-[1378px] flex-col laptop:flex-row">
        <SidebarLeft
          columns={columns}
          setColumns={setColumns}
          itemsWithCross={itemsWithCross}
          setItemsWithCross={setItemsWithCross}
        />
        <div className="no-scrollbar mx-auto flex h-full w-full max-w-[778px] flex-col overflow-y-auto bg-[#F3F3F3] tablet:min-h-[calc(100vh-92px)] dark:bg-[#242424]">
          {/* <Slider columns={columns} setColumns={setColumns} /> */}
          <InfiniteScroll
            dataLength={allData?.length}
            next={fetchMoreData}
            hasMore={feedData?.hasNextPage}
            endMessage={printEndMessage(feedData, filterStates, allData, persistedTheme, isBookmarked)}
            height={height}
            className="no-scrollbar px-4 py-[10px] tablet:px-6 tablet:py-5"
          >
            <div id="section-1" className="flex flex-col gap-2 tablet:gap-[0.94rem]">
              {
                // filterStates.expandedView
                //   ?
                allData
                  .filter((item) => !questUtils.hiddenPosts.includes(item._id))
                  ?.map((item, index) => (
                    <div key={index + 1}>
                      <QuestionCardWithToggle
                        questStartData={item}
                        setPagination={setPagination}
                        submitResponse={submitResponse}
                        setSubmitResponse={setSubmitResponse}
                        id={item._id}
                        img={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                        alt="badge"
                        badgeCount="5"
                        title={
                          item?.whichTypeQuestion === 'agree/disagree'
                            ? 'Agree/Disagree'
                            : item?.whichTypeQuestion === 'like/dislike'
                              ? 'Like/Dislike'
                              : item?.whichTypeQuestion === 'multiple choise'
                                ? 'Multiple Choice'
                                : item?.whichTypeQuestion === 'open choice'
                                  ? 'Open Choice'
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
                        expandedView={true}
                        QuestTopic={item.QuestTopic}
                        isBookmarkTab={true}
                      />
                    </div>
                  ))
                // : allData?.map((item, index) => (
                //     <div key={index + 1}>
                //       <QuestionCard
                //         questStartData={item}
                //         setPagination={setPagination}
                //         id={item._id}
                //         img={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                //         alt="badge"
                //         badgeCount="5"
                //         title={
                //           item?.whichTypeQuestion === 'agree/disagree'
                //             ? 'Agree/Disagree'
                //             : item?.whichTypeQuestion === 'like/dislike'
                //               ? 'Like/Dislike'
                //               : item?.whichTypeQuestion === 'multiple choise'
                //                 ? 'Multiple Choice'
                //                 : item?.whichTypeQuestion === 'open choice'
                //                   ? 'Open Choice'
                //                   : item?.whichTypeQuestion === 'ranked choise'
                //                     ? 'Ranked Choice'
                //                     : item?.whichTypeQuestion === 'yes/no'
                //                       ? 'Yes/No'
                //                       : null
                //         }
                //         answers={item?.QuestAnswers}
                //         setSubmitResponse={setSubmitResponse}
                //         time={item?.createdAt}
                //         multipleOption={item?.userCanSelectMultiple}
                //         question={item?.Question}
                //         whichTypeQuestion={item?.whichTypeQuestion}
                //         startTest={startTest}
                //         setStartTest={setStartTest}
                //         viewResult={viewResult}
                //         usersAddTheirAns={item?.usersAddTheirAns}
                //         handleViewResults={handleViewResults}
                //         handleStartTest={handleStartTest}
                //         startStatus={item?.startStatus}
                //         createdBy={item?.uuid}
                //         btnColor={
                //           item?.startStatus === 'completed'
                //             ? 'bg-[#4ABD71]'
                //             : item?.startStatus === 'change answer'
                //               ? 'bg-[#FDD503]'
                //               : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                //         }
                //         btnText={item?.startStatus}
                //         isBookmarked={bookmarkedData?.data.some((bookmark) => {
                //           return bookmark.questForeignKey === item._id;
                //         })}
                //         lastInteractedAt={item.lastInteractedAt}
                //         usersChangeTheirAns={item.usersChangeTheirAns}
                //         expandedView={filterStates.expandedView}
                //         QuestTopic={item.QuestTopic}
                //         isBookmarkTab={true}
                //       />
                //     </div>
                //   ))
              }
            </div>
          </InfiniteScroll>
        </div>
        <SidebarRight />
      </div>
    </div>
  );
};

export default Bookmark;
