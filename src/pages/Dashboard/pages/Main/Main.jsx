import { useEffect, useState } from "react";
import {
  getAllQuestsWithDefaultStatus,
  getAllAnswered,
  getAllCompleted,
  getAllUnanswered,
  getAllChangable,
  searchQuestions,
  searchQuestionsWithPreferences,
  getAllBookmarkedQuests,
} from "../../../../api/homepageApis";
import {
  getFilters,
  resetFilters,
  setFilterByScope,
  setFilterBySort,
  setFilterByStatus,
  setFilterByType,
  setSearch,
  setPreferences,
} from "../../../../features/filters/filtersSlice";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../../utils/useDebounce";
import QuestionCard from "./components/QuestionCard";
import QuestionCardWithToggle from "./components/QuestionCardWithToggle";
import SidebarLeft from "../../components/SidebarLeft";
import SidebarRight from "../../components/SidebarRight";
import InfiniteScroll from "react-infinite-scroll-component";

const Main = () => {
  const pageLimit = 10;
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
    uuid: localStorage.getItem("uId"),
  };
  const [searchData, setSearchData] = useState("");
  const [preferencesData, setPreferencesData] = useState("");
  const [clearFilter, setClearFilter] = useState(false);
  const debouncedSearch = useDebounce(searchData, 1000);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [expandedView, setExpandedView] = useState(false);

  const { data: bookmarkedData } = useQuery({
    queryFn: () => getAllBookmarkedQuests(localStorage.getItem("uId")),
    queryKey: ["getBookmarked"],
  });

  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };
  const handlePreferences = (e) => {
    setPreferencesData(e.target.value);
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

      if (debouncedSearch === "" && preferencesData==="") {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else if(debouncedSearch!=="") {
        const result = await searchQuestions(
          debouncedSearch,
          localStorage.getItem("uId"),
        );
        return result;
      }
      else{
        const result = await searchQuestionsWithPreferences(
          preferencesData,
          localStorage.getItem("uId"),
        );
        return result;
      }
    },
    queryKey: [
      "FeedData",
      filterStates,
      debouncedSearch,
      preferencesData,
      pagination,
      clearFilter,
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

  console.log({ allData });

  return (
    <div className="flex w-full flex-col laptop:flex-row">
      <SidebarLeft
        handleSearch={handleSearch}
        searchData={searchData}
        handlePreferences={handlePreferences}
        preferencesData={preferencesData}
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
      />
      <div className="shadow-inner-md no-scrollbar flex h-[calc(100vh-96px)] w-full flex-col gap-[27px] overflow-y-auto bg-[#FCFCFD] py-[27px] pl-6 pr-[23px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-[#06070a]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          loader={
            allData && allData.length === 0 ? (
              <h4>
                {feedData && feedData.hasNextPage
                  ? "Loading..."
                  : "No records found."}
              </h4>
            ) : (
              <h4>No more data to display.</h4>
            )
          }
          height={"88vh"}
          className="no-scrollbar flex flex-col gap-[27px]"
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
        </InfiniteScroll>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Main;
