import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { calculateTimeAgo } from '../../../../utils/utils';
import { getSinglePost } from '../../../../services/api/homepageApis';
import QuestionCardWithToggle from '../../../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { FaSpinner } from 'react-icons/fa';

interface ViewProps {
  setViewMsg?: React.Dispatch<React.SetStateAction<boolean>>;
  viewMessageData: any;
  filter: string;
  questStartData?: any;
  page?: string;
}

export default function ViewMessage({ setViewMsg, viewMessageData, filter, questStartData, page }: ViewProps) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const timeAgo = useMemo(() => calculateTimeAgo(viewMessageData?.createdAt), [viewMessageData?.createdAt]);

  const { data: singlePostData, isPending } = useQuery({
    queryKey: ['singlePostData', persistedUserInfo.uuid, viewMessageData?.postId],
    queryFn: async () => getSinglePost({ uuid: persistedUserInfo.uuid, qId: viewMessageData?.postId }),
    enabled: !!viewMessageData?.postId,
  });

  return (
    <div className="h-fit w-full rounded-[8px] border-[1.232px] border-[#D9D9D9] bg-white dark:border-gray-100 dark:bg-gray-200 tablet:mx-0 tablet:rounded-[15px] tablet:border-2">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-[12px] border-b-[1.232px] border-[#D9D9D9] bg-[#FFFCB8] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-t-[15px] tablet:border-b-2 tablet:px-5 tablet:py-3">
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${viewMessageData.platform === 'Foundation-IO.com' ? 'assets/svgs/F.svg' : 'assets/addOptions/blueBadge.svg'}`}
            alt="badge-logo"
            className="size-[12.325px] tablet:size-5"
          />
          <h1 className="max-w-44 truncate text-[12.325px] font-semibold leading-[12.325px] text-gray-1 dark:text-white tablet:max-w-72 tablet:text-[20px] tablet:leading-[20px]">
            {filter === 'sent'
              ? viewMessageData.to
              : viewMessageData.platform === 'Foundation-IO.com'
                ? 'Foundation'
                : viewMessageData.platform}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h2 className="whitespace-nowrap text-[13.071px] font-normal leading-[21.211px] text-gray-1 dark:text-white tablet:text-[21.211px] tablet:leading-[13.071px]">
            {timeAgo}
          </h2>
        </div>
      </div>
      {/* Body */}
      <div className="m-3 flex flex-col gap-3 tablet:m-5 tablet:gap-5">
        {!!viewMessageData?.postId && page !== 'preview' && isPending ? (
          <div className="flex items-center justify-center tablet:my-5">
            <FaSpinner className="animate-spin text-[1rem] text-blue-100 tablet:text-[3rem]" />
          </div>
        ) : (
          <>
            <h1 className="text-[10px] font-medium leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[20px] tablet:leading-[22px]">
              Subject: {viewMessageData?.subject}
            </h1>
            <p className="flex flex-col text-[10px] font-medium leading-[16px] text-gray-1 dark:text-gray-300 tablet:text-[20px] tablet:leading-[32px]">
              <span>Message:</span>
              {filter === 'sent' || location.pathname === '/direct-messaging/preview'
                ? viewMessageData.message
                : viewMessageData?.shortMessage}
            </p>
            {viewMessageData?.postQuestion && filter !== 'sent' && (
              <div className="mt-5 space-y-5">
                <h1 className="text-[12px] font-semibold leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-[18px]">
                  You are receiving this message because you participated in the post below.
                </h1>
                {questStartData || singlePostData?.data.data[0] ? (
                  <QuestionCardWithToggle
                    questStartData={questStartData || singlePostData?.data.data[0]}
                    postProperties={'preview'}
                  />
                ) : null}
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="cancel"
                disabled={page === 'preview'}
                onClick={() => {
                  if (page !== 'preview') {
                    setViewMsg?.(false);
                  }
                }}
              >
                Go Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
