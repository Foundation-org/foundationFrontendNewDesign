import { useMutation } from '@tanstack/react-query';
import QuestionCard from '../../../components/QuestionCard';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import { getAllQuestsWithDefaultStatus } from '../../../api/userAuth';
import { useEffect, useState } from 'react';

const Main = () => {
  const page = 1;
  const pageLimit = 5;
  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(pageLimit);
  const [response, setResponse] = useState();

  const { mutateAsync: getQuestdefStatus } = useMutation({
    mutationFn: getAllQuestsWithDefaultStatus,
  });

  const handleQuestdefStatus = async (params) => {
    try {
      const resp = await getQuestdefStatus(params);

      if (resp.status === 200) {
        console.log({ resp });
        setResponse(resp.data);
      }
    } catch (e) {
      toast.error(e.response.data);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      // User has scrolled to the bottom
      // Load the next set of data
      const newSliceStart = sliceEnd;
      const newSliceEnd = sliceEnd + pageLimit;
      setSliceStart(newSliceStart);
      setSliceEnd(newSliceEnd);

      let params = {
        uuid: localStorage.getItem('uId'),
        _page: page,
        _limit: pageLimit,
        start: newSliceStart,
        end: newSliceEnd,
      };

      handleQuestdefStatus(params);
    }
  };

  useEffect(() => {
    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sliceEnd]); // Add sliceEnd to the dependencies to trigger the effect when sliceEnd changes

  useEffect(() => {
    let params = {
      uuid: localStorage.getItem('uId'),
      _page: page,
      _limit: pageLimit,
      start: sliceStart,
      end: sliceEnd,
    };

    handleQuestdefStatus(params);
  }, []);

  return (
    <>
      <SidebarLeft />
      <div className="bg-[#FCFCFD] dark:bg-[#06070a] shadow-inner-md w-full py-[27px] pl-6 pr-[23px] flex flex-col gap-[27px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
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
        {/* <QuestionCard
          id={1}
          img="/assets/svgs/dashboard/badge.svg"
          alt="badge"
          badgeCount="5"
          title="Ranked Choice"
          question="Q. Technology is highly diverse and versatile?"
          btnColor={'bg-[#BB9D02]'}
          btnText={'Change'}
          isBookmarked={false}
        />
        <QuestionCard
          id={2}
          img="/assets/svgs/dashboard/badge-g.svg"
          alt="badge"
          badgeCount="Me"
          title="Multiple Choice"
          question="Q. Technology is highly diverse and versatile?"
          correctAnswers={true}
          btnColor={'bg-[#148339]'}
          btnText={'Correct'}
          isBookmarked={true}
        />
        <QuestionCard
          id={3}
          img="/assets/svgs/dashboard/badge.svg"
          alt="badge"
          badgeCount="5"
          title="Agree/Disagree"
          question="Q. Technology is highly diverse and versatile?"
          btnColor={'bg-[#C13232]'}
          btnText={'Incorrect'}
          isBookmarked={false}
        /> */}
      </div>
      <SidebarRight />
    </>
  );
};

export default Main;
