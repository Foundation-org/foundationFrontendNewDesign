const Tabs = ({ handleSelectedTab, active }) => {
  return (
    <div className="mx-[62px] mt-[50px] mb-[67px] flex justify-between">
      <button
        className={`${
          active === 1
            ? 'bg-[#4A8DBD] border-[#4A8DBD] text-white'
            : 'bg-[#f9f9f9] border-[#BABABA] text-[#7C7C7C]'
        }  text-[31.33px] font-semibold leading-normal  border-[1px]  rounded-[20.93px] py-[16.8px] px-[44.6px]`}
        onClick={() => {
          handleSelectedTab(1);
        }}
      >
        Contributions
      </button>
      <button
        className={`${
          active === 2
            ? 'bg-[#4A8DBD] border-[#4A8DBD] text-white'
            : 'bg-[#f9f9f9] border-[#BABABA] text-[#7C7C7C]'
        }  text-[31.33px] font-semibold leading-normal  border-[1px]  rounded-[20.93px] py-[16.8px] px-[44.6px]`}
        onClick={() => {
          handleSelectedTab(2);
        }}
      >
        Verfication Badges
      </button>
      <button
        className={`${
          active === 3
            ? 'bg-[#4A8DBD] border-[#4A8DBD] text-white'
            : 'bg-[#f9f9f9] border-[#BABABA] text-[#7C7C7C]'
        }  text-[31.33px] font-semibold leading-normal  border-[1px]  rounded-[20.93px] py-[16.8px] px-[44.6px]`}
        onClick={() => {
          handleSelectedTab(3);
        }}
      >
        Ledger
      </button>
      <button
        className={`${
          active === 4
            ? 'bg-[#4A8DBD] border-[#4A8DBD] text-white'
            : 'bg-[#f9f9f9] border-[#BABABA] text-[#7C7C7C]'
        }  text-[31.33px] font-semibold leading-normal  border-[1px]  rounded-[20.93px] py-[16.8px] px-[44.6px]`}
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
