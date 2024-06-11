import { useSelector } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import BuyBalance from '../components/BuyBalance';

const BuyFDX = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/your-fdx.svg`}
              alt={'your-fdx'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Your FDX</h1>{' '}
          </div>
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            100.96
          </h1>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Need more FDX?
          </h1>{' '}
          <p className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            You can purchase more FDX from the Foundation treasury.
          </p>
          <div className="my-[15px] flex w-full justify-center tablet:mb-2 tablet:mt-6 ">
            <Button variant={'submit'} onClick={() => navigate('/dashboard/profile/post-activity')}>
              Buy More FDX
            </Button>
          </div>
        </div>
      </div> */}
      <BuyBalance />
    </div>
  );
};

export default BuyFDX;
