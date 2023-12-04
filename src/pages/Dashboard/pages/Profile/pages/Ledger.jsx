import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLedgerData, searchLedger } from "../../../../../api/userAuth";
import { columns, tableCustomStyles } from "../components/LedgerUtils";
import { Pagination } from "@mui/material";
import DataTable from "react-data-table-component";

const Ledger = () => {
  const itemsPerPage = 10;
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState(false);
  const [sort, setsort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(filterText, 1000);

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
        <div className="flex gap-[63px]">
          {/* profile */}
          <div className="flex gap-[13px]">
            <img
              src="/assets/svgs/dashboard/person.svg"
              alt="person icon"
              className="h-[44.2px] w-[44.2px]"
            />
            <div>
              <h1 className="text-[20.7px] font-semibold leading-normal -tracking-[0.207px] text-[#ACACAC]">
                My Profile
              </h1>
              <div className="flex gap-1 text-[13.824px] font-normal leading-normal text-[#616161]">
                <p>Balance</p>
                <p>0.98</p>
              </div>
            </div>
          </div>
          {/* treasury */}
          <div className="flex gap-[13px]">
            <img
              src="/assets/svgs/dashboard/treasure.svg"
              alt="person icon"
              className="h-[44.2px] w-[44.2px]"
            />
            <div>
              <h1 className="text-[20.7px] font-semibold leading-normal -tracking-[0.207px] text-[#ACACAC]">
                Treasury
              </h1>
              <div className="flex gap-1 text-[13.824px] font-normal leading-normal text-[#616161]">
                <p>Balance</p>
                <p>1,357,432.20</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[23.5px]">
          {/* search */}
          <div className="relative flex h-[43px]">
            <img
              src="/assets/svgs/dashboard/search2.svg"
              alt="search icon"
              className="absolute left-[9.22px] top-1/2 h-[27px] w-[27px] -translate-y-[50%] transform"
            />
            <input
              type="text"
              onChange={(e) => setFilterText(e.target.value)}
              value={filterText}
              placeholder="Search"
              className="w-[248px] rounded-[11.526px] border-[1.153px] border-[#C1C1C1] bg-white py-[8.07px] pl-[46px] text-[20px] font-normal leading-normal -tracking-[0.2px] text-[#B5B7C0]"
            />
          </div>
          {/* sort */}
          <div className="relative h-[43.3px] w-[186px] rounded-[11.526px] border-[1.153px] border-[#C1C1C1] bg-white">
            <button
              onClick={handleDropdown}
              className="flex h-full w-full items-center gap-1 pl-[17px]"
            >
              <h1 className="leading-noremal text-[20.021px] font-normal -tracking-[0.2px] text-[#7E7E7E]">
                Sort by :
              </h1>
              <h1 className="leading-noremal text-[20.021px] font-semibold capitalize -tracking-[0.2px] text-[#3D3C42]">
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
      <h1 className="ml-[156px] mt-14 text-[32px] font-semibold leading-normal text-[#4A8DBD]">
        Ledger
      </h1>
      <div className="shadow-inside mx-[106px] my-[54px] flex flex-col gap-[23px] rounded-[45px] pb-6 pl-5 pr-[43.25px] pt-[31px]">
        <DataTable
          columns={columns}
          data={ledgerData?.data.data}
          customStyles={tableCustomStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
        <div className="flex justify-between">
          {currentPage === 1 ? (
            <h1>
              Showing data 1 to {ledgerData?.data.data.length} of{" "}
              {ledgerData?.data.totalCount} entries
            </h1>
          ) : (
            <h1>
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
