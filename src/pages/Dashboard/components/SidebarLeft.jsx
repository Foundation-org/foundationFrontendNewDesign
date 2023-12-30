import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import Dropdown2 from "../../../components/Dropdown2";
import CustomSwitch2 from "../../../components/CustomSwitch2";
import BasicModal from "../../../components/BasicModal";
import TopicPreferences from "./topicpreferences";

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
  expandedView,
  setExpandedView,
  columns,
  setColumns,
}) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [multipleOption, setMultipleOption] = useState(false);
  const [openTopicPref, setOpenTopicPref] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");

  const handleSwitchChange = () => {
    dispatch(setFilterByScope(multipleOption ? "All" : "Me"));
    setMultipleOption(!multipleOption);
  };

  const handleTopicPref = () => {
    setOpenTopicPref(!openTopicPref);
  };

  const customModalStyle = {
    backgroundColor: "#FCFCFD",
    boxShadow: "none",
    border: "0px",
    outline: "none",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
  };

  return (
    <>
      <div className="no-scrollbar hidden h-[calc(100vh-96px)] w-[18.25rem] min-w-[18.25rem] flex-col items-center justify-between overflow-y-auto  bg-white text-[#535353] dark:bg-[#0A0A0C] dark:text-white laptop:flex 5xl:w-[23rem] 5xl:min-w-[23rem]">
        <div className="flex flex-col items-center">
          <div className="flex w-full items-center justify-center gap-[25px] border-b-2 border-[#707175] pb-6 pt-[35px]">
            <h1 className="ml-[5px] flex items-center gap-2 text-[20px] font-medium leading-normal text-[#707175] dark:text-white">
              Expanded View
            </h1>
            <CustomSwitch2
              enabled={expandedView}
              setEnabled={setExpandedView}
            />
          </div>
          <div className="relative mt-[36px]">
            <div className="relative h-[45px] w-[212px]">
              <input
                type="text"
                id="floating_outlined"
                className="dark:focus:border-blue-500 focus:border-blue-600 peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-[#707175] tablet:text-[18.23px]"
                placeholder=" "
                value={searchData}
                onChange={handleSearch}
              />
              <label
                htmlFor="floating_outlined"
                className="peer-focus:text-blue-600 peer-focus:dark:text-blue-500 te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2  text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-[#0A0A0C] tablet:text-[17px]"
              >
                Search
              </label>
            </div>
            {searchData && (
              <button
                className="absolute right-3 top-4"
                onClick={() => {
                  setSearchData("");
                }}
              >
                <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
              </button>
            )}
            {!searchData && (
              <img
                src="/assets/svgs/dashboard/search.svg"
                alt="search"
                className="absolute right-3 top-4 h-4 w-4"
              />
            )}
          </div>
          <h1 className="flex w-[212px] items-center gap-2 pb-[31px] pt-[33px] text-[22px] font-[500] leading-normal text-[#888] dark:text-white">
            <img
              src="/assets/svgs/dashboard/filter.svg"
              alt="filter"
              className="h-[1.188rem] w-[1.188rem]"
            />
            Filters
          </h1>
          <button
            onClick={handleTopicPref}
            className="h-[45px] w-[212px] rounded-[10px] border-2 border-[#707175] bg-[#C9C8C8] px-5 py-2 text-[18px] font-medium text-[#707175] focus:outline-none dark:bg-[#333B46] dark:text-[#DCDCDC]"
          >
            Topic Preferences
          </button>
          <BasicModal
            open={openTopicPref}
            handleClose={handleTopicPref}
            customStyle={customModalStyle}
            customClasses="rounded-[2.31rem] w-[75vw] h-[80vh]"
          >
            <TopicPreferences
              topicSearch={topicSearch}
              setTopicSearch={setTopicSearch}
              columns={columns}
              setColumns={setColumns}
            />
          </BasicModal>
          <div className="mt-[46px] flex flex-col gap-9">
            <Dropdown2
              label={"Status"}
              title={
                filterStates.filterByStatus
                  ? filterStates.filterByStatus
                  : "All"
              }
              items={[
                "All",
                "Unanswered",
                "Answered",
                "Completed",
                "Changeable",
              ]}
              handleSelect={(item) => {
                dispatch(setFilterByStatus(item));
              }}
            />
            <Dropdown2
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
            <Dropdown2
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
          <div className="flex w-full items-center justify-center gap-[17px] pb-[30px] pt-[35px]">
            <h1 className="flex items-center gap-2 text-[14px] font-medium leading-normal text-[#707175] dark:text-white">
              Show Only My Quests
            </h1>
            <CustomSwitch2
              enabled={multipleOption}
              setEnabled={handleSwitchChange}
            />
          </div>
          <button
            className={`${
              persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            }  inset-0 w-[192px] rounded-[0.938rem] px-5 py-2 text-[1.25rem] font-semibold leading-normal text-white shadow-inner dark:text-[#EAEAEA]`}
            onClick={() => {
              dispatch(resetFilters());
              setClearFilter(!clearFilter);
            }}
          >
            Clear Filters
          </button>
        </div>
        <h1 className="flex w-[212px] items-center gap-[0.9rem] pb-[31px] pt-[33px] text-[22px] font-[500] leading-normal text-[#7C7C7C] dark:text-white">
          <img
            src="/assets/svgs/support.svg"
            alt="support"
            className="h-[2.84rem] w-[2.84rem]"
          />{" "}
          Support
        </h1>
      </div>
      {/* sidebar mobile */}
      <div className="block bg-white px-[15px] py-[10px] dark:bg-[#0A0A0C] tablet:px-[37px] tablet:py-[26px] laptop:hidden">
        <div className="flex items-center justify-between gap-2 tablet:gap-[13px]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search here...."
              className="h-[25px] w-full min-w-[215px] rounded-[8px] border-[1px] border-white bg-[#F6F6F6] px-3 text-[8.4px] text-gray-400 focus:outline-none dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8] tablet:h-[50.7px] tablet:text-[17.13px]"
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
                className="absolute right-[12px] top-[9px] h-3 w-3 tablet:top-3 tablet:h-[26.4px] tablet:w-[24.3px]"
              />
            )}
          </div>
          <div className="mr-1 flex w-[8rem] gap-[6px] tablet:w-[19rem]">
            <img
              src="/assets/svgs/dashboard/treasure.svg"
              alt="badge"
              className="h-[23px] w-[23px] tablet:h-[46.8px] tablet:w-[46.8px]"
            />
            <div>
              <h4 className="text-[9.3px] font-semibold text-[#616161] dark:text-[#D4D5D7] tablet:text-[18.9px]">
                Treasury
              </h4>
              <p className="whitespace-nowrap text-[6.227px] text-[#616161] dark:text-[#BDBCBC] tablet:text-[12.651px]">
                Balance: <span>{localStorage.getItem("treasuryAmount")}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between gap-[6px] tablet:mt-[21px]">
          <Dropdown2
            label={"Status"}
            title={
              filterStates.filterByStatus ? filterStates.filterByStatus : "All"
            }
            items={["All", "Unanswered", "Answered", "Completed", "Changeable"]}
            handleSelect={(item) => {
              dispatch(setFilterByStatus(item));
            }}
          />
          <Dropdown2
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
          <Dropdown2
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
          <button
            className={`${
              persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            }  inset-0 w-full rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
            onClick={() => {
              dispatch(resetFilters());
              setClearFilter(!clearFilter);
            }}
          >
            Clear Filters
          </button>
        </div>
        <div className="mt-[9px] flex items-center justify-between gap-[4px] tablet:mt-[21px]">
          <button
            className={`${
              persistedTheme === "dark"
                ? "bg-[#333B46]"
                : "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]"
            }  inset-0 w-4/6 rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
            onClick={() => {
              dispatch(resetFilters());
              setClearFilter(!clearFilter);
            }}
          >
            Preferences
          </button>
          <div className="flex w-full items-center justify-center gap-[6px]">
            <h1 className="whitespace-nowrap text-[8px] font-medium leading-normal text-[#707175] dark:text-white tablet:text-[15px]">
              Expanded View
            </h1>
            <CustomSwitch2
              enabled={expandedView}
              setEnabled={setExpandedView}
            />
          </div>
          <div className="flex w-full items-center justify-center gap-[6px]">
            <h1 className="whitespace-nowrap text-[8px] font-medium leading-normal text-[#707175] dark:text-white tablet:text-[15px]">
              Show Only My Quests
            </h1>
            <CustomSwitch2
              enabled={multipleOption}
              setEnabled={handleSwitchChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;
