import { useMutation } from '@tanstack/react-query';
import QuestionCard from '../../../components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import { getAllQuestsWithDefaultStatus } from '../../../api/userAuth';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Main = () => {
  const page = 1;
  const [pageLimit, setPageLimit] = useState(5);
  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(pageLimit);
  const [response, setResponse] = useState([]);

  const { mutateAsync: getQuestdefStatus } = useMutation({
    mutationFn: getAllQuestsWithDefaultStatus,
  });

  const handleQuestdefStatus = async (params) => {
    try {
      const resp = await getQuestdefStatus(params);

      if (resp.status === 200) {
        setSliceStart(sliceEnd);
        setSliceEnd(sliceEnd + pageLimit);
        setResponse((pre) => [...pre, ...resp.data]);
      }
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  useEffect(() => {
    let params = {
      uuid: localStorage.getItem('uId'),
      _page: page,
      _limit: pageLimit,
      start: sliceStart,
      end: sliceEnd,
    };

    handleQuestdefStatus(params);
  }, [pageLimit]);

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

  return (
    <>
      <SidebarLeft />
      <div className="bg-[#FCFCFD] dark:bg-[#06070a] shadow-inner-md w-full py-[27px] pl-6 pr-[23px] flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <InfiniteScroll
          dataLength={response.length}
          next={fetchMoreData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          className="flex flex-col gap-[27px]"
        >
          {response &&
            response?.map((item) => (
              <div key={item._id}>
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
      </div>
      <SidebarRight />
    </>
  );
};

export default Main;
