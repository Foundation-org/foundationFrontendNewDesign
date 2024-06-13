import { useQuery } from '@tanstack/react-query';
import { fetchPurchasedFdxHistory } from '../../../../../services/api/Treasury';
import { useSelector } from 'react-redux';

const FdxActivity = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const {
    data: historyData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => fetchPurchasedFdxHistory(persistedUserInfo.uuid),
    queryKey: ['fdxPurchasedHistory'],
  });

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  return (
    <div>
      <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buy-fdx-activity.svg`}
            alt={'buy-fdx-activity'}
            className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
          />
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Buy FDX activity</h1>
        </div>
      </div>
      <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-2 py-[10px] tablet:border-[1.85px] tablet:px-5 tablet:py-[18.73px]">
        <div className="flex flex-col gap-[5px] rounded-b-[10px] bg-[#FDFDFD] tablet:gap-[15px]">
          <div>
            <div className="mb-2 ml-3 flex items-center justify-between tablet:mb-[13px] tablet:ml-5">
              <div className="flex items-center gap-[10px] tablet:gap-5">
                <p className="min-w-[65px] max-w-[65px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[105px] tablet:max-w-[105px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                  Provider
                </p>
                <p className="min-w-[95px] max-w-[95px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[150px] tablet:max-w-[150px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                  Dollar Spent
                </p>
                <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[150px] tablet:max-w-[150px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                  FDX Purchased
                </p>
              </div>
              <p className="min-w-[65px] max-w-[65px] pr-5 text-end text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[140px] tablet:max-w-[140px] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                Created
              </p>
            </div>
            <div className="rounded-[5.85px] border-[1.84px] border-[#D9D9D9] bg-white tablet:rounded-[15px]">
              {!isLoading &&
                !isError &&
                historyData?.history
                  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  ?.map((item, index) => (
                    <div key={item._id}>
                      <div
                        className={`flex justify-between gap-2 py-2 pl-[13px] pr-4 tablet:h-[112px] tablet:gap-4 tablet:px-5 tablet:py-5 laptop:h-[57px] laptop:flex-row laptop:items-center laptop:gap-0`}
                      >
                        <div className="flex items-center gap-[10px] tablet:gap-5">
                          <p className="min-w-[65px] max-w-[65px] text-[10px] font-medium leading-normal tablet:min-w-[10ch] tablet:max-w-[10ch] tablet:text-[16px]">
                            {item?.providerName}
                          </p>
                          <div className="flex items-center text-[10px] font-medium leading-normal tablet:text-[16px]">
                            <div className="tooltip text-start">
                              <p className="min-w-[95px] max-w-[95px] truncate tablet:min-w-[150px] tablet:max-w-[150px]">
                                {item?.dollarSpent}
                              </p>
                            </div>
                          </div>
                          <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal tablet:min-w-[150px] tablet:max-w-[150px] tablet:text-[16px]">
                            {item?.fdxPurchased}
                          </p>
                        </div>
                        <p className="text-[9px] font-medium leading-normal tablet:text-[16px]">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                      {index !== historyData?.history?.data?.data.length - 1 && (
                        <div className="mx-[7px] h-[1.84px] rounded-md bg-[#EEE] tablet:mx-6" />
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FdxActivity;
