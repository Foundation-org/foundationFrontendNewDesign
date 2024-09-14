import { useMemo } from 'react';
import { calculateTimeAgo } from '../../../../utils/utils';
import { useSelector } from 'react-redux';
import { Button } from '../../../../components/ui/Button';

interface ViewProps {
  setViewMsg: React.Dispatch<React.SetStateAction<boolean>>;
  viewMessageData: any;
  filter: string;
}

export default function ViewMessage({ setViewMsg, viewMessageData, filter }: ViewProps) {
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const timeAgo = useMemo(() => calculateTimeAgo(viewMessageData?.createdAt), [viewMessageData?.createdAt]);

  console.log('viewMessageData', viewMessageData);
  console.log('filter', filter);

  return (
    <div className="h-fit w-full rounded-[8px] border-[1.232px] border-[#D9D9D9] bg-white dark:border-gray-100 dark:bg-gray-200 tablet:mx-0 tablet:rounded-[15px] tablet:border-2">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-[12px] border-b-[1.232px] border-[#D9D9D9] bg-[#FFFCB8] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-t-[15px] tablet:border-b-2 tablet:px-5 tablet:py-3">
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/F.svg`}
            alt="logo"
            className="size-[12.325px] tablet:size-5"
          />
          <h1 className="max-w-44 truncate text-[12.325px] font-semibold leading-[12.325px] text-[#7C7C7C] dark:text-white tablet:max-w-72 tablet:text-[20px] tablet:leading-[20px]">
            {filter === 'sent' ? viewMessageData.to : 'Foundation-IO.com'}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h2 className="whitespace-nowrap text-[13.071px] font-normal leading-[21.211px] text-[#9C9C9C] dark:text-white tablet:text-[21.211px] tablet:leading-[13.071px]">
            {timeAgo}
          </h2>
        </div>
      </div>
      {/* Body */}
      <div className="m-3 flex flex-col gap-3 tablet:m-5 tablet:gap-5">
        <h1 className="text-[12px] font-semibold leading-[12px] text-[#7C7C7C] dark:text-gray-300 tablet:text-[22px] tablet:leading-[22px]">
          {viewMessageData?.subject}
        </h1>
        <p className="pl-3 text-[10px] font-medium leading-[16px] text-[#9A9A9A] dark:text-gray-300 tablet:pl-7 tablet:text-[20px] tablet:leading-[32px]">
          {filter !== 'sent' ? viewMessageData?.shortMessage : viewMessageData.message}aaaaaaaaa
        </p>
        <div className="flex justify-end">
          <Button variant="cancel" onClick={() => setViewMsg(false)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
