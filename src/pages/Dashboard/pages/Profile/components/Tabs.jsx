const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mx-6 mb-[19px] mt-[14px] flex justify-between gap-[9.21px] tablet:mx-11 tablet:my-[26px] tablet:gap-[19.9px] laptop:mx-[62px] laptop:mb-[67px] laptop:mt-[50px] laptop:gap-9">
      <button
        className={`${
          active === 1
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]"
        } tab-button`}
        onClick={() => {
          handleSelectedTab(1);
        }}
      >
        Contributions
      </button>
      <button
        className={`${
          active === 2
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]"
        } tab-button`}
        onClick={() => {
          handleSelectedTab(2);
        }}
      >
        Verfication Badges
      </button>
      <button
        className={`${
          active === 3
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white dark:border-[#252D37] dark:bg-white dark:text-black"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C] dark:bg-[#212428]"
        } tab-button`}
        onClick={() => {
          handleSelectedTab(3);
        }}
      >
        Ledger
      </button>
      <button
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
      </button>
    </div>
  );
};

export default Tabs;
