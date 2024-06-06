import CreateSlider from './components/CreateSlider';
import { Outlet } from 'react-router-dom';

const Quest = () => {
  return (
    <div className="w-full bg-[#F2F3F5] pb-8 md:pb-12 tablet:h-[calc(100vh-96px)] laptop:h-[calc(100vh-70px)] dark:bg-[#242424]">
      <div className="fixed left-auto right-auto flex w-full max-w-full justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <CreateSlider />
      </div>
      <div className="no-scrollbar mt-10 h-[calc(100dvh-141.89px)] overflow-y-auto tablet:mx-6 tablet:mt-[77.63px] tablet:h-[calc(100dvh-173.63px)] laptop:h-[calc(100dvh-174px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Quest;
