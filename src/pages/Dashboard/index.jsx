import { Route, Routes } from "react-router-dom";
import Topbar from "./components/Topbar";
// import SidebarRight from './components/SidebarRight';
// import SidebarLeft from './components/SidebarLeft';
import Main from "./pages/Main/Main";
import Quest from "./pages/Quest/Quest";
import Bookmark from "./pages/Bookmark";
import Profile from "./pages/Profile";

const Dashboard = () => {
  return (
    <>
      <Topbar />
      <div className="flex h-[calc(100vh-66.8px)] justify-between">
        {/* <SidebarLeft /> */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/quest" element={<Quest />} />
          <Route path="/bookmark" element={<Bookmark />} />
        </Routes>
        {/* <SidebarRight /> */}
      </div>
    </>
  );
};

export default Dashboard;
