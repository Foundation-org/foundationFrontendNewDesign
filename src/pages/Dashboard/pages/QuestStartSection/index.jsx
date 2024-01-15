import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

// components
import QuestionCard from "./components/QuestionCard";
import SidebarLeft from "../../components/SidebarLeft";
import SidebarRight from "../../components/SidebarRight";
import QuestionCardWithToggle from "./components/QuestionCardWithToggle";

// extras
import { useDebounce } from "../../../../utils/useDebounce";
import { printEndMessage } from "../../../../utils";
import * as HomepageAPIs from "../../../../api/homepageApis";
import * as filtersActions from "../../../../features/sidebar/filtersSlice";
import * as prefActions from "../../../../features/preferences/prefSlice";
import {
  applyFilters,
  fetchDataByStatus,
} from "../../../../utils/questionCard";

const QuestStartSection = () => {
  const dispatch = useDispatch();
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
  const initialColumns = {
    All: {
      id: "All",
      list: [],
    },
    Preferences: {
      id: "Preferences",
      list: [],
    },
    Block: {
      id: "Block",
      list: [],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const { data: topicsData, isSuccess } = useQuery({
    queryFn: () => HomepageAPIs.getAllTopics(),
    queryKey: ["topicsData"],
  });

  const { data: prefSearchResults } = useQuery({
    queryFn: async () => {
      if (getPreferences?.topicSearch !== "") {
        const result = await HomepageAPIs.searchTopics(
          getPreferences?.topicSearch,
        );
        return result;
      }
    },
    queryKey: [getPreferences.topicSearch],
  });

  useEffect(() => {
    if (prefSearchResults?.data.data.length !== undefined) {
      setColumns((prevColumns) => {
        const newList = prefSearchResults?.data.data || [];

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
  }, [topicsData, prefSearchResults]);
  // preferences end

  const { data: bookmarkedData } = useQuery({
    queryFn: () => HomepageAPIs.getAllBookmarkedQuests(),
    queryKey: ["getBookmarked"],
  });

  const { data: feedData } = useQuery({
    queryFn: async () => {
      params = applyFilters(params, filterStates, columns);

      if (debouncedSearch === "") {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await HomepageAPIs.searchQuestions(debouncedSearch);
        return result;
      }
    },
    queryKey: ["FeedData", filterStates, debouncedSearch, pagination, columns],
    staleTime: 0,
  });

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
    <div className="flex w-full flex-col laptop:flex-row">
      <SidebarLeft columns={columns} setColumns={setColumns} />
      <div className="no-scrollbar flex h-full w-full flex-col gap-[27px] overflow-y-auto bg-[#FCFCFD] pl-6 pr-[23px] tablet:min-h-[calc(100vh-96px)] dark:bg-[#06070a]">
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
          height={"88vh"}
          className="no-scrollbar"
        >
          <div
            id="section-1"
            className="flex flex-col gap-2 py-3 tablet:gap-[17px] tablet:py-[27px]"
          >
            {filterStates.expandedView
              ? allData?.map((item, index) => (
                  <div key={index + 1}>
                    <QuestionCardWithToggle
                      mainData={item}
                      id={item._id}
                      img="/assets/svgs/dashboard/badge.svg"
                      alt="badge"
                      badgeCount="5"
                      title={
                        item?.whichTypeQuestion === "agree/disagree"
                          ? "Agree/Disagree"
                          : item?.whichTypeQuestion === "like/dislike"
                            ? "Like/Dislike"
                            : item?.whichTypeQuestion === "multiple choise"
                              ? "Multiple Choice"
                              : item?.whichTypeQuestion === "ranked choise"
                                ? "Ranked Choice"
                                : item?.whichTypeQuestion === "yes/no"
                                  ? "Yes/No"
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
                        item?.startStatus === "completed"
                          ? "bg-[#4ABD71]"
                          : item?.startStatus === "change answer"
                            ? "bg-[#FDD503]"
                            : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                      }
                      btnText={item?.startStatus}
                      isBookmarked={bookmarkedData?.data.some((bookmark) => {
                        return bookmark.questForeignKey === item._id;
                      })}
                      lastInteractedAt={item.lastInteractedAt}
                      usersChangeTheirAns={item.usersChangeTheirAns}
                      expandedView={filterStates.expandedView}
                      QuestTopic={item.QuestTopic}
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
