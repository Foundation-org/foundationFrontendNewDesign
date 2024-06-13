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
          <div className="flex flex-col gap-[5px] rounded-b-[10px] bg-[#FDFDFD] tablet:gap-[15px]">
            {/* {!history || history.data.data.length === 0 ? (
              <div className="rounded-[5.85px] border-[1.84px] border-[#D9D9D9] bg-white py-2 tablet:rounded-[15px] tablet:py-6">
                <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
                  You have no records.
                </p>
              </div>
            ) : ( */}
            <div>
              <div className="mb-2 ml-3 flex items-center justify-between tablet:mb-[13px] tablet:ml-5">
                <div className="flex items-center gap-[10px] tablet:gap-5">
                  <p className="min-w-[65px] max-w-[65px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[105px] tablet:max-w-[105px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    Code
                  </p>
                  <p className="min-w-[95px] max-w-[95px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[250px] tablet:max-w-[250px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    Description
                  </p>
                  <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[82px] tablet:max-w-[82px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    FDX
                  </p>
                </div>
                <p className="min-w-[65px] max-w-[65px] pr-5 text-end text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[140px] tablet:max-w-[140px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                  Redeemed
                </p>
              </div>
              <div className="rounded-[5.85px] border-[1.84px] border-[#D9D9D9] bg-white tablet:rounded-[15px]">
                {/* {history?.data?.data
                    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((item, index) => ( */}
                <div>
                  <div
                    className={`flex justify-between gap-2 py-2 pl-[13px] pr-4 tablet:h-[112px] tablet:gap-4 tablet:px-5 tablet:py-5 laptop:h-[57px] laptop:flex-row laptop:items-center laptop:gap-0 ${1 === 0 && isPulse ? 'animate-pulse bg-[#EEF8EA] text-[#049952]' : 'text-[#707175]'}`}
                  >
                    <div className="flex items-center gap-[10px] tablet:gap-5">
                      <p className="min-w-[65px] max-w-[65px] text-[10px] font-medium leading-normal tablet:min-w-[10ch] tablet:max-w-[10ch] tablet:text-[16px]">
                        {/* {item.code} */} 35KLM06
                      </p>
                      <div className="flex items-center text-[10px] font-medium leading-normal tablet:text-[16px]">
                        <div className="tooltip text-start">
                          <p className="min-w-[95px] max-w-[95px] truncate tablet:min-w-[250px] tablet:max-w-[250px]">
                            {/* {item.description} */} Get 75 bonus Posts
                          </p>
                        </div>
                      </div>
                      <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal tablet:min-w-[82px] tablet:max-w-[82px] tablet:text-[16px]">
                        20 {/* {item.amount} */}
                      </p>
                    </div>
                    <p className="text-[9px] font-medium leading-normal tablet:text-[16px]">
                      12,May-23
                      {/* {formatDate(item.createdAt)} */}
                    </p>
                  </div>
                  {/* {index !== history?.data?.data.length - 1 && (
                          <div className="mx-[7px] h-[1.84px] rounded-md bg-[#EEE] tablet:mx-6" />
                        )} */}
                </div>
                {/* ))} */}
              </div>
            </div>
            {/* )} */}
          </div>
          {/* <div className="rounded-[7.4px] border-[2.79px] border-[#D9D9D9]">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BuyFDX;
