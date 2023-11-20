import { useMutation } from '@tanstack/react-query';
import { getAllQuestsWithDefaultStatus } from '../../../api/homepageApis';
import { getAllAnswered } from '../../../api/homepageApis';
import { getAllCorrect } from '../../../api/homepageApis';
import { getAllInCorrect } from '../../../api/homepageApis';
import { getAllUnanswered } from '../../../api/homepageApis';
import { getAllChangable } from '../../../api/homepageApis';
import { useEffect, useState } from 'react';
import QuestionCard from '../../../components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFilters } from '../../../features/filters/filtersSlice';
import { useSelector } from 'react-redux';
import { searchQuestions } from '../../../api/homepageApis';
import { useQuery } from '@tanstack/react-query';

const Main = () => {
  const pageLimit=10;
  const [page,setPage]=useState(1);
  const filterStates = useSelector(getFilters);
  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(pageLimit);
  const [allData, setAllData] = useState([]);





  const { data: feedData } = useQuery({
    queryFn: async() => {

      let params = {
        _page: page,
        _limit: pageLimit,
        start: sliceStart,
        end: sliceEnd,
        uuid: localStorage.getItem('uId')
      };
  
      // filter by sort
      if (filterStates.filterBySort !== '') {
        params = { ...params,  sort: filterStates.filterBySort };
      }
  
      // filter by type
      if (
        filterStates.filterByType !== '' &&
        filterStates.filterByType !== 'All'
      ) {
        params = {
          ...params,
          type: filterStates.filterByType.toLowerCase(),
        };
      }
  
      // filter by scope
      if (filterStates.filterByScope === 'Me') {
        params = { ...params, filter: true };
      }
      console.log(filterStates);
      if(page===1){
        setAllData([])
      }

      if (filterStates.search === '') {
        // Handle different filterStatus cases
        let resultData;
        if (filterStates.filterByStatus === 'All' || filterStates.filterByStatus === '' ) {
          resultData = await getAllQuestsWithDefaultStatus(params);
        } else if (filterStates.filterByStatus === 'Unanswered') {
          resultData = await getAllUnanswered(params);
        } else if (filterStates.filterByStatus === 'Answered') {
          resultData = await getAllAnswered(params);
        } else if (filterStates.filterByStatus === 'Correct') {
          resultData = await getAllCorrect(params);
        } else if (filterStates.filterByStatus === 'Incorrect') {
          resultData = await getAllInCorrect(params);
        } else if (filterStates.filterByStatus === 'Changeable') {
          resultData = await getAllChangable(params);
        }

        console.log("results",resultData?.data);
        return resultData?.data || {}; // Return a default value if resultData is undefined
      } else {
        return await searchQuestions(filterStates.search);
      }
    },
    queryKey: ['FeedData', filterStates,page],
    staleTime: 300000, // 5 minutes
 
  });
  useEffect(() => {
    if (feedData && feedData.data) {
      setAllData((prevData) => [
        ...prevData,
        ...feedData.data || [],
      ]);
    }
  }, [feedData]);


  useEffect(() => {
    setPage(1); // 

    
  }, [filterStates]);

  const fetchMoreData = () => {

    console.log("fetch more called");
    const nextPage = page + 1;
    const newSliceStart = sliceEnd;
    const newSliceEnd = sliceEnd + pageLimit;
    setSliceStart(newSliceStart);
    setSliceEnd(newSliceEnd);
    setPage(nextPage);
  };
  


  return (
    <>
      <SidebarLeft />
      <div className="bg-[#FCFCFD] dark:bg-[#06070a] shadow-inner-md w-full py-[27px] pl-6 pr-[23px] flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
           {console.log("dataaaaaa"+allData)}
          <InfiniteScroll
            dataLength={allData?.length || 0}
            next={fetchMoreData}
            hasMore={feedData?.hasNextPage}
            loader={
              allData?.length === 0 ? (
                <h4>No data found...</h4>
              ) : (
                <h4>Loading...</h4>
              )
            }
            className="flex flex-col gap-[27px]"
          >
            {allData?.map((item, index) => (
              <div key={index + 1}>
                <QuestionCard
                  id={item._id}
                  img="/assets/svgs/dashboard/badge.svg"
                  alt="badge"
                  badgeCount="5"
                  title={item?.whichTypeQuestion}
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
