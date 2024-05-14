import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ProfileSlider from './components/ProfileSlider';

const Profile = () => {
  const location = useLocation();
  const { pathname } = location;
  const [selectedTab, setSelectedTab] = useState(pathname);

  useEffect(() => {
    setSelectedTab(pathname);
  }, [pathname]);

  return (
    <div
      className={`${selectedTab !== '/dashboard/profile/ledger' ? '' : 'laptop:-mt-[133px]'} w-full bg-[#F2F3F5] tablet:h-[calc(100vh-70px)] dark:bg-[#242424]`}
    >
      <div
        className={`${selectedTab === '/dashboard/profile/ledger' ? 'mx-auto max-w-[778px]' : 'fixed left-auto right-auto w-full max-w-full laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]'}`}
      >
        <ProfileSlider tab={selectedTab} setTab={setSelectedTab} />
      </div>
      <div
        className={`${selectedTab !== '/dashboard/profile/ledger' ? 'max-w-[778px]' : 'max-w-[1440px] pb-16 laptop:mt-[60px]'} no-scrollbar mx-auto mt-10 h-[calc(100dvh-141px)] overflow-y-scroll tablet:mt-[77.63px] tablet:h-[calc(100dvh-173.63px)] laptop:h-[calc(100dvh-184px)]`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
