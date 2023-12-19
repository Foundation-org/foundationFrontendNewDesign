import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../../../utils/useDebounce";
import { getAllLedgerData, searchLedger } from "../../../../../api/userAuth";
import { columns } from "../components/LedgerUtils";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import LedgerTableTopbar from "../components/LedgerTableTopbar";

export default function BasicTable() {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const itemsPerPage = 10;
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setsort] = useState("newest");
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState(false);
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

  const table = useReactTable({
    data: ledgerData?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange", // onChange onEnd
  });

  //   custom pagination
  useEffect(() => {
    setTotalPages(Math.ceil(ledgerData?.data.totalCount / rowsPerPage));
  }, [ledgerData?.data.totalCount, rowsPerPage]);

  const handlePageClick = (page) => {
    table.setPageIndex(page - 1);
  };

  useEffect(() => {
    setCurrentPage(table.getState().pagination.pageIndex + 1);
  }, [table.getState().pagination.pageIndex]);

  const visibleButtons = 5;
  const rangeStart = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
  const rangeEnd = Math.min(totalPages, rangeStart + visibleButtons - 1);

  return (
    <>
      <h1 className="mb-[25px] ml-[26px] mt-[6px] text-[12px] font-bold leading-normal text-[#4A8DBD] dark:text-[#B8B8B8] tablet:mb-[54px] tablet:ml-[46px] tablet:text-[24.99px] tablet:font-semibold laptop:ml-[156px] laptop:text-[32px]">
        Ledger
      </h1>
      <div
        className={`${
          persistedTheme === "dark" ? "ledger-dark" : "ledger-light"
        } mx-[17px] mb-10 rounded-[7.89px] px-[1.36rem] py-[13px] text-left tablet:mx-11 tablet:rounded-[10.4px] tablet:py-[30px] laptop:mx-[106px] laptop:rounded-[45px]`}
      >
        <LedgerTableTopbar
          sort={sort}
          setsort={setsort}
          filterText={filterText}
          setFilterText={setFilterText}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="no-scrollbar h-[600px] w-full overflow-auto">
          <table
            // className="w-full"
            style={{ width: table.getCenterTotalSize() }}
          >
            <thead
              style={{ width: table.getTotalSize() }}
              className="text-[0.7rem] text-[#bbb] dark:text-[#B5B7C0] md:text-[1.45rem] tablet:text-[1rem]"
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-0 border-b border-[#EEEEEE]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      style={{ width: header.getSize() }}
                      className="relative py-2.5 font-normal"
                      key={header.id}
                    >
                      {header.column.columnDef.header}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-[0.65rem] font-medium -tracking-[0.0125rem] md:text-[1.25rem] tablet:text-[0.875rem]">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className=" border-0 border-b border-[#EEEEEE] text-[#292D32] dark:text-[#C8C8C8] "
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className=" py-4"
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-[880px]:justify-center mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.44rem] text-[#B5B7C0] tablet:text-[1rem] ">
            Showing data {(table.getState().pagination.pageIndex + 1) * 10 - 9}{" "}
            to {(table.getState().pagination.pageIndex + 1) * 10} of{" "}
            {ledgerData?.data.totalCount} entries
          </p>
          <div className="flex items-center">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              <img
                className="h-[0.43rem] w-[0.31rem] tablet:h-[14px] tablet:w-[9px] "
                src={"./assets/svgs/arrow-back.svg"}
                alt=""
              />
            </button>
            <div className=" flex items-center gap-[0.46rem] tablet:gap-4">
              {rangeStart > 1 && (
                <button className="bg-white/0 font-medium text-black">
                  ...
                </button>
              )}
              {rangeStart && rangeEnd
                ? [...Array(rangeEnd - rangeStart + 1)].map((_, index) => {
                    const pageNumber = rangeStart + index;
                    return (
                      <button
                        className={`flex h-[0.91rem] w-[0.92rem] items-center justify-center rounded-[0.15rem] border border-solid border-[#EEEEEE] text-[0.45rem] tablet:h-[28px] tablet:w-[27px] tablet:rounded-md tablet:text-[13px] ${
                          pageNumber === currentPage
                            ? "border border-solid border-[#5932EA] bg-[#4A8DBD] text-white"
                            : "bg-[#F5F5F5] text-[#4A4A4A] dark:bg-[#A5A5A5]"
                        }`}
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })
                : null}
              {rangeEnd < totalPages && (
                <button className="bg-white/0 font-medium text-black dark:text-[#B3B3B3]">
                  ...
                </button>
              )}
            </div>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              <img
                className="h-[0.43rem] w-[0.31rem] tablet:h-[14px] tablet:w-[9px] "
                src={"./assets/svgs/arrow-forward.svg"}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
