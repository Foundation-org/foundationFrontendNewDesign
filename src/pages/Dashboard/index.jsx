import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="mt-[66.8px] flex justify-between">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
