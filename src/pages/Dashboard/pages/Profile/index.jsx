import { Outlet, useLocation } from 'react-router-dom';
import ProfileSlider from './components/ProfileSlider';

const Profile = () => {
  const location = useLocation();

  return (
    <div
      className={`${location.pathname !== '/dashboard/profile/ledger' ? '' : 'laptop:-mt-[123px]'} w-full bg-[#F2F3F5] tablet:h-[calc(100vh-70px)] dark:bg-[#242424]`}
    >
      <div
        className={`${location.pathname === '/dashboard/profile/ledger' ? 'mx-auto w-full laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]' : 'fixed left-auto right-auto flex w-full max-w-full justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]'}`}
      >
        <ProfileSlider />
      </div>
      <div
        className={`${location.pathname !== '/dashboard/profile/ledger' ? 'max-w-[778px] laptop:h-[calc(100dvh-147.6px)]' : 'max-w-[1440px] pb-16 laptop:mt-[60px] laptop:h-[calc(100dvh-207.6px)]'} no-scrollbar mx-auto h-[calc(100dvh-131px)] overflow-y-scroll tablet:mt-[77.63px] tablet:h-[calc(100dvh-224px)] `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
