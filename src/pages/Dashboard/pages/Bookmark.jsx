import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

import {
  getAllQuestsWithDefaultStatus,
  getAllAnswered,
  getAllCompleted,
  getAllUnanswered,
  getAllChangable,
  searchBookmarks,
  getAllBookmarkedQuests,
} from "../../../api/homepageApis";
import {
  getFilters,
  resetFilters,
  setFilterByScope,
  setFilterBySort,
  setFilterByStatus,
  setFilterByType,
} from "../../../features/filters/bookmarkFilterSlice";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../utils/useDebounce";
import QuestionCard from "./Main/components/QuestionCard";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import InfiniteScroll from "react-infinite-scroll-component";
import QuestionCardWithToggle from "./Main/components/QuestionCardWithToggle";
import { handleClickScroll } from "../../../utils";
import { IoIosArrowUp } from "react-icons/io";

const Bookmark = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const pageLimit = 5;
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
    Page: "Bookmark",
  };
  const [searchData, setSearchData] = useState("");
  const [viewResult, setViewResult] = useState(null);
  const [startTest, setStartTest] = useState(null);
  const [clearFilter, setClearFilter] = useState(false);
  const debouncedSearch = useDebounce(searchData, 1000);
  const [expandedView, setExpandedView] = useState(
    localStorage.getItem("expandedView") !== undefined
      ? localStorage.getItem("expandedView") === "true"
        ? true
        : false
      : false,
  );

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
        const result = await searchBookmarks(debouncedSearch);
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

  const handleStartTest = (testId) => {
    setStartTest((prev) => (prev === testId ? null : testId));
  };
  const handleViewResults = (testId) => {
    setViewResult((prev) => (prev === testId ? null : testId));
  };
  const printNoRecords = () => {
    setTimeout(() => {
      return (
        <p className="text-center">
          <b>No results found</b>
        </p>
      );
    }, 1000);
  };

  const fetchMoreData = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

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
      />
      <div className="shadow-inner-md no-scrollbar flex h-full min-h-[calc(100vh-96px)] w-full flex-col gap-[27px] overflow-y-auto bg-[#FCFCFD] pl-6 pr-[23px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-[#06070a]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          endMessage={
            feedData?.hasNextPage === false ? (
              <div className="flex justify-between gap-4 px-4 pb-3 tablet:pb-[27px]">
                <div></div>
                {searchData && allData.length == 0 ? (
                  <div className="my-[15vh] flex  flex-col justify-center">
                    {persistedTheme === "dark" ? (
                      <img
                        src="../../../../../public/assets/svgs/dashboard/noposts.png"
                        alt="noposts image"
                      />
                    ) : (
                      <img
                        src="../../../../../public/assets/svgs/dashboard/noposts.png"
                        alt="noposts image"
                      />
                    )}
                    <p className="text-[#9F9F9F]-600 font-inter mt-[1.319vw] text-center text-[2.083vw] dark:text-gray">
                      No Matching Posts Found
                    </p>
                  </div>
                ) : !searchData && allData.length === 0 ? (
                  <>{printNoRecords()}</>
                ) : (
                  !searchData && (
                    <p className="text-center  text-[2vw] dark:text-gray">
                      <b>No more bookmarks!</b>
                    </p>
                  )
                )}
                <div></div>
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
                      expandedView={expandedView}
                      QuestTopic={item.QuestTopic}
                      isBookmarkTab={true}
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
                      isBookmarkTab={true}
                    />
                  </div>
                ))}
          </div>
        </InfiniteScroll>
        {/* <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          loader={
            allData && allData.length === 0 ? (
              <h4>
                {feedData && feedData.hasNextPage
                  ? "Loading..."
                  : "No results found"}
              </h4>
            ) : (
              <h4>End of bookmarks.</h4>
            )
          }
          endMessage={
            feedData?.hasNextPage === false ? (
              <div className="flex justify-between gap-4 px-4 pb-3 tablet:pb-[27px]">
                <p className="text-center">
                  <b>You are all caught up!</b>
                </p>
                <IoIosArrowUp
                  className="cursor-pointer text-2xl"
                  onClick={handleClickScroll}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
              </div>
            )
          }
          height={"88vh"}
          className="no-scrollbar"
        >
          <div
            id="section-1"
            className="flex flex-col gap-2 py-3 tablet:gap-[17px] tablet:py-[27px]"
          >
            {allData?.map((item, index) => (
              <div key={index + 1}>
                <QuestionCard
                  id={item?._id}
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
                  viewResult={viewResult}
                  startTest={startTest}
                  handleViewResults={handleViewResults}
                  handleStartTest={handleStartTest}
                  whichTypeQuestion={item?.whichTypeQuestion}
                  createdBy={item?.uuid}
                  usersAddTheirAns={item?.usersAddTheirAns}
                  question={item?.Question}
                  btnColor={
                    item?.startStatus === "completed"
                      ? "bg-[#4ABD71]"
                      : item?.startStatus === "change answer"
                        ? "bg-[#FDD503]"
                        : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
                  }
                  btnText={item?.startStatus}
                  lastInteractedAt={item?.lastInteractedAt}
                  usersChangeTheirAns={item?.usersChangeTheirAns}
                  isBookmarked={bookmarkedData?.data.some((bookmark) => {
                    return bookmark.questForeignKey === item?._id;
                  })}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll> */}
      </div>
      <SidebarRight />
    </div>
  );
};

export default Bookmark;
