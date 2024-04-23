import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';
import TreasuryAndBalance from './components/TreasuryAndBalance';

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100dvh-58px)] justify-between bg-[#F2F3F5] tablet:h-[calc(100dvh-116px)]  laptop:h-[calc(100dvh-70px)]">
        <TreasuryAndBalance>
          <Outlet />
        </TreasuryAndBalance>
      </div>
    </>
  );
};

export default Dashboard;
