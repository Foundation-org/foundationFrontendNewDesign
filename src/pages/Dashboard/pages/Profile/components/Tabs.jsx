import { Link } from 'react-router-dom';

const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mx-[19vw] mb-[19px] mt-[14px] flex justify-around gap-[9.21px] tablet:mx-[20vw] tablet:my-[26px] tablet:gap-[19.9px] laptop:mx-[20vw] laptop:mb-[67px] laptop:mt-[50px] laptop:gap-9">
      <Link
        to={''}
        className={`${
          active === '/profile'
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
          active === '/profile/verification-badges'
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
          active === '/profile/ledger'
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
