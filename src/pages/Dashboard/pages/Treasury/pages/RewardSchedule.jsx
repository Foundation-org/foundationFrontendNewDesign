import { useSelector } from 'react-redux';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';

const RewardSchedule = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* Total FDX */}
      <div id='scrollToTop'>

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
              {persistedUserInfo?.fdxEarned?.toFixed(2)} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxSpent?.toFixed(2)} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.redemptionStatistics?.codeRedeemedFdxEarned?.toFixed(2)} FDX
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
              +{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              +{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              +{persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedContants?.POST_SHARE} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedContants?.LIST_SHARE} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              -{persistedContants?.QUEST_CREATED_AMOUNT} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedContants?.LIST_CREATE} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                -{persistedContants?.USER_QUEST_SETTING_LINK_CUSTOMIZATION_DEDUCTION_AMOUNT} FDX
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
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
            {persistedContants?.TRANSACTION}
          </h1>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            We charge a transaction fee to keep the platform running smoothly for you. We want You to be in charge of
            your data, tokens, and what you do with them, and want to ensure the platform can function properly for you
            to do so. Foundation charges a 4% fee for transactions to help with run costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardSchedule;
