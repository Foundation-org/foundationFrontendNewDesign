import Topbar from './components/Topbar';
import SidebarRight from './components/SidebarRight';
import SidebarLeft from './components/SidebarLeft';
import Main from './components/Main';

const Dashboard = () => {
  return (
    <div>
      <Topbar />
      <div className="flex justify-between">
        <SidebarLeft />
        <Main />
        <SidebarRight />
      </div>
    </div>
  );
};

export default Dashboard;
