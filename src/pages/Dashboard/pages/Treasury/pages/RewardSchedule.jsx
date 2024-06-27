import { useSelector } from 'react-redux';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';

const rewardAndFeesList = [
  'Post participation',
  'Creating a post',
  'My post engagement',
  'Adding an option to a post',
  'Sharing a post',
  'Shared post engagement',
  'Hiding a post',
  'Adding an objection to a post option',
  'Removing my objection',
  'Deleting my post',
  'Adding a badge',
  'Removing a badge',
  'Creating a list',
  'Adding a post to a list',
  'Sharing a list',
  'Shared list engagement [per post]',
  'Creating a custom share link',
];

const RewardSchedule = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedConstants = useSelector(getConstantsValues);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* Total FDX */}
      {/* <div>
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
      </div> */}
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
        <div className="flex flex-col justify-between rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:px-5 tablet:py-[18.73px]">
          <h1 className="text-[12px] font-normal leading-[133%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            When you engage with the Foundation platform, you can earn AND spend FDX. You can view the latest reward and
            fee values below.
          </h1>
          <p className="mt-1 text-[10px] font-normal leading-[160%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            *Values subject to change.
          </p>
          <div className="flex w-full items-center justify-between rounded-b-[10px] pt-3 tablet:px-11 tablet:pt-5">
            <div className="space-y-2">
              {rewardAndFeesList.map((item, index) => (
                <p
                  key={index + 1}
                  className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal"
                >
                  {item}
                </p>
              ))}
            </div>
            <div className="space-y-2 text-end">
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                +{persistedConstants?.QUEST_COMPLETED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                -{persistedConstants?.QUEST_CREATED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.MY_POST_ENGAGEMENT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                -{persistedConstants?.QUEST_OPTION_ADDED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.POST_SHARE} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.SHARED_POST_ENGAGEMENT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.HIDE_POST} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.ADD_OBJECTION_TO_POST} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.REMOVE_MY_OBJECTION} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.DELETE_MY_POST} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                +{persistedConstants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.REMOVE_BADGE} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.LIST_CREATE} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.ADD_POST_TO_LIST} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.LIST_SHARE} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.LIST_SHARE_ENGAGEMENT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
                -{persistedConstants?.USER_QUEST_SETTING_LINK_CUSTOMIZATION_DEDUCTION_AMOUNT} FDX
              </p>
            </div>
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
              Transaction Fee
            </h1>
          </div>
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
            {persistedConstants?.TRANSACTION}
          </h1>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            We charge a transaction fee to keep the platform running smoothly for you. We want you to be in charge of
            your data, tokens, and what you do with them, and want to ensure the platform can function properly for you
            to do so. Foundation charges a {persistedConstants?.TRANSACTION} fee for transactions to help with run
            costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardSchedule;