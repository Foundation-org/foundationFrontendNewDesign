import BuyBalance from '../components/BuyBalance';

const BuyFDX = () => {
  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* My Balance */}
      <BuyBalance />
      {/* Buy FDX activity */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buy-fdx-activity.svg`}
              alt={'buy-fdx-activity'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Buy FDX activity
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-2 py-[10px] tablet:border-[1.85px] tablet:px-5 tablet:py-[18.73px]">
          <div className="rounded-[7.4px] border-[2.79px] border-[#D9D9D9]">
            <table className="w-full">
              <thead className="border-b-[2.79px] border-[#D9D9D9]">
                <tr>
                  <td className="max-w-[54px] border-r-[1.85px] border-[#D9D9D9] px-1 py-2 text-[10px] font-bold leading-[150%] text-[#85898C] tablet:max-w-24 tablet:border-r-[2.79px] tablet:p-3 tablet:text-[16px]">
                    Code
                  </td>
                  <td className="max-w-[106px] border-r-[1.85px] border-[#D9D9D9] px-1 py-2 text-[10px] font-bold leading-[150%] text-[#85898C] tablet:max-w-[340px] tablet:border-r-[2.79px] tablet:p-3 tablet:text-[16px]">
                    Description
                  </td>
                  <td className="max-w-[60px] border-r-[1.85px] border-[#D9D9D9] px-1 py-2 text-[10px] font-bold leading-[150%] text-[#85898C] tablet:max-w-[113px] tablet:border-r-[2.79px] tablet:p-3 tablet:text-[16px]">
                    FDX cost
                  </td>
                  <td className="max-w-[95px] px-1 py-2 text-[10px] font-bold leading-[150%] text-[#85898C] tablet:max-w-[148px] tablet:p-3 tablet:text-[16px]">
                    5/20/2024
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-[2.79px] border-[#D9D9D9]">
                  <td className="max-w-[54px] border-r-[1.85px] border-[#D9D9D9] px-1 py-2 text-[10px] font-normal leading-[150%] text-[#85898C] tablet:max-w-24 tablet:border-r-[2.79px] tablet:p-3 tablet:text-[16px]">
                    35KLMO6
                  </td>
                  <td className="max-w-[106px] border-r-[1.85px] border-[#D9D9D9] px-1 py-2 text-[10px] font-normal leading-[150%] text-[#85898C] tablet:max-w-[340px] tablet:border-r-[2.79px] tablet:p-3 tablet:text-[16px]">
                    Get 75 bonus and type 75 bonus and get...
                  </td>
                  <td className="max-w-[60px] border-r-[1.85px] border-[#D9D9D9] px-1 py-2 text-[10px] font-normal leading-[150%] text-[#85898C] tablet:max-w-[113px] tablet:border-r-[2.79px] tablet:p-3 tablet:text-[16px]">
                    10 FDX
                  </td>
                  <td className="max-w-[95px] px-1 py-2 text-[10px] font-normal leading-[150%] text-[#85898C] tablet:max-w-[148px] tablet:p-3 tablet:text-[16px]">
                    5/20/2024
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyFDX;
