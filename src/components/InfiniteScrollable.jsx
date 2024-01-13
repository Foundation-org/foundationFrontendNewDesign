import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";

import { printNoRecordsMessage } from "../utils";
import * as filtersActions from "../features/sidebar/filtersSlice";

const InfiniteScrollable = ({ allData, fetchMoreData, feedData, Children }) => {
  const pageLimit = 5;
  const [pagination, setPagination] = useState({
    page: 1,
    sliceStart: 0,
    sliceEnd: pageLimit,
  });
  const filterStates = useSelector(filtersActions.getFilters);

  console.log("hamza", allData, feedData, fetchMoreData);

  return (
    <InfiniteScroll
      dataLength={allData?.length}
      next={fetchMoreData}
      hasMore={feedData?.hasNextPage}
      endMessage={
        feedData?.hasNextPage === false ? (
          <div className="flex justify-between gap-4 px-4 pb-3 tablet:pb-[27px]">
            <div></div>
            {filterStates.searchData && allData.length == 0 ? (
              <div className="my-[15vh] flex  flex-col justify-center">
                {persistedTheme === "dark" ? (
                  <img
                    src="/assets/svgs/dashboard/noMatchingDark.svg"
                    alt="noposts image"
                  />
                ) : (
                  <img
                    src="/assets/svgs/dashboard/noMatchingLight.svg"
                    alt="noposts image"
                  />
                )}
                <p className="font-inter mt-[1.319vw] text-center text-[2.083vw] text-[#9F9F9F] dark:text-gray">
                  No Matching Posts Found
                </p>
              </div>
            ) : !filterStates.searchData && allData.length === 0 ? (
              <>{printNoRecordsMessage()}</>
            ) : (
              !filterStates.searchData && (
                <p className="text-center text-[2vw]">
                  <b>You are all caught up!</b>
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
      {Children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollable;
