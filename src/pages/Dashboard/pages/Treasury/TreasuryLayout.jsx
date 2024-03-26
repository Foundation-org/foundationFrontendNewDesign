import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const TreasuryLayout = () => {
  const location = useLocation();
  const { pathname } = location;

  const [selectedTab, setSelectedTab] = useState(pathname);

  return (
    <div className="h-[calc(100vh-92px)] w-full overflow-y-auto bg-[#F3F3F3]">
      <div className="mx-auto max-w-[1378px] py-[25px]">
        <div className="flex gap-[5.16px] px-6 tablet:gap-[15px]">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
            alt="badge"
            className="h-[26px] w-[26px] tablet:h-12 tablet:w-12 laptop:h-16  laptop:w-16"
          />
          <div className="flex flex-col justify-center">
            <h4 className="heading">Treasury</h4>
            <p className="whitespace-nowrap text-[8px] font-normal leading-[8px] text-[#616161] tablet:text-[15px] tablet:leading-[15px] laptop:text-[18px] laptop:leading-[18px] dark:text-white">
              {/* <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span> */}
              <span>1,357,432.20 FDX</span>
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div className="mb-[10px] mt-[15px] flex justify-center gap-[5px] tablet:my-[35px] tablet:gap-[19.9px] laptop:gap-[35px]">
          <Link
            to={'/dashboard/treasury'}
            className={`${
              selectedTab === '/dashboard/treasury/' || selectedTab === '/dashboard/treasury'
                ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
                : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
            } tab-button`}
            onClick={() => {
              setSelectedTab('/dashboard/treasury');
            }}
          >
            Redemption center
          </Link>
          <Link
            to={'/dashboard/treasury/ledger'}
            className={`${
              selectedTab === '/dashboard/treasury/ledger/' || selectedTab === '/dashboard/treasury/ledger'
                ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
                : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
            } tab-button`}
            onClick={() => {
              setSelectedTab('/dashboard/treasury/ledger');
            }}
          >
            Ledger
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default TreasuryLayout;
