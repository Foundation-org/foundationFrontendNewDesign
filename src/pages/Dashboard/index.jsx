import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';
import DashboardLayout from './components/DashboardLayout';

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="bg-gray-400 dark:bg-black flex h-[calc(100dvh-48px)] justify-between tablet:h-[calc(100dvh-96px)] laptop:h-[calc(100dvh-70px)]">
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </div>
    </>
  );
};

export default Dashboard;
