import { Link } from 'react-router-dom';

const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mb-[10px] mt-[15px] flex justify-center gap-[5px] tablet:mb-7 tablet:mt-[26px] tablet:gap-[19.9px] laptop:gap-[35px]">
      <Link
        to={''}
        className={`${
          active === '/dashboard/profile/' || active === '/dashboard/profile'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/dashboard/profile');
        }}
      >
        Contributions
      </Link>
      <Link
        to={'verification-badges'}
        className={`${
          active === '/dashboard/profile/verification-badges/' || active === '/dashboard/profile/verification-badges'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/dashboard/profile/verification-badges');
        }}
      >
        Verfication Badges
      </Link>
      <Link
        to={'ledger'}
        className={`${
          active === '/dashboard/profile/ledger/' || active === '/dashboard/profile/ledger'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/dashboard/profile/ledger');
        }}
      >
        Ledger
      </Link>
      <Link
        to={'hidden-posts'}
        className={`${
          active === '/dashboard/profile/hidden-posts/' || active === '/dashboard/profile/hidden-posts'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/dashboard/profile/hidden-posts');
        }}
      >
        Hidden Posts
      </Link>
      <Link
        to={'shared-links'}
        className={`${
          active === '/dashboard/profile/shared-links/' || active === '/dashboard/profile/shared-links'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/dashboard/profile/shared-links');
        }}
      >
        Shared Links
      </Link>
      {/* <Link
        to={"change-password"}
        className={`${
          active === 4
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]"
        } tab-button`}
        onClick={() => {
          handleSelectedTab(4);
        }}
      >
        Change Password
      </Link> */}
    </div>
  );
};

export default Tabs;
