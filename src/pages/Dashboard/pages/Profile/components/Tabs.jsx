const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mx-6 mb-[19px] mt-[14px] flex justify-between gap-[9.21px] tablet:mx-[62px] tablet:mb-[67px] tablet:mt-[50px] tablet:gap-9">
      <button
        className={`${
          active === 1
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C]"
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
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C]"
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
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C]"
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
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C]"
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
