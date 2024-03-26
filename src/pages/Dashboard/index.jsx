import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100vh-58px)] justify-between tablet:h-[calc(100vh-116px)] laptop:h-[calc(100vh-70px)]">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
