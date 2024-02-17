import { Link } from 'react-router-dom';

const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mb-[10px] mt-[15px] flex justify-center gap-[9.21px] tablet:my-[26px] tablet:gap-[19.9px] laptop:my-[35px] laptop:gap-[35px]">
      <Link
        to={''}
        className={`${
          active === '/profile/' || active === '/profile'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/profile');
        }}
      >
        Contributions
      </Link>
      <Link
        to={'verification-badges'}
        className={`${
          active === '/profile/verification-badges/' || active === '/profile/verification-badges'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/profile/verification-badges');
        }}
      >
        Verfication Badges
      </Link>
      <Link
        to={'ledger'}
        className={`${
          active === '/profile/ledger/' || active === '/profile/ledger'
            ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black'
            : 'border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]'
        } tab-button`}
        onClick={() => {
          handleSelectedTab('/profile/ledger');
        }}
      >
        Ledger
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
