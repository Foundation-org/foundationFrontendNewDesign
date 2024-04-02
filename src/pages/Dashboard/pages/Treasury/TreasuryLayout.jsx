import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import api from '../../../../services/api/Axios';
import { useSelector } from 'react-redux';

const TreasuryLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  const [selectedTab, setSelectedTab] = useState(pathname);
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const getTreasuryAmount = async () => {
    try {
      const res = await api.get(`/treasury/get`);
      if (res.status === 200) {
        localStorage.setItem('treasuryAmount', res.data.data);
        setTreasuryAmount(res.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message.split(':')[1]);
    }
  };

  useEffect(() => {
    getTreasuryAmount();
  }, []);

  return (
    <div className="h-[calc(100vh-58px)] w-full overflow-scroll overflow-x-hidden bg-[#F3F3F3] tablet:h-[calc(100vh-70px)]">
      <div className="mx-[18px] mt-[10px] flex items-center justify-between tablet:mx-8 tablet:mt-[25px] laptop:mx-[110px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-[5.16px] tablet:gap-[15px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.svg`}
              alt="badge"
              className="h-[26px] w-[26px] tablet:h-12 tablet:w-12 laptop:h-16  laptop:w-16"
            />
            <div className="flex flex-col justify-center">
              <h4 className="heading">Treasury</h4>
              <p className="whitespace-nowrap text-[8px] font-normal leading-[8px] text-[#616161] tablet:text-[15px] tablet:leading-[15px] laptop:text-[18px] laptop:leading-[18px] dark:text-white">
                <span>{treasuryAmount ? (treasuryAmount * 1)?.toFixed(2) : 0} FDX</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[5.16px] tablet:gap-[15px]">
            <div
              style={{
                background:
                  persistedUserInfo.role !== 'user'
                    ? 'url(/assets/svgs/dashboard/guestBadge.svg)'
                    : 'url(/assets/svgs/dashboard/MeBadge.svg)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }}
              className="relative flex h-[25px] w-5 items-center justify-center bg-cover bg-no-repeat tablet:h-12 tablet:w-10 laptop:h-16 laptop:w-[51px]"
            >
              <p className="transform-center absolute z-50 pb-[7px] text-[11px] font-medium leading-normal text-[#7A7016] tablet:pb-3 tablet:text-[25px]">
                {persistedUserInfo?.badges?.length}
              </p>
            </div>
            <div className="flex flex-col gap-0 tablet:gap-[5px]">
              <h4 className="heading">My Balance</h4>
              <div className="font-inter mt-[-4px] flex gap-1 text-[10px] font-medium text-[#616161] tablet:text-[18px] tablet:text-base dark:text-[#D2D2D2]">
                <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1378px]">
        {/* Tabs */}
        <div className="mb-[10px] mt-[15px] flex justify-center gap-8 tablet:my-[35px] tablet:gap-[19.9px] laptop:gap-[35px]">
          <Link
            to={'/dashboard/treasury'}
            className={`${
              selectedTab === '/dashboard/treasury/' ||
              selectedTab === '/dashboard/treasury' ||
              /^\/dashboard\/treasury(\/(?!ledger).*)?$/.test(selectedTab)
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
