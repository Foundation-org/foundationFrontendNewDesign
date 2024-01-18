import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// components
import QuestionCard from "./components/QuestionCard";
import SidebarLeft from "../../components/SidebarLeft";
import SidebarRight from "../../components/SidebarRight";
import QuestionCardWithToggle from "./components/QuestionCardWithToggle";

// extras
import { useDebounce } from "../../../../utils/useDebounce";
import { printEndMessage } from "../../../../utils";
import * as QuestServices from "../../../../services/queries/quest";
import * as filtersActions from "../../../../features/sidebar/filtersSlice";
import * as prefActions from "../../../../features/preferences/prefSlice";
import { initialColumns } from "../../../../constants/preferences";

const QuestStartSection = () => {
  const getPreferences = useSelector(prefActions.getPrefs);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(filtersActions.getFilters);
  const debouncedSearch = useDebounce(filterStates.searchData, 1000);

  // check them
  const pageLimit = 5;
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
  };
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);

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
          (item) =>
            !prevColumns.Block.list.includes(item) &&
            !prevColumns.Preferences.list.includes(item),
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
            (item) =>
              !prevColumns.Block.list.includes(item) &&
              !prevColumns.Preferences.list.includes(item),
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

  const { data: feedData } = QuestServices.useGetFeedData(
    filterStates,
    debouncedSearch,
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
    setViewResult(null);
    setStartTest((prev) => (prev === testId ? null : testId));
  };

  const handleViewResults = (testId) => {
    setStartTest(null);
    setViewResult((prev) => (prev === testId ? null : testId));
  };

  console.log({ allData });

  return (
    <div className="flex w-full flex-col bg-white laptop:flex-row dark:bg-black">
      <SidebarLeft columns={columns} setColumns={setColumns} />
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto px-[1.13rem] py-[0.63rem] tablet:min-h-[calc(100vh-92px)] tablet:py-[0.94rem]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          endMessage={printEndMessage(
            feedData,
            filterStates,
            allData,
            persistedTheme,
          )}
          height={"calc(100vh - 92px)"}
          className="no-scrollbar"
        >
          <div
            id="section-1"
            className="flex flex-col gap-2 tablet:gap-[0.94rem]"
          >
            {filterStates.expandedView
              ? allData?.map((item, index) => (
                  <div key={index + 1}>
                    <QuestionCardWithToggle
                      questStartData={item}
                      startTest={startTest}
                      setStartTest={setStartTest}
                      viewResult={viewResult}
                      handleViewResults={handleViewResults}
                      handleStartTest={handleStartTest}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => {
                        return bookmark.questForeignKey === item._id;
                      })}
                      expandedView={filterStates.expandedView}
                      multipleOption={item?.userCanSelectMultiple}
                      question={item?.Question}
                      whichTypeQuestion={item?.whichTypeQuestion}
                      setViewResult={setViewResult}
                      startStatus={item?.startStatus}
                    />
                  </div>
                ))
              : allData?.map((item, index) => (
                  <div key={index + 1}>
                    <QuestionCard
                      questStartData={item}
                      startTest={startTest}
                      setStartTest={setStartTest}
                      viewResult={viewResult}
                      handleViewResults={handleViewResults}
                      handleStartTest={handleStartTest}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => {
                        return bookmark.questForeignKey === item._id;
                      })}
                      expandedView={filterStates.expandedView}
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

export default QuestStartSection;
