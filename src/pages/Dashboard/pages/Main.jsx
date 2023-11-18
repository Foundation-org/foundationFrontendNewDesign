import { useMutation } from '@tanstack/react-query';
import { getAllQuestsWithDefaultStatus } from '../../../api/homepageApis';
import { useEffect, useState } from 'react';
import QuestionCard from '../../../components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFilters } from '../../../features/filters/filtersSlice';
import { useSelector } from 'react-redux';
import { searchQuestions } from '../../../api/homepageApis';

const Main = () => {
  const page = 1;
  const filterStates = useSelector(getFilters);
  const [userId, setUserId] = useState('');
  const [pageLimit, setPageLimit] = useState(40);
  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(pageLimit);
  const [response, setResponse] = useState([]);
  const [searchResult, setSearchResult] = useState();

  console.log(filterStates);

  const { mutateAsync: getQuestdefStatus } = useMutation({
    mutationFn: getAllQuestsWithDefaultStatus,
  });

  const handleQuestdefStatus = async (params) => {
    try {
      const resp = await getQuestdefStatus(params);

      if (resp.status === 200) {
        setSliceStart(sliceEnd);
        setSliceEnd(sliceEnd + pageLimit);
        setResponse(resp.data);
        // setResponse((pre) => [...pre, ...resp.data]);
      }
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  useEffect(() => {
    let params = {
      _page: page,
      _limit: pageLimit,
      start: sliceStart,
      end: sliceEnd,
    };

    // filter by sort
    if (filterStates.filterBySort !== '') {
      params = { ...params, filter: true, sort: filterStates.filterBySort };
    }

    // filter by type
    if (
      filterStates.filterByType !== '' &&
      filterStates.filterByType !== 'All'
    ) {
      params = {
        ...params,
        filter: true,
        type: filterStates.filterByType.toLowerCase(),
      };
    }

    // filter by scope
    if (filterStates.filterByScope === 'Me') {
      params = { ...params, filter: true, uuid: localStorage.getItem('uId') };
    }

    handleQuestdefStatus(params);
  }, [pageLimit, filterStates]);

  const fetchMoreData = () => {
    const nextPage = page + 1;

    let params = {
      uuid: localStorage.getItem('uId'),
      _page: nextPage,
      _limit: pageLimit,
      start: sliceStart,
      end: sliceEnd,
    };

    handleQuestdefStatus(params);
  };

  // Get Data based on search
  const getSearchResult = async () => {
    try {
      const resp = await searchQuestions(filterStates.search);
      if (resp) {
        setSearchResult(resp.data);
      } else {
        console.log('API response is undefined.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSearchResult();
  }, [filterStates.search]);

  // Empty check
  useEffect(() => {
    if (filterStates.search === '') {
      setSearchResult('');
    }
  }, [filterStates]);

  return (
    <>
      <SidebarLeft />
      <div className="bg-[#FCFCFD] dark:bg-[#06070a] shadow-inner-md w-full py-[27px] pl-6 pr-[23px] flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        {searchResult ? (
          <InfiniteScroll
            dataLength={searchResult.length}
            next={fetchMoreData}
            hasMore={true}
            loader={
              searchResult?.length === 0 ? (
                <h4>No data found...</h4>
              ) : (
                <h4>Loading...</h4>
              )
            }
            className="flex flex-col gap-[27px]"
          >
            {searchResult?.map((item, index) => (
              <div key={index + 1}>
                <QuestionCard
                  id={item._id}
                  img="/assets/svgs/dashboard/badge.svg"
                  alt="badge"
                  badgeCount="5"
                  title="Ranked Choice"
                  question={item?.Question}
                  btnColor={'bg-[#BB9D02]'}
                  btnText={'Change'}
                  isBookmarked={false}
                />
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            dataLength={response.length}
            next={fetchMoreData}
            hasMore={true}
            loader={
              response.length === 0 ? (
                <h4>No data found...</h4>
              ) : (
                <h4>Loading...</h4>
              )
            }
            className="flex flex-col gap-[27px]"
          >
            {response?.map((item, index) => (
              <div key={index + 1}>
                <QuestionCard
                  id={item._id}
                  img="/assets/svgs/dashboard/badge.svg"
                  alt="badge"
                  badgeCount="5"
                  title="Ranked Choice"
                  question={item?.Question}
                  btnColor={'bg-[#BB9D02]'}
                  btnText={'Change'}
                  isBookmarked={false}
                />
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
      <SidebarRight />
    </>
  );
};

export default Main;
