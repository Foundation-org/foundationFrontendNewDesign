import { useSelector } from "react-redux";

const LedgerTableTopbar = ({
  sort,
  setsort,
  filterText,
  setFilterText,
  selectedOption,
  setSelectedOption,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const handleDropdown = () => {
    setSelectedOption(!selectedOption);
  };

  const handleOptionClick = (option) => {
    setsort(option);
    setSelectedOption(false);
  };

  return (
    <div className="mb-8 flex w-full justify-between">
      <div className="flex gap-[10.97px] tablet:gap-[63px]">
        {/* profile */}
        <div className="flex gap-[7px] tablet:gap-[13px]">
          <img
            src="/assets/svgs/dashboard/person.svg"
            alt="person icon"
            className="h-[18.5px] w-[18.5px] tablet:h-[44.2px] tablet:w-[44.2px]"
          />
          <div>
            <h1 className="text-[8.6px] font-semibold leading-normal -tracking-[0.207px] text-[#ACACAC] tablet:text-[20.7px]">
              My Profile
            </h1>
            <div className="flex gap-1 text-[5.79px] font-normal leading-normal text-[#616161] tablet:text-[13.824px]">
              <p>Balance</p>
              <p>
                {persistedUserInfo?.balance ? persistedUserInfo?.balance : 0}
              </p>
            </div>
          </div>
        </div>
        {/* treasury */}
        <div className="flex gap-[7px] tablet:gap-[13px]">
          <img
            src="/assets/svgs/dashboard/treasure.svg"
            alt="person icon"
            className="h-[18.5px] w-[18.5px] tablet:h-[44.2px] tablet:w-[44.2px]"
          />
          <div>
            <h1 className="text-[8.6px] font-semibold leading-normal -tracking-[0.207px] text-[#ACACAC] tablet:text-[20.7px]">
              Treasury
            </h1>
            <div className="flex gap-1 text-[5.79px] font-normal leading-normal text-[#616161] tablet:text-[13.824px]">
              <p>Balance</p>
              <p>{localStorage.getItem("treasuryAmount")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[5.4px] tablet:gap-[23.5px]">
        {/* search */}
        <div className="relative flex h-[12.6px] tablet:h-[43px]">
          <img
            src="/assets/svgs/dashboard/search2.svg"
            alt="search icon"
            className="absolute left-1 top-1/2 h-2 w-2 -translate-y-[50%] transform tablet:left-[9.22px] tablet:h-[27px] tablet:w-[27px]"
          />
          <input
            type="text"
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
            placeholder="Search"
            className="w-full rounded-[3.34px] border-[1.153px] border-[#C1C1C1] bg-white py-[2.3px] pl-[13.34px] text-[5.79px] font-normal leading-normal -tracking-[0.2px] text-[#B5B7C0] dark:bg-[#080A0C] tablet:w-[248px] tablet:rounded-[11.526px] tablet:py-[8.07px] tablet:pl-[46px] tablet:text-[20px]"
          />
        </div>
        {/* sort */}
        <div className="relative h-[12.6px] w-[40%] rounded-[3.34px] border-[1.153px] border-[#C1C1C1] bg-white dark:bg-[#080A0C] tablet:h-[43.3px] tablet:w-[186px] tablet:rounded-[11.526px]">
          <button
            onClick={handleDropdown}
            className="flex  h-full w-full items-center gap-1 pl-[5px] tablet:pl-[17px]"
          >
            <h1 className="leading-noremal text-[5.79px] font-normal -tracking-[0.2px] text-[#7E7E7E] tablet:text-[20.021px]">
              Sort by :
            </h1>
            <h1 className="leading-noremal text-[5.79px] font-semibold capitalize -tracking-[0.2px] text-[#3D3C42] dark:text-[#B5B5B5] tablet:text-[20.021px]">
              {sort}
            </h1>
          </button>
          <div
            className={`${
              selectedOption ? "flex duration-200 ease-in-out" : "hidden"
            } absolute z-50 mt-2 w-32 flex-col gap-2 rounded-md bg-gray px-1 py-2 text-left text-black`}
          >
            <p
              className="cursor-pointer rounded-md px-2 duration-200 ease-in-out hover:bg-white"
              onClick={() => handleOptionClick("newest")}
            >
              Newest
            </p>
            <p
              className="cursor-pointer rounded-md px-2 duration-200 ease-in-out hover:bg-white"
              onClick={() => handleOptionClick("oldest")}
            >
              Oldest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerTableTopbar;
