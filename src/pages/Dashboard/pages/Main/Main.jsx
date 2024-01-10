import { useEffect, useRef, useState } from "react";
import {
  getAllQuestsWithDefaultStatus,
  getAllAnswered,
  getAllCompleted,
  getAllUnanswered,
  getAllChangable,
  searchQuestions,
  getAllBookmarkedQuests,
  getAllTopics,
} from "../../../../api/homepageApis";
import {
  getFilters,
  resetFilters,
  setFilterByScope,
  setFilterBySort,
  setFilterByStatus,
  setFilterByType,
  setSearch,
} from "../../../../features/filters/filtersSlice";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../../utils/useDebounce";
import QuestionCard from "./components/QuestionCard";
import QuestionCardWithToggle from "./components/QuestionCardWithToggle";
import SidebarLeft from "../../components/SidebarLeft";
import SidebarRight from "../../components/SidebarRight";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSpinner } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { handleClickScroll } from "../../../../utils";

const Main = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const pageLimit = 10;
  const myRef = useRef(null);
  const filterStates = useSelector(getFilters);
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
  const [searchData, setSearchData] = useState("");
  const [clearFilter, setClearFilter] = useState(false);
  const debouncedSearch = useDebounce(searchData, 1000);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [expandedView, setExpandedView] = useState(
    localStorage.getItem("expandedView") !== undefined
      ? localStorage.getItem("expandedView") === "true"
        ? true
        : false
      : false,
  );

  useEffect(() => {
    if (expandedView === false) {
      setStartTest(null);
      setViewResult(null);
    }
  }, [expandedView]);

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
    queryFn: () => getAllTopics(),
    queryKey: ["topicsData"],
  });

  useEffect(() => {
    if (isSuccess) {
      setColumns((prevColumns) => ({
        ...prevColumns,
        All: {
          ...prevColumns.All,
          list: topicsData?.data.data || [],
        },
      }));
    }
  }, [topicsData]);

  // preferences end

  const { data: bookmarkedData } = useQuery({
    queryFn: () => getAllBookmarkedQuests(),
    queryKey: ["getBookmarked"],
  });

  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  const applyFilters = (params, filterStates) => {
    if (filterStates.filterBySort !== "") {
      params = { ...params, sort: filterStates.filterBySort };
    }

    if (filterStates.filterByType && filterStates.filterByType !== "All") {
      params = { ...params, type: filterStates.filterByType.toLowerCase() };
    } else {
      params = { ...params, type: "" };
    }

    if (filterStates.filterByScope === "Me") {
      params = { ...params, filter: true };
    }

    if (columns.Preferences.list.length !== 0) {
      params = { ...params, terms: columns.Preferences.list };
    }

    if (columns.Block.list.length !== 0) {
      params = { ...params, blockedTerms: columns.Block.list };
    }

    return params;
  };

  const fetchDataByStatus = async (params, filterStates) => {
    switch (filterStates.filterByStatus) {
      case "Unanswered":
        return await getAllUnanswered(params);
      case "Answered":
        return await getAllAnswered(params);
      case "Completed":
        return await getAllCompleted(params);
      case "Changeable":
        return await getAllChangable(params);
      default:
        return await getAllQuestsWithDefaultStatus(params);
    }
  };

  const { data: feedData } = useQuery({
    queryFn: async () => {
      params = applyFilters(params, filterStates);

      if (debouncedSearch === "") {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await searchQuestions(
          debouncedSearch,
        );
        return result;
      }
    },
    queryKey: [
      "FeedData",
      filterStates,
      debouncedSearch,
      pagination,
      clearFilter,
      columns,
    ],
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
  }, [filterStates, searchData]);

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
  const printNoRecords=()=>{
  setTimeout(() => {
      return (
        <p className="text-center">
          <b>No results found</b>
        </p>
      );
    }, 1000)
  }

  console.log({ allData });

  return (
    
    <div className="flex w-full flex-col laptop:flex-row">
      <SidebarLeft
        handleSearch={handleSearch}
        searchData={searchData}
        clearFilter={clearFilter}
        setClearFilter={setClearFilter}
        setSearchData={setSearchData}
        filterStates={filterStates}
        resetFilters={resetFilters}
        setFilterByScope={setFilterByScope}
        setFilterBySort={setFilterBySort}
        setFilterByStatus={setFilterByStatus}
        setFilterByType={setFilterByType}
        expandedView={expandedView}
        setExpandedView={setExpandedView}
        columns={columns}
        setColumns={setColumns}
      />
      <div
        ref={myRef}
        className="shadow-inner-md no-scrollbar flex h-full w-full flex-col gap-[27px] overflow-y-auto bg-[#FCFCFD] pl-6 pr-[23px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] tablet:min-h-[calc(100vh-96px)] dark:bg-[#06070a]"
      >
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}        
          endMessage={
            feedData?.hasNextPage === false ? (
              <div className="flex justify-between gap-4 px-4 pb-3 tablet:pb-[27px]">
                {searchData && allData.length==0 ?
                  <p className="text-center">
                    <b>No matching quest found.</b>
                  </p>
                  :!searchData && allData.length===0?
                  <>
                  {printNoRecords()}
                </>
                  : !searchData &&
                  <p className="text-center">
                    <b>You are all caught up!</b>
                  </p>
                }
                {!searchData && allData.length !==0 &&

                  <IoIosArrowUp
                  className="cursor-pointer text-2xl"
                  onClick={handleClickScroll}
                  />
                }
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
              </div>
            )
          }
          height={"88vh"}
          className="no-scrollbar "
        >
          <div
            id="section-1"
            className="flex flex-col gap-2 py-3 tablet:gap-[17px] tablet:py-[27px]"
          >
            {expandedView
              ? allData?.map((item, index) => (
                <div key={index + 1}>
                  <QuestionCardWithToggle
                    id={item._id}
                    img="/assets/svgs/dashboard/badge.svg"
                    alt="badge"
                    badgeCount="5"
                    title={
                      item?.whichTypeQuestion === "agree/disagree"
                        ? "Agree/Disagree"
                        : item?.whichTypeQuestion === "like/unlike"
                          ? "Like/Unlike"
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
                    expandedView={expandedView}
                    QuestTopic={item.QuestTopic}
                  />
                </div>
              ))
              : allData?.map((item, index) => (
                <div key={index + 1}>
                  <QuestionCard
                    id={item._id}
                    img="/assets/svgs/dashboard/badge.svg"
                    alt="badge"
                    badgeCount="5"
                    title={
                      item?.whichTypeQuestion === "agree/disagree"
                        ? "Agree/Disagree"
                        : item?.whichTypeQuestion === "like/unlike"
                          ? "Like/Unlike"
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
                    usersAddTheirAns={item?.usersAddTheirAns}
                    handleViewResults={handleViewResults}
                    handleStartTest={handleStartTest}
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
                    expandedView={expandedView}
                    QuestTopic={item.QuestTopic}
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

export default Main;
