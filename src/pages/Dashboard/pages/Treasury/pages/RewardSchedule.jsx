import { useSelector } from 'react-redux';

const RewardSchedule = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* Total FDX */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/your-fdx.svg`}
              alt={'your-fdx'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Total FDX</h1>{' '}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:px-16 tablet:py-[18.73px]">
          <div className="space-y-2">
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              FDX earned:
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              FDX spent:
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              FDX redeemed:
            </p>
          </div>
          <div className="space-y-2 text-end">
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxEarned}
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxSpent}
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.redemptionStatistics?.codeRedeemedFdxEarned}
            </p>
          </div>
        </div>
      </div>
      {/* Rewards & Fees */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/reward-and-fees.svg`}
              alt={'reward-and-fees'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Rewards & Fees</h1>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:px-16 tablet:py-[18.73px]">
          <div className="space-y-2">
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Post participation
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              My Post engagement
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Adding badge
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Sharing posts
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Sharing lists
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Creating a post
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Creating list
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Create custom link
            </p>
          </div>
          <div className="space-y-2 text-end">
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.rewardSchedual?.postParticipationFdx > 0 && '+'}
              {persistedUserInfo?.rewardSchedual?.postParticipationFdx} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.rewardSchedual?.myEngagementInPostFdx > 0 && '+'}
              {persistedUserInfo?.rewardSchedual?.myEngagementInPostFdx} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.rewardSchedual?.addingBadgeFdx > 0 && '+'}
              {persistedUserInfo?.rewardSchedual?.addingBadgeFdx} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              hardcoded {/* +10 FDX */}
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              hardcoded {/* +10 FDX */}
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.feeSchedual?.creatingPostFdx > 0 && '+'}
              {persistedUserInfo?.feeSchedual?.creatingPostFdx} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.feeSchedual?.creatingListFdx > 0 && '+'}
              {persistedUserInfo?.feeSchedual?.creatingListFdx} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.feeSchedual?.creatingPostCustomLinkFdx > 0 && '+'}
                {persistedUserInfo?.feeSchedual?.creatingPostCustomLinkFdx} FDX
              </p>
            </p>
          </div>
        </div>
      </div>
      {/* Fee schedule */}
      {/* <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/fee-schedule.svg`}
              alt={'fee schedule'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Fee schedule</h1>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:px-16 tablet:py-[18.73px]">
          <div className="space-y-2">
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Creating a post
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Creating list
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Create custom link
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              Sharing lists
            </p>
          </div>
          <div className="space-y-2 text-end">
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              +10 FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              +10 FDX
            </p>
          </div>
        </div>
      </div> */}
      {/* Transaction fee */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/transaction-fees.svg`}
              alt={'redemption-code-activity'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Transaction fee
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            To run foundation need to .... charge fee too,
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardSchedule;
