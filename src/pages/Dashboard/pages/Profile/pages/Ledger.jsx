import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLedgerData, searchLedger } from "../../../../../api/userAuth";
import { columns, tableCustomStyles } from "../components/LedgerUtils";
import { Pagination } from "@mui/material";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const Ledger = () => {
  const itemsPerPage = 10;
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState(false);
  const [sort, setsort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(filterText, 1000);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { data: ledgerData } = useQuery({
    queryFn: () => {
      if (debouncedSearch === "") {
        return getAllLedgerData(
          currentPage,
          itemsPerPage,
          sort,
          localStorage.getItem("uId"),
        );
      } else {
        return searchLedger(currentPage, itemsPerPage, sort, debouncedSearch);
      }
    },
    queryKey: ["ledgerData", currentPage, sort, debouncedSearch],
  });

  useEffect(() => {
    setCurrentPage(1); // Reset current page when filter or sort changes
  }, [debouncedSearch, sort]);

  const handleChange = (event, page) => {
    setCurrentPage(page * 1);
  };

  const handleDropdown = () => {
    setSelectedOption(!selectedOption);
  };

  const handleOptionClick = (option) => {
    setsort(option);
    setSelectedOption(false);
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="flex w-full justify-between">
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
                <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance : 0 }</p>
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
              className="w-full rounded-[3.34px] border-[1.153px] border-[#C1C1C1] bg-white py-[2.3px] pl-[13.34px] text-[5.79px] font-normal leading-normal -tracking-[0.2px] text-[#B5B7C0] tablet:w-[248px] tablet:rounded-[11.526px] tablet:py-[8.07px] tablet:pl-[46px] tablet:text-[20px]"
            />
          </div>
          {/* sort */}
          <div className="relative h-[12.6px] w-[40%] rounded-[3.34px] border-[1.153px] border-[#C1C1C1] bg-white tablet:h-[43.3px] tablet:w-[186px] tablet:rounded-[11.526px]">
            <button
              onClick={handleDropdown}
              className="flex  h-full w-full items-center gap-1 pl-[5px] tablet:pl-[17px]"
            >
              <h1 className="leading-noremal text-[5.79px] font-normal -tracking-[0.2px] text-[#7E7E7E] tablet:text-[20.021px]">
                Sort by :
              </h1>
              <h1 className="leading-noremal text-[5.79px] font-semibold capitalize -tracking-[0.2px] text-[#3D3C42] tablet:text-[20.021px]">
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
  }, [filterText, selectedOption]);

  return (
    <div>
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px]">
        Ledger
      </h1>

      <div
        className={`${
          persistedTheme === "dark"
            ? "dark-shadow-inside-custom"
            : "shadow-inside"
        } tabet:rounded-[45px] mx-6 mb-[54px] mt-4 flex flex-col gap-[18.27px] rounded-[11.91px] px-[9px] py-3 tablet:mx-[106px] tablet:my-[54px] tablet:gap-[23px] tablet:pb-6 tablet:pl-5 tablet:pr-[43.25px] tablet:pt-[31px]`}
      >
        <DataTable
          columns={columns}
          data={ledgerData?.data.data}
          customStyles={tableCustomStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
        <div className="flex justify-between">
          {currentPage === 1 ? (
            <h1 className="text-[7.15px] font-medium text-[#B5B7C0] tablet:text-[16px]">
              Showing data 1 to {ledgerData?.data.data.length} of{" "}
              {ledgerData?.data.totalCount} entries
            </h1>
          ) : (
            <h1 className="text-[7.15px] font-medium text-[#B5B7C0] tablet:text-[16px]">
              Showing data {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                ledgerData?.data.totalCount,
              )}{" "}
              of {ledgerData?.data.totalCount} entries
            </h1>
          )}
          <Pagination
            count={ledgerData?.data.pageCount}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Ledger;

// Custom hook for debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
