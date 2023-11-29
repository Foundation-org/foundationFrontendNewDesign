import { useEffect, useState } from "react";
import {
  getAllQuestsWithDefaultStatus,
  getAllAnswered,
  getAllCorrect,
  getAllInCorrect,
  getAllUnanswered,
  getAllChangable,
  searchQuestions,
  getAllBookmarkedQuests,
} from "../../../../api/homepageApis";
import {
  getFilters,
  resetFilters,
  setFilterByScope,
  setFilterBySort,
  setFilterByStatus,
  setFilterByType,
} from "../../../../features/filters/filtersSlice";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../../utils/useDebounce";
import QuestionCard from "./components/QuestionCard";
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
  const [clearFilter, setClearFilter] = useState(false);
  const debouncedSearch = useDebounce(searchData, 1000);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);

  const { data: bookmarkedData } = useQuery({
    queryFn: () => getAllBookmarkedQuests(localStorage.getItem("uId")),
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

    return params;
  };

  const fetchDataByStatus = async (params, filterStates) => {
    switch (filterStates.filterByStatus) {
      case "Unanswered":
        return await getAllUnanswered(params);
      case "Answered":
        return await getAllAnswered(params);
      case "Correct":
        return await getAllCorrect(params);
      case "Incorrect":
        return await getAllInCorrect(params);
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
          localStorage.getItem("uId"),
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
    setStartTest((prev) => (prev === testId ? null : testId));
  };

  const handleViewResults = (testId) => {
    setViewResult((prev) => (prev === testId ? null : testId));
  };

  console.log({ allData });

  return (
    <>
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
          {allData?.map((item, index) => (
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
                        : "Yes/No"
                }
                answers={item?.QuestAnswers}
                question={item?.Question}
                whichTypeQuestion={item?.whichTypeQuestion}
                startTest={startTest}
                viewResult={viewResult}
                handleViewResults={handleViewResults}
                handleStartTest={handleStartTest}
                btnColor={
                  item?.startStatus === "correct"
                    ? "bg-[#4ABD71]"
                    : item?.startStatus === "incorrect"
                      ? "bg-[#F84A4A]"
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
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <SidebarRight />
    </>
  );
};

export default Main;
