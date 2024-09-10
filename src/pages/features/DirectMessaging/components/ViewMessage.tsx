import { useMemo } from 'react';
import { calculateTimeAgo } from '../../../../utils/utils';
import { useSelector } from 'react-redux';

interface ViewProps {
  setViewMsg: React.Dispatch<React.SetStateAction<boolean>>;
  viewMessageData: any;
  filter: string;
}

export default function ViewMessage({ setViewMsg, viewMessageData, filter }: ViewProps) {
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const timeAgo = useMemo(() => calculateTimeAgo(viewMessageData?.createdAt), [viewMessageData?.createdAt]);

  return (
    <div className="h-fit w-full rounded-[15px] border-[1.232px] border-[#D9D9D9] bg-white dark:border-gray-100 dark:bg-gray-200 tablet:mx-0 tablet:border-2">
      <div className="relative flex items-center justify-between gap-2 border-b-2 border-[#D9D9D9] p-2 dark:border-gray-100 tablet:border-b-4 tablet:px-8 tablet:py-3">
        <button
          className="cursor-pointer text-[10px] font-semibold leading-[10px] text-[#9A9A9A] underline dark:text-gray-300 tablet:text-[20px] tablet:leading-[32px]"
          onClick={() => setViewMsg(false)}
        >
          Back
        </button>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/F.svg`}
            alt="logo"
            className="size-[12.325px] tablet:size-5"
          />
          <h1 className="text-[9.37px] font-semibold leading-[9.37px] text-[#7C7C7C] dark:text-gray-300 tablet:text-[20px] tablet:leading-[20px]">
            {filter !== 'sent' ? 'Foundation-IO.com' : viewMessageData.to}
          </h1>
        </div>
        <div className="flex items-center gap-1 tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h2 className="text-[8.835px] font-normal leading-[8.835px] text-[#9C9C9C] dark:text-gray-300 tablet:text-[21.211px] tablet:leading-[21.211px]">
            {timeAgo}
          </h2>
        </div>
      </div>
      <h1 className="mx-[12px] mb-4 mt-2 text-[12px] font-semibold leading-[12px] text-[#7C7C7C] dark:text-gray-300 tablet:mx-[33px] tablet:mb-[35px] tablet:mt-3 tablet:text-[22px] tablet:leading-[22px]">
        {viewMessageData?.subject}
      </h1>
      <div className="mb-4 px-3 tablet:mb-8 tablet:px-12">
        <p className="text-[10px] font-medium leading-[10px] text-[#9A9A9A] dark:text-gray-300 tablet:text-[20px] tablet:leading-[32px]">
          {/* Hi User, */}
        </p>
        <p className="text-[10px] font-medium leading-[16px] text-[#9A9A9A] dark:text-gray-300 tablet:text-[20px] tablet:leading-[32px]">
          {filter !== 'sent' ? viewMessageData?.shortMessage : viewMessageData.message}
        </p>
        <p className="mt-[17px] text-[10px] font-medium leading-[10px] text-[#9A9A9A] dark:text-gray-300 tablet:mt-[30px] tablet:text-[20px] tablet:leading-[32px]">
          {/* From Foundation. */}
        </p>
      </div>
    </div>
  );
}
