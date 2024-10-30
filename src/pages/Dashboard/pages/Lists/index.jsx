import ListCard from './components/ListCard';
import { fetchLists } from '../../../../services/api/listsApi';
import { useQuery } from '@tanstack/react-query';
import SummaryCard from '../../../../components/SummaryCard';
import { useSelector } from 'react-redux';

const Lists = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const {
    data: listData = [],
    isError,
    isSuccess,
  } = useQuery({
    queryFn: () => fetchLists(),
    queryKey: ['lists'],
  });

  if (isError) {
    console.log('some error occur');
  }

  return (
    <div className="flex h-[calc(100vh-70px)] w-full flex-col gap-2 overflow-y-auto px-4 pb-[10px] no-scrollbar tablet:h-[calc(100vh-148px)] tablet:gap-5 tablet:px-6 tablet:pb-5">
      <SummaryCard headerIcon="/assets/summary/my-list-logo.svg" headerTitle="My Lists">
        <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          Sharing lists is a great way to earn FDX - especially if people engage with them.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total lists
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Shared lists
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total list clicks
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total list engagement
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
            </h5>
          </div>
        </div>
      </SummaryCard>
      {isSuccess && <ListCard listData={listData} />}
    </div>
  );
};

export default Lists;
