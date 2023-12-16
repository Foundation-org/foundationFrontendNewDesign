import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../../../utils/useDebounce";
import { getAllLedgerData, searchLedger } from "../../../../../api/userAuth";

export default function BasicTable() {
  const itemsPerPage = 10;
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setsort] = useState("newest");
  const [filterText, setFilterText] = useState("");
  const debouncedSearch = useDebounce(filterText, 1000);

  const columns = [
    {
      accessorKey: "txUserAction",
      header: "txUserAction",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "txID",
      header: "txID",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "txAuth",
      header: "txAuth",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "txFrom",
      header: "txFrom",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "txTo",
      header: "txTo",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "txAmount",
      header: "txAmount",
      cell: (props) => <p>{props.getValue()}</p>,
    },
  ];

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
    <div
      className="mx-[60px] mb-10 rounded-[18px] px-[40px] py-[30px] text-left"
      style={{ boxShadow: "0px 0px 8.689655303955078px 0px #00000040 inset" }}
    >
      <div className="no-scrollbar h-[600px] w-full overflow-auto">
        <table className="w-full">
          <thead className="text-[1rem] text-[#B5B7C0] md:text-[1.5rem]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className=" border=[#EEEEEE] border-0 border-b "
              >
                {headerGroup.headers.map((header) => (
                  <th className="py-2.5 font-normal" key={header.id}>
                    {header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-[0.875rem] md:text-[1.25rem]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className=" border=[#EEEEEE] border-0 border-b ">
                {row.getVisibleCells().map((cell) => (
                  <td className=" py-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-[880px]:justify-center mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[1rem] text-[#B5B7C0] ">
          Showing data {(table.getState().pagination.pageIndex + 1) * 10 - 9} to{" "}
          {(table.getState().pagination.pageIndex + 1) * 10} of{" "}
          {ledgerData?.data.totalCount} entries
        </p>
        <div className="flex items-center">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="mr-4 h-7 w-[27px] rounded-md border border-solid border-[#EEEEEE] bg-[#F5F5F5] px-2.5 py-1.5"
          >
            <img
              className="h-[14px] w-[9px]"
              src={"./assets/svgs/arrow-back.svg"}
              alt=""
            />
          </button>
          <div className=" flex items-center gap-4">
            {rangeStart > 1 && (
              <button className="bg-white/0 font-medium text-black">...</button>
            )}
            {rangeStart && rangeEnd
              ? [...Array(rangeEnd - rangeStart + 1)].map((_, index) => {
                  const pageNumber = rangeStart + index;
                  return (
                    <button
                      className={`text-[13px]] flex h-[28px]  w-[27px] items-center justify-center rounded-md border  border-solid border-[#EEEEEE] ${
                        pageNumber === currentPage
                          ? "border border-solid border-[#5932EA] bg-[#4A8DBD] text-white"
                          : "bg-[#F5F5F5]"
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
              <button className="bg-white/0 font-medium text-black">...</button>
            )}
          </div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="ml-4 h-[28px] w-[27px] rounded-md border border-solid border-[#EEEEEE] bg-[#F5F5F5] px-2.5 py-1.5"
          >
            <img
              className="h-[14px] w-[9px]"
              src={"./assets/svgs/arrow-forward.svg"}
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
}
