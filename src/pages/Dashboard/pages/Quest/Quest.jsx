import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CreateSlider from './components/CreateSlider';

const Quest = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-[#F2F3F5] pb-8 md:pb-12 tablet:h-[calc(100vh-96px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] desktop:mx-auto dark:bg-[#242424]">
      <div className="fixed left-1/2 flex w-full max-w-full -translate-x-1/2 justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <CreateSlider />
      </div>
      <div
        ref={scrollRef}
        className="no-scrollbar mt-10 h-[calc(100dvh-141.89px)] overflow-y-auto tablet:mx-6 tablet:mt-[77.63px] tablet:h-[calc(100dvh-173.63px)] laptop:h-[calc(100dvh-174px)]"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Quest;
