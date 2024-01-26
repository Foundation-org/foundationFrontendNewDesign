import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';

const Dashboard = () => {
  return (
    <>
      <Topbar />
      {/* h-[calc(100vh-66.8px)] */}
      <div className="flex h-[calc(100vh-66.8px)] justify-between">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
