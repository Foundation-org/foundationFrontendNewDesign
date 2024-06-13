import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';

const TreasurySummary = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);

  console.log('persistedContants', persistedContants);

  return (
    <div className=" mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* Your FDX */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/your-fdx.svg`}
              alt={'your-fdx'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Your FDX</h1>{' '}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:px-16 tablet:py-[18.73px]">
          <div className="space-y-2">
            <h1 className="text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-[18px] tablet:leading-normal">
              Total FDX
            </h1>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              FDX earned:
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              FDX spent:
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              FDX Redeemed:
            </p>
          </div>
          <div className="space-y-2 text-end">
            <h1 className="text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-[18px] tablet:leading-normal">
              {persistedUserInfo?.fdxEarned + persistedUserInfo?.fdxSpent} FDX
            </h1>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxEarned} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxSpent} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.redemptionStatistics?.codeRedeemedFdxEarned} FDX
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
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Rewards & Fees (as of {new Date().toLocaleDateString()})
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-normal leading-[133%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            When you engage with the Foundation platform, you can earn AND spend FDX. You can view the latest reward and
            fee values below.
          </h1>
          <p className="mt-1 text-[10px] font-normal leading-[160%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            *Values subject to change.
          </p>
          <div className="mt-2 grid grid-flow-col grid-rows-3 justify-items-center gap-2 tablet:px-11 tablet:py-[18.73px]">
            <div className="grid w-full grid-cols-3 justify-items-center">
              <h1 className="w-full text-end text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-start tablet:text-[18px] tablet:leading-normal">
                Post participation
              </h1>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                =
              </h1>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                +{persistedContants?.QUEST_COMPLETED_AMOUNT} FDX
              </h1>
            </div>
            <div className="grid w-full grid-cols-3 justify-items-center">
              <h1 className="text-end text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-start tablet:text-[18px] tablet:leading-normal">
                Engagement with my posts
              </h1>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                =
              </h1>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                +{persistedContants?.QUEST_OWNER_ACCOUNT} FDX
              </h1>
            </div>
            <div className="grid w-full grid-cols-3 justify-items-center">
              <h1 className="w-full text-end text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-start tablet:text-[18px] tablet:leading-normal">
                Creating a post
              </h1>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                =
              </h1>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                +{persistedContants?.QUEST_CREATED_AMOUNT} FDX
              </h1>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mb-2 tablet:mt-6 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/treasury/reward-schedule')}>
              View all
            </Button>
          </div>
        </div>
      </div>
      {/* FDX Value */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/fdx-value.svg`}
              alt={'fdx value'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              FDX Value (as of {new Date().toLocaleDateString()})
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-[18px] tablet:leading-normal">
            Need more FDX?
          </h1>
          <h1 className="mt-2 text-[12px] font-normal leading-[133%] text-[#85898C] tablet:text-[16px] tablet:font-medium tablet:leading-normal">
            You can purchase more FDX from the Foundation treasury.
          </h1>
          <p className="mt-1 text-[12px] font-medium leading-[160%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            *Values subject to change.
          </p>
          <div className="grid grid-cols-3 justify-items-center  px-5 py-[10px] tablet:px-11 tablet:py-[18.73px]">
            <div>
              <h1 className="text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-[18px] tablet:leading-normal">
                1 FDX token
              </h1>
            </div>
            <div>
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                =
              </h1>
            </div>
            <div className="text-end">
              <h1 className="text-[12px] leading-[113%] text-[#85898C] tablet:text-[18px] tablet:font-semibold tablet:leading-normal">
                $ {persistedContants?.FDX_CONVERSION_RATE_WRT_USD} USD
              </h1>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mb-2 tablet:mt-6 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/treasury/buy-fdx')}>
              Buy More FDX
            </Button>
          </div>
        </div>
      </div>
      {/* Redemption Code Activity */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/redemption-code-activity.svg`}
              alt={'redemption-code-activity'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Redemption Code Activity
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <div className="rounded-[7.546px] border-[2.792px] border-[#D9D9D9]">
            <div className="grid grid-cols-8 border-b-[2.792px] border-[#D9D9D9] pl-2 tablet:pl-8">
              <h1 className="col-span-6 py-2 text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                Total codes I’ve created
              </h1>
              <h1 className="col-span-2 border-l-[2.792px] border-[#D9D9D9] py-2 text-center text-[12px] font-medium leading-[113%] text-[#85898C] tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.redemptionStatistics?.myTotalRedemptionCodeCreationCount}
              </h1>
            </div>
            <div className="grid grid-cols-8 border-b-[2.792px] border-[#D9D9D9] pl-2 tablet:pl-8">
              <h1 className="col-span-6 py-2 text-[12px] font-normal leading-[113%] text-[#85898C] tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                FDX spent to create codes
              </h1>
              <h1 className="col-span-2 border-l-[2.792px] border-[#D9D9D9] py-2 text-center text-[12px] font-normal leading-[113%] text-[#85898C] tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.redemptionStatistics?.createCodeFdxSpent} FDX
              </h1>
            </div>
            <div className="grid grid-cols-8 pl-2 tablet:pl-8">
              <h1 className="col-span-6 py-2 text-[12px] font-normal leading-[113%] text-[#85898C] tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                FDX earned from codes redeemed
              </h1>
              <h1 className="col-span-2 border-l-[2.792px] border-[#D9D9D9] py-2 text-center text-[12px] font-normal leading-[113%] text-[#85898C] tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.redemptionStatistics?.codeRedeemedFdxEarned} FDX
              </h1>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mb-2 tablet:mt-6 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/treasury/redemption-center')}>
              Redemption Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasurySummary;
