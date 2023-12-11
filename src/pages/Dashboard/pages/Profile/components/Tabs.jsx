const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mx-[62px] mb-[67px] mt-[50px] flex justify-between gap-9">
      <button
        className={`${
          active === 1
            ? "border-[#4A8DBD] bg-[#4A8DBD] text-white"
            : "border-[#BABABA] bg-[#f9f9f9] text-[#7C7C7C]"
        }  laptop:py-[16.8px] laptop:px-[44.6px] rounded-[20.93px] border-[1px]  px-8 py-3 text-[20px] font-semibold leading-normal 2xl:px-[24px] 2xl:text-[31.33px]`}
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
        }  rounded-[20.93px] border-[1px] px-[44.6px] py-[16.8px]  text-[20px]  font-semibold leading-normal 2xl:text-[31.33px]`}
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
        }   rounded-[20.93px] border-[1px] px-[44.6px] py-[16.8px]  text-[20px]  font-semibold leading-normal 2xl:text-[31.33px]`}
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
        }  rounded-[20.93px] border-[1px] px-[44.6px] py-[16.8px]  text-[20px]  font-semibold leading-normal 2xl:text-[31.33px]`}
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
