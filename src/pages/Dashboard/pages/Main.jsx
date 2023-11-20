import { useEffect, useState } from 'react';
import {
  getAllQuestsWithDefaultStatus,
  getAllAnswered,
  getAllCorrect,
  getAllInCorrect,
  getAllUnanswered,
  getAllChangable,
  searchQuestions,
} from '../../../api/homepageApis';
import { getFilters } from '../../../features/filters/filtersSlice';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import QuestionCard from '../../../components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import InfiniteScroll from 'react-infinite-scroll-component';

const Main = () => {
  const pageLimit = 10;
  const filterStates = useSelector(getFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    sliceStart: 0,
    sliceEnd: pageLimit,
  });
  const [allData, setAllData] = useState([]);

  const applyFilters = (params, filterStates) => {
    if (filterStates.filterBySort !== '') {
      params = { ...params, sort: filterStates.filterBySort };
    }

    if (filterStates.filterByType !== '' || filterStates.filterByType !== 'All') {
      params = { ...params, type: filterStates.filterByType.toLowerCase() };
    }

    if (filterStates.filterByScope === 'Me') {
      params = { ...params, filter: true };
    }

    return params;
  };

  const fetchDataByStatus = async (params, filterStates) => {
    switch (filterStates.filterByStatus) {
      case 'Unanswered':
        return await getAllUnanswered(params);
      case 'Answered':
        return await getAllAnswered(params);
      case 'Correct':
        return await getAllCorrect(params);
      case 'Incorrect':
        return await getAllInCorrect(params);
      case 'Changeable':
        return await getAllChangable(params);
      default:
        return await getAllQuestsWithDefaultStatus(params);
    }
  };

  const { data: feedData } = useQuery({
    queryFn: async () => {
      let params = {
        _page: pagination.page,
        _limit: pageLimit,
        start: pagination.sliceStart,
        end: pagination.sliceEnd,
        uuid: localStorage.getItem('uId'),
      };

      params = applyFilters(params, filterStates);

      if (filterStates.search === '') {
        return (await fetchDataByStatus(params, filterStates))?.data || {};
      } else {
        return await searchQuestions(filterStates.search);
      }
    },
    queryKey: ['FeedData', filterStates, pagination.page],
    staleTime: 300000,
  });

  useEffect(() => {
    if (pagination.page === 1) {
      setAllData([]);
    }
    if (feedData && feedData.data) {
      setAllData((prevData) => [...prevData, ...(feedData.data || [])]);
    }
  }, [feedData]);

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      sliceStart: 0,
      sliceEnd: pageLimit,
      page: 1,
    }));
  }, [filterStates]);

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      sliceStart: prevPagination.sliceEnd,
      sliceEnd: prevPagination.sliceEnd + pageLimit,
    }));
  }, [pagination.page]);

  const fetchMoreData = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

  return (
    <>
      <SidebarLeft />
      <div className="bg-[#FCFCFD] dark:bg-[#06070a] shadow-inner-md w-full py-[27px] pl-6 pr-[23px] flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <InfiniteScroll
          dataLength={allData?.length}
          next={fetchMoreData}
          hasMore={feedData?.hasNextPage}
          loader={
            allData && allData.length === 0 ? (
              <h4>{feedData && feedData.hasNextPage ? 'Loading...' : 'No records found.'}</h4>
            ) : (
              <h4>No more data to display.</h4>
            )
          }
          height={'100vh'}
          className="flex flex-col gap-[27px] no-scrollbar"
        >
          {allData?.map((item, index) => (
            <div key={index + 1}>
              <QuestionCard
                id={item._id}
                img="/assets/svgs/dashboard/badge.svg"
                alt="badge"
                badgeCount="5"
                title={item?.whichTypeQuestion==='agree/disagree'?'Agree/Disagree':item?.whichTypeQuestion==='multiple choise'?'Multiple Choice':item?.whichTypeQuestion==='ranked choise'?'Ranked Choice':'Yes/No'}
                question={item?.Question}
                btnColor={'bg-[#BB9D02]'}
                btnText={'Change'}
                isBookmarked={false}
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
