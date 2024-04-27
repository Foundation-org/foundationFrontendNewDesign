import * as filtersActions from '../../../../features/sidebar/filtersSlice';
import * as questUtilsActions from '../../../../features/quest/utilsSlice';
import MediaControls from '../../../../components/MediaControls';
import SidebarLeft from '../../components/SidebarLeft';
import QuestionCardWithToggle from './components/QuestionCardWithToggle';
import Slider from '../../../../components/Slider';
import api from '../../../../services/api/Axios';

import { useEffect } from 'react';
import { printEndMessage } from '../../../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

// import { useCallback, useRef, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';

// Components
// import QuestionCard from './components/QuestionCard';
// import SidebarRight from '../../components/SidebarRight';

// Utilities and Constants
// import { printEndMessage } from '../../../../utils';
// import { initialColumns } from '../../../../constants/preferences';
// import * as QuestServices from '../../../../services/queries/quest';

// Icons
// import { GrClose } from 'react-icons/gr';
// import { setFilterStates } from '../../../../services/api/userAuth';
// import { useMutation } from '@tanstack/react-query';
// import { FaSpinner } from 'react-icons/fa';
// New

const QuestStartSection = () => {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const filterStates = useSelector(filtersActions.getFilters);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  // Redux State
  // const persistedTheme = useSelector((state) => state.utils.theme);
  // const [playerPlayingId, setPlayingPlayerId] = useState();
  // const [isShowPlayer, setIsShowPlayer] = useState(false);

  // Pagination
  // const pageLimit = 5;
  // const [pagination, setPagination] = useState({
  //   page: 1,
  //   sliceStart: 0,
  //   sliceEnd: pageLimit,
  // });

  // Data
  // const [submitResponse, setSubmitResponse] = useState();
  // const [allData, setAllData] = useState([]);

  // Test and Result States
  // const [startTest, setStartTest] = useState(null);
  // const [viewResult, setViewResult] = useState(null);
  // const [sliderLoading, setSliderloading] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);

  // Preferences
  // const columnsData = localStorage.getItem('columns');
  // const parsedColumns = JSON.parse(columnsData);
  // const [columns, setColumns] = useState(parsedColumns || initialColumns);
  // const [itemsWithCross, setItemsWithCross] = useState(filterStates.itemsWithCross || []);

  // const [height, setHeight] = useState('calc(100dvh - 147.63px)');

  // Quest Services
  // const { data: bookmarkedData } = QuestServices.useGetBookmarkData();
  // const {
  //   data: feedData,
  //   isLoading,
  //   isFetching,
  // } = QuestServices.useGetFeedData(
  //   filterStates,
  //   filterStates.searchData,
  //   pagination,
  //   filterStates.topics !== undefined
  //     ? filterStates.topics
  //     : {
  //         All: {
  //           id: 'All',
  //           list: [],
  //         },
  //         Block: {
  //           id: 'Block',
  //           list: [],
  //         },
  //       },
  //   {
  //     _page: pagination.page,
  //     _limit: pageLimit,
  //     start: pagination.sliceStart,
  //     end: pagination.sliceEnd,
  //     uuid: persistedUserInfo?.uuid,
  //     moderationRatingFilter: filterStates.moderationRatingFilter,
  //   },
  // );

  // Reset Preferences
  // useEffect(() => {
  //   if (!filterStates.isColumns) {
  //     const currentColumns = { ...columns };

  //     const stateString = JSON.stringify({
  //       All: {
  //         id: 'All',
  //         list: [],
  //       },
  //       Block: {
  //         id: 'Block',
  //         list: [],
  //       },
  //     });
  //     localStorage.setItem('columns', stateString);

  //     currentColumns.Block = {
  //       id: 'Block',
  //       list: [],
  //     };

  //     setColumns(currentColumns);
  //   }
  // }, [filterStates.isColumns]);

  // Update Preferences Columns in redux
  // useEffect(() => {
  //   // const stateString = JSON.stringify(columns);
  //   // localStorage.setItem('columns', stateString);
  //   // dispatch(filtersActions.setIsColumn());

  //   setPagination((prevPagination) => ({
  //     ...prevPagination,
  //     sliceStart: 0,
  //     sliceEnd: pageLimit,
  //     page: 1,
  //   }));
  // }, [filterStates.topics]);

  // Update Columns based on Preferences
  // useEffect(() => {
  //   dispatch(filtersActions.setItemWithCross(itemsWithCross));
  // }, [itemsWithCross]);

  // Update Data on Filter Changes
  // useEffect(() => {
  //   setPagination((prevPagination) => ({
  //     ...prevPagination,
  //     sliceStart: 0,
  //     sliceEnd: pageLimit,
  //     page: 1,
  //   }));
  //   setAllData([]);
  // }, [filterStates, filterStates.searchData]);

  // Update Data on FeedData Changes
  // useEffect(() => {
  //   if (pagination.page === 1) {
  //     setAllData(feedData?.data || []);
  //   } else {
  //     // setAllData((prevData) => {
  //     //   const newData = [...prevData, ...(feedData?.data || [])];

  //     //   const uniqueData = newData.filter(
  //     //     (item, index, array) => array.findIndex((data) => data._id === item._id) === index,
  //     //   );

  //     //   return uniqueData;
  //     // });
  //     setAllData((prevData) => {
  //       const newData = feedData?.data || [];
  //       const updatedData = [...prevData];

  //       newData.forEach((item) => {
  //         const exists = prevData.some((data) => data._id === item._id);
  //         if (!exists) {
  //           updatedData.push(item);
  //         }
  //       });

  //       return updatedData;
  //     });
  //   }
  //   if (!isLoading) {
  //     setSliderloading(false);
  //   }
  // }, [feedData, filterStates, pagination.page]);

  // Update Data on BookmarkData Changes
  // useEffect(() => {
  //   if (bookmarkedData) {
  //     bookmarkedData.data.forEach((bookmark) => {
  //       dispatch(questUtilsActions.addBookmarkResponse(bookmark));
  //     });
  //   }
  // }, [bookmarkedData]);

  // useEffect(() => {
  // if (pagination.page === 1 && !allData?.some((item) => item?.title === 'You are all caught up')) {
  // if (pagination.page === 1) {
  //   setAllData(feedData?.data || []);
  // } else {
  //   setAllData((prevData) => [...prevData, ...(feedData?.data || [])]);
  // }

  // if (pagination.page === 1) {
  //   setPagination({
  //     page: 1,
  //     sliceStart: 0,
  //     sliceEnd: pageLimit,
  //   });

  // setAllData((feedData?.data || []).map((item) => ({ ...item, pagination })));
  // } else {
  // setAllData((prevData) => [...prevData, ...(feedData?.data || []).map((item) => ({ ...item, pagination }))]);
  // setAllData((prevData) => {
  //   const newData = (feedData?.data || []).map((item) => ({ ...item, pagination }));

  //   const uniqueIds = new Set(prevData.map((item) => item._id));
  //   const filteredNewData = newData.filter((item) => !uniqueIds.has(item._id));

  //   return [...prevData, ...filteredNewData];
  // });
  // }

  // if (feedData && !feedData?.hasNextPage) {
  //   const newItem = { title: 'You are all caught up' };
  //   setAllData((prevData) => [...prevData, newItem]);
  // }
  // }, [feedData, filterStates, pagination.page]);

  // Update Pagination on Page Change
  // useEffect(() => {
  //   if (pagination.page === 1) {
  //     setPagination((prevPagination) => ({
  //       ...prevPagination,
  //       sliceStart: 0,
  //       sliceEnd: pageLimit,
  //     }));
  //   } else {
  //     setPagination((prevPagination) => ({
  //       ...prevPagination,
  //       sliceStart: prevPagination.sliceEnd,
  //       sliceEnd: prevPagination.sliceEnd + pageLimit,
  //     }));
  //   }
  // }, [pagination.page]);

  // Fetch More Data on Infinite Scroll
  // const fetchMoreData = useCallback(() => {
  //   setPagination((prevPagination) => ({
  //     ...prevPagination,
  //     page: prevPagination.page + 1,
  //   }));
  // }, []);

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
  // const memoizedStartTest = useCallback(
  //   (testId) => {
  //     setViewResult(null);
  //     setStartTest((prev) => (prev === testId ? null : testId));
  //   },
  //   [setViewResult, setStartTest],
  // );

  // const memoizedViewResults = useCallback(
  //   (testId) => {
  //     setStartTest(null);
  //     setViewResult((prev) => (prev === testId ? null : testId));
  //   },
  //   [setStartTest, setViewResult],
  // );

  // Function to update allData based on submitResponse
  // const updateAllData = () => {
  //   if (submitResponse) {
  //     setAllData((prevData) => {
  //       const newData = [...prevData];

  //       // Find the index of the existing question in allData
  //       const existingIndex = newData.findIndex((data) => data._id === submitResponse._id);

  //       // If the question exists in allData, replace the whole object; otherwise, add it to the array
  //       if (existingIndex !== -1) {
  //         newData[existingIndex] = submitResponse;
  //       } else {
  //         newData.push(submitResponse);
  //       }

  //       return newData;
  //     });
  //   }
  // };

  // Call the function whenever submitResponse changes
  // useEffect(() => {
  //   if (submitResponse !== null) {
  //     updateAllData();
  //   }
  // }, [submitResponse]);

  // function addSharedLinkObjById() {
  //   const updatedArray = allData.map((item) => {
  //     if (item._id === questUtils?.sharedLinkPost.questForeignKey) {
  //       return {
  //         ...item,
  //         userQuestSetting: questUtils?.sharedLinkPost,
  //       };
  //     }
  //     return item;
  //   });

  //   setAllData(updatedArray);
  // }

  // Call the function whenever submitResponse changes of sharedLink
  // useEffect(() => {
  //   if (questUtils?.sharedLinkPost !== null) {
  //     addSharedLinkObjById();
  //   }
  // }, [questUtils?.sharedLinkPost]);

  // useEffect(() => {
  //   const updateHeight = () => {
  //     const newHeight =
  //       window.innerWidth < 744
  //         ? 'calc(100dvh - 141.89px)'
  //         : window.innerWidth >= 744 && window.innerWidth <= 1280
  //           ? 'calc(100dvh - 249.63px)'
  //           : 'calc(100dvh - 147.63px)';
  //     setHeight(newHeight);
  //   };

  //   updateHeight();

  //   window.addEventListener('resize', updateHeight);

  //   return () => {
  //     window.removeEventListener('resize', updateHeight);
  //   };
  // }, []);

  // const scrollToPlayingCard = () => {
  //   const playingCard = document.getElementById('playing-card');
  //   if (playingCard) {
  //     playingCard.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // const toggleMedia = () => {
  //   setIsPlaying(!isPlaying);
  // };

  // const { mutateAsync: setFilters } = useMutation({
  //   mutationFn: setFilterStates,
  //   onError: (err) => {
  //     console.log(err);
  //   },
  // });

  console.log('filterStates', filterStates);
  //================================================== NEW

  const fetchPosts = async function getInfoQuestions({ pageParam }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: 0,
      end: 5,
      uuid: persistedUserInfo.uuid,
      sort: filterStates.filterBySort === '' ? 'Newest First' : filterStates.filterBySort,
      type: filterStates.filterByType,
      filter: filterStates.filterByScope === 'Me' && true,
      participated:
        filterStates.filterByStatus === 'Participated'
          ? 'Yes'
          : filterStates.filterByStatus === 'Not Participated'
            ? 'Not'
            : 'All',
      moderationRatingInitial: filterStates.moderationRatingFilter.initial,
      moderationRatingFinal: filterStates.moderationRatingFilter.final,
      terms: filterStates.searchData,
      Page: filterStates.bookmarks ? 'Bookmark' : '',
      media: filterStates.filterByMedia,
    };

    if (filterStates.topics.Block.list.length !== 0) {
      params.blockedTerms = JSON.stringify(filterStates.topics.Block.list);
    }

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: [
      'posts',
      filterStates.filterBySort,
      filterStates.filterByType,
      filterStates.filterByScope,
      filterStates.moderationRatingFilter.initial,
      filterStates.moderationRatingFilter.final,
      filterStates.searchData,
      filterStates.filterByStatus,
      filterStates.topics.Block.list,
      filterStates.bookmarks,
      filterStates.filterByMedia,
    ],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nexPage = lastPage.length && lastPage.length === 5 ? allPages.length + 1 : undefined;
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
          <QuestionCardWithToggle
            innerRef={ref}
            key={post._id}
            questStartData={post}
            playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
          />
        );
      } else {
        return (
          <QuestionCardWithToggle
            key={post._id}
            questStartData={post}
            playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
          />
        );
      }
    }),
  );

  return (
    <div className="w-full bg-[#F2F3F5] dark:bg-black">
      <div className="relative mx-auto flex w-full max-w-[778px] flex-col laptop:flex-row">
        <div className="block tablet:hidden">
          <SidebarLeft />
        </div>
        <div className="no-scrollbar mx-auto flex h-full max-h-[calc(100dvh-101px)] min-h-[calc(100dvh-101px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] tablet:max-h-[calc(100dvh-70px)] tablet:min-h-[calc(100dvh-70px)] dark:bg-[#242424]">
          <Slider isFetching={isFetching} />
          <div className="no-scrollbar flex h-[calc(100dvh-147.63px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:gap-5 tablet:px-6 tablet:pb-5">
            {content}
            {printEndMessage(data?.pages[0], filterStates.bookmarks, isFetching)}
          </div>
        </div>

        {/* {status === 'pending' ? (
              <div className="flex items-center justify-center pb-[6rem] pt-3 tablet:py-[27px]">
                <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
              </div>
            ) : isFetchingNextPage ? (
              <div className="flex items-center justify-center pb-[6rem] pt-3 tablet:py-[27px]">
                <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
              </div>
            ) : (
              <>{!hasNextPage && <h1>No later data</h1>}</>
            )} */}
        {/* <InfiniteScroll
            dataLength={allData?.length}
            next={fetchMoreData}
            hasMore={feedData?.hasNextPage}
            endMessage={printEndMessage(
              feedData,
              filterStates,
              allData,
              persistedTheme,
              filterStates.bookmarks,
              isLoading,
              isFetching,
              setFilters,
            )}
            height={height}
            className="no-scrollbar px-4 pb-[10px] tablet:px-6 tablet:pb-5"
          >
            <div id="section-1" className="flex flex-col gap-2 tablet:gap-5">
              {allData &&
                allData
                  .filter((item) => !questUtils.hiddenPosts.includes(item._id))
                  ?.map((item, index) => (
                    <div key={index + 1} id={item._id === questUtils.playerPlayingId ? 'playing-card' : ''}>
                      <QuestionCardWithToggle
                        questStartData={item}
                        isBookmarked={bookmarkedData?.data
                          .concat(questUtils?.bookmarkResponse)
                          .some((bookmark) => bookmark.questForeignKey === item._id)}
                        setPagination={setPagination}
                        setSubmitResponse={setSubmitResponse}
                        playing={item._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
                      />
                    </div>
                  ))}
            </div>
          </InfiniteScroll> */}
        {/* <SidebarRight /> */}
        {questUtils.isShowPlayer && (
          <div className="absolute bottom-8 left-1/2 block -translate-x-1/2 tablet:hidden">
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                alt="mediaCloseIcon"
                className="absolute -right-2 top-3 h-6 w-6 cursor-pointer text-black dark:text-white"
                onClick={() => {
                  dispatch(questUtilsActions.setIsShowPlayer(false));
                  dispatch(questUtilsActions.setPlayingPlayerId(''));
                }}
              />
            </div>
            <MediaControls />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestStartSection;
