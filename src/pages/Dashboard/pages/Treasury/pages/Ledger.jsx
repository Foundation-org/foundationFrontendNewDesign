import { useEffect, useState, useMemo } from 'react';
import { useDebounce } from '../../../../../utils/useDebounce';
import {
  getAllRadeemLedgerData,
  getAllRedemptionLedgerData,
  searchRedemptionLedger,
} from '../../../../../services/api/userAuth';
import { Columns } from '../../Profile/components/LedgerUtils';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useSelector, useDispatch } from 'react-redux';
import LedgerTableTopbar from '../../Profile/components/LedgerTableTopbar';
import { format } from 'date-fns';
import { updateColumnSize } from '../../../../../features/profile/legerSlice';

export default function Ledger() {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const columnSizes = useSelector((state) => state.ledger);
  const itemsPerPage = 10;
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setsort] = useState('newest');
  const [filterText, setFilterText] = useState('');
  const [selectedOption, setSelectedOption] = useState(false);
  const debouncedSearch = useDebounce(filterText, 1000);
  const [ledgerData, setLedgerData] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getAllRedemptionLedgerData(currentPage, itemsPerPage, sort, persistedUserInfo.uuid);
      if (data) {
        setLedgerData(data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const findingLedger = async () => {
    try {
      const data = await searchRedemptionLedger(
        currentPage,
        itemsPerPage,
        sort,
        debouncedSearch,
        persistedUserInfo.uuid,
      );
      if (data) {
        setLedgerData(data);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    if (debouncedSearch === '') {
      fetchData();
    } else {
      findingLedger();
    }
  }, [sort, debouncedSearch]);

  const columns = useMemo(() => {
    const tempColumns = Columns.map((column) => {
      const id = column.accessorKey;
      const size = columnSizes[id];
      return {
        ...column,
        size: size || column.size,
      };
    });

    return tempColumns;
  }, [Columns]);

  const table = useReactTable({
    data: ledgerData?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange', // onChange onEnd
  });

  //   custom pagination
  useEffect(() => {
    setTotalPages(Math.ceil(ledgerData?.data?.totalCount / rowsPerPage));
  }, [ledgerData?.data?.totalCount, rowsPerPage]);

  const handlePageClick = async (page) => {
    setCurrentPage(page);
    const data = await getAllRadeemLedgerData(page, itemsPerPage, sort);
    if (data) {
      setLedgerData(data);
    }
  };

  const visibleButtons = 5;
  const rangeStart = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
  const rangeEnd = Math.min(totalPages, rangeStart + visibleButtons - 1);

  useEffect(() => {
    return () => {
      table.getHeaderGroups()[0].headers.forEach((header) => {
        const columnId = header.id;
        const size = header.getSize();
        dispatch(updateColumnSize({ columnId, size: size }));
      });
    };
  }, [columnSizes, table]);

  return (
    <div className="overflow-y-auto">
      <div
        className={`${
          persistedTheme === 'dark' ? 'ledger-dark' : 'ledger-light bg-white'
        } mx-[17px] mb-10 rounded-[7.89px] px-[0.59rem] py-[13px] text-left tablet:mx-[25px] tablet:rounded-[10.4px] tablet:px-[1.36rem] tablet:py-[30px] laptop:rounded-[18px]`}
      >
        <LedgerTableTopbar
          isTreasury={false}
          sort={sort}
          setsort={setsort}
          filterText={filterText}
          setFilterText={setFilterText}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="no-scrollbar relative w-full overflow-auto tablet:h-[600px]">
          <table
            className="w-full"
            // style={{
            //   minWidth:
            //     window.innerWidth <= 1700 && window.innerWidth >= 744
            //       ? '600px'
            //       : window.innerWidth <= 744 && window.innerWidth >= 0
            //         ? '350px'
            //         : 'auto',
            //   width:
            //     window.innerWidth <= 1700 && window.innerWidth >= 900
            //       ? '100%'
            //       : window.innerWidth <= 900 && window.innerWidth >= 744
            //         ? '120%'
            //         : window.innerWidth <= 744 && window.innerWidth >= 0
            //           ? '100%'
            //           : table.getCenterTotalSize(),
            // }}
            // {...{
            //   style: {
            //     width: table.getCenterTotalSize(),
            //   },
            // }}
          >
            <thead
              style={{ width: table.getTotalSize() }}
              className="text-[0.4rem] text-[#bbb] tablet:text-[.88rem] laptop:text-[1.2rem] dark:text-[#B5B7C0]"
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="relative py-1 font-normal tablet:py-3"
                      {...{
                        key: header.id,
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-[0.65rem] font-medium -tracking-[0.0125rem] tablet:text-[1rem] laptop:text-[0.875rem]">
              {table.getRowModel().rows.length === 0 ? (
                <div>
                  <h4 className="mt-4 text-[0.4rem] md:text-[.88rem] tablet:mt-20 laptop:text-[1.2rem]">&#x200B;</h4>
                  <h4 className="mt-3 text-center text-[0.4rem] md:text-[.88rem] tablet:mt-10 laptop:text-[1.2rem] ">
                    No results found
                  </h4>
                </div>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className=" whitespace-nowrap border-0 border-b border-[#EEEEEE] text-[#292D32] dark:text-[#C8C8C8]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="truncate py-1 text-[0.4rem] tablet:py-3 tablet:text-[.88rem] laptop:text-[1.2rem]"
                        {...{
                          key: cell.id,
                          style: {
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                          },
                        }}
                      >
                        {cell.column.id === 'txID'
                          ? `${cell.getValue().slice(0, 4)}..${cell.getValue().slice(-3)}`
                          : cell.column.id === 'txDate'
                            ? format(new Date(cell.getValue()), 'dd MMM yyyy, hh:mm a')
                            : cell.column.id === 'txFrom' &&
                                cell.getValue() !== 'DAO Treasury' &&
                                cell.getValue() !== 'dao' &&
                                cell.getValue() !== persistedUserInfo?.uuid
                              ? `User`
                              : cell.getValue() === persistedUserInfo?.uuid
                                ? 'My Account'
                                : cell.column.id === 'txTo' &&
                                    cell.getValue() !== 'DAO Treasury' &&
                                    cell.getValue() !== 'dao'
                                  ? `User`
                                  : cell.getValue() === 'dao'
                                    ? 'DAO'
                                    : cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="max-[880px]:justify-center mt-2 flex flex-wrap items-center justify-end gap-3 tablet:-mt-7 laptop:mt-6">
          {/* <p></p> */}

          <div
            className={`flex items-center gap-2 tablet:gap-3.5 laptop:mr-[3.46rem] ${rangeStart === 1 && (rangeEnd === 0 || rangeEnd === 1) ? 'hidden' : ''}`}
          >
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === rangeStart && true}
              className="pagination-btn"
            >
              <img
                className="h-[0.43rem] w-[0.31rem] tablet:h-[14px] tablet:w-[9px]"
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-back.svg`}
                alt=""
              />
            </button>
            <div className=" flex items-center gap-[0.46rem] tablet:gap-4 ">
              {rangeStart > 1 && (
                <button className="bg-white/0 text-[9px] font-medium text-black tablet:text-[16px] dark:text-[#B3B3B3]">
                  ...
                </button>
              )}
              {rangeStart && rangeEnd
                ? [...Array(rangeEnd - rangeStart + 1)].map((_, index) => {
                    const pageNumber = rangeStart + index;
                    return (
                      <button
                        className={`flex h-[0.91rem] w-[0.92rem] items-center justify-center rounded-[0.15rem] pt-[2px] text-[0.45rem] tablet:h-[28px] tablet:w-[27px] tablet:rounded-md tablet:pt-[0px] tablet:text-[13px] ${
                          pageNumber === currentPage
                            ? 'border border-solid border-[#5932EA] bg-[#4A8DBD] text-white dark:border-none dark:bg-[#252D37]'
                            : 'bg-[#F5F5F5] text-[#4A4A4A] dark:bg-[#A5A5A5]'
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
                <button className="mr-2 bg-white/0 text-[9px] font-medium text-black tablet:mr-4 tablet:text-[16px] dark:text-[#B3B3B3]">
                  ...
                </button>
              )}
            </div>
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === rangeEnd && true}
              className="pagination-btn"
            >
              <img
                className="h-[0.43rem] w-[0.31rem] tablet:h-[14px] tablet:w-[9px] "
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-forward.svg`}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}