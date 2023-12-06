import Dropdown from "../../../components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { GrClose } from "react-icons/gr";

const SidebarLeft = ({
  handleSearch,
  searchData,
  clearFilter,
  setClearFilter,
  setSearchData,
  filterStates,
  resetFilters,
  setFilterByScope,
  setFilterBySort,
  setFilterByStatus,
  setFilterByType,
}) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <>
      <div className="no-scrollbar tablet:block hidden h-[calc(100vh-96px)] w-[18.25rem] min-w-[18.25rem] overflow-y-auto bg-white pl-[2.18rem] pt-[4.563rem] text-[#535353] dark:bg-[#0A0A0C] dark:text-white 5xl:w-[23rem] 5xl:min-w-[23rem] 5xl:pr-[2.18rem]">
        <div className="form-control w-full max-w-[13.25rem] 5xl:max-w-full">
          <label className="ml-[5px] pb-[9px] text-[22px] font-[400] leading-normal">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search here...."
              className="input h-[54px] w-full rounded-[18px] border-[1px] bg-[#F6F6F6] pr-10 text-gray-400 focus:outline-none dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8]"
              value={searchData}
              onChange={handleSearch}
            />
            {searchData && (
              <button
                className="absolute right-3 top-4"
                onClick={() => {
                  setSearchData("");
                }}
              >
                <GrClose className="h-6 w-6 text-black dark:text-white" />
              </button>
            )}
            {!searchData && (
              <img
                src="/assets/svgs/dashboard/search.svg"
                alt="search"
                className="absolute right-3 top-4 h-6 w-6"
              />
            )}
          </div>
        </div>
        <h1 className="ml-[5px] flex items-center gap-2 pb-[31px] pt-[33px] text-[22px] font-[500] leading-normal text-[#888] dark:text-white">
          <img
            src="/assets/svgs/dashboard/filter.svg"
            alt="filter"
            className="h-[1.188rem] w-[1.188rem]"
          />
          Filters
        </h1>
        <div className="flex flex-col gap-5">
          <Dropdown
            label={"Status"}
            title={
              filterStates.filterByStatus ? filterStates.filterByStatus : "All"
            }
            items={[
              "All",
              "Unanswered",
              "Answered",
              "Correct",
              "Incorrect",
              "Changeable",
            ]}
            handleSelect={(item) => {
              dispatch(setFilterByStatus(item));
            }}
          />
          <Dropdown
            label={"Type"}
            title={
              filterStates.filterByType ? filterStates.filterByType : "All"
            }
            items={[
              "All",
              "Yes/No",
              "Agree/Disagree",
              "Multiple Choise",
              "Ranked Choise",
            ]}
            handleSelect={(item) => {
              dispatch(setFilterByType(item));
            }}
          />
          <Dropdown
            label={"Scope"}
            title={
              filterStates.filterByScope ? filterStates.filterByScope : "All"
            }
            items={["All", "Me"]}
            handleSelect={(item) => {
              dispatch(setFilterByScope(item));
            }}
          />
          <Dropdown
            label={"Sort"}
            title={
              filterStates.filterBySort
                ? filterStates.filterBySort
                : "Newest First"
            }
            items={[
              "Most Popular",
              "Last Updated",
              "Oldest First",
              "Newest First",
            ]}
            handleSelect={(item) => {
              dispatch(setFilterBySort(item));
            }}
          />
        </div>
        <button
          className={`${
            persistedTheme === "dark"
              ? "bg-[#333B46]"
              : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
          }  inset-0 ml-[1.125rem] mt-12 rounded-[0.938rem] px-5 py-2 text-[1.25rem] font-semibold leading-normal text-white shadow-inner dark:text-[#EAEAEA]`}
          onClick={() => {
            dispatch(resetFilters());
            setClearFilter(!clearFilter);
          }}
        >
          Clear Filters
        </button>
      </div>
      {/* sidebar mobile */}
      <div className="tablet:hidden block bg-[#0A0A0C] px-[15px] py-[10px]">
        <div className="flex items-center justify-between gap-[13px]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search here...."
              className="h-[25px] w-full min-w-[224px] rounded-[18px] border-[1px] bg-[#F6F6F6] px-3 text-[8.4px] text-gray-400 focus:outline-none dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8]"
              value={searchData}
              onChange={handleSearch}
            />
            {searchData && (
              <button
                className="absolute right-3 top-[9px]"
                onClick={() => {
                  setSearchData("");
                }}
              >
                <GrClose className="h-3 w-3 text-black dark:text-white" />
              </button>
            )}
            {!searchData && (
              <img
                src="/assets/svgs/dashboard/search.svg"
                alt="search"
                className="absolute right-3 top-[9px] h-3 w-3"
              />
            )}
          </div>
          <div className="flex gap-[6px]">
            <img
              src="/assets/svgs/dashboard/treasure.svg"
              alt="badge"
              className="h-[23px] w-[23px]"
            />
            <div>
              <h4 className="text-[9.3px] font-semibold text-[#EDEDED]">
                Treasury
              </h4>
              <p className="text-[6.227px] text-[#616161] dark:text-[#BDBCBC]">
                Balance <span>1,357,432.20</span>
              </p>
            </div>
          </div>
        </div>
        <div className="tablet:mt-0 mt-[10px] flex justify-around gap-[6px]">
          <Dropdown
            label={"Status"}
            title={
              filterStates.filterByStatus ? filterStates.filterByStatus : "All"
            }
            items={[
              "All",
              "Unanswered",
              "Answered",
              "Correct",
              "Incorrect",
              "Changeable",
            ]}
            handleSelect={(item) => {
              dispatch(setFilterByStatus(item));
            }}
          />
          <Dropdown
            label={"Type"}
            title={
              filterStates.filterByType ? filterStates.filterByType : "All"
            }
            items={[
              "All",
              "Yes/No",
              "Agree/Disagree",
              "Multiple Choise",
              "Ranked Choise",
            ]}
            handleSelect={(item) => {
              dispatch(setFilterByType(item));
            }}
          />
          <Dropdown
            label={"Scope"}
            title={
              filterStates.filterByScope ? filterStates.filterByScope : "All"
            }
            items={["All", "Me"]}
            handleSelect={(item) => {
              dispatch(setFilterByScope(item));
            }}
          />
          <Dropdown
            label={"Sort"}
            title={
              filterStates.filterBySort
                ? filterStates.filterBySort
                : "Newest First"
            }
            items={[
              "Most Popular",
              "Last Updated",
              "Oldest First",
              "Newest First",
            ]}
            handleSelect={(item) => {
              dispatch(setFilterBySort(item));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;
