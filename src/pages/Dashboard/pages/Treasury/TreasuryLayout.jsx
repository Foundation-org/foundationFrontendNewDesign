import { Link, Outlet, useLocation } from 'react-router-dom';
import { treasuryItems } from '../../../../constants/sliders';
import { Button } from '../../../../components/ui/Button';

const TreasuryLayout = () => {
  const location = useLocation();

  return (
    <div className="h-[calc(100vh-58px)] w-full overflow-hidden bg-[#F2F3F5] tablet:h-[calc(100vh-70px)]">
      <div className="mx-auto mb-[10px] max-w-[1378px] tablet:mb-[25px]">
        <div className="my-2 flex justify-center gap-[15px] tablet:gap-5 laptop:mb-[65px] laptop:mt-[14.82px] laptop:gap-[35px]">
          {treasuryItems.map((tab) => (
            <Link key={tab.path} to={tab.path}>
              <Button
                variant={'topics'}
                className={`${
                  location.pathname === tab.path || location.pathname === `${tab.path}/`
                    ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                    : 'border-[#ACACAC] bg-white text-[#707175]'
                }`}
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="no-scrollbar h-[calc(100dvh-121.27px)] overflow-auto tablet:h-[calc(100dvh-138px)] tablet:pb-10 laptop:h-[calc(100dvh-208px)] laptop:pb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TreasuryLayout;
