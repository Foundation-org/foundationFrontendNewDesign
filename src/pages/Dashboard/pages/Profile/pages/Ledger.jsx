import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllLedgerData } from '../../../../../api/userAuth';
import { columns, tableCustomStyles } from '../components/LedgerUtils';
import { Pagination } from '@mui/material';
import DataTable from 'react-data-table-component';

const Ledger = () => {
  const itemsPerPage = 10;
  const [filterText, setFilterText] = useState('');
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedVal, setSelectedVal] = useState('newest');
  const [filteredData, setFilteredData] = useState();
  // const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedLedgerData, setUpdateLedgerData] = useState();

  const { data: ledgerData } = useQuery({
    queryFn: () => getAllLedgerData(currentPage, itemsPerPage),
    queryKey: ['LedgerData', currentPage],
  });

  // console.log({ ledgerData });

  useEffect(() => {
    // const noOfPages = Math.ceil(ledgerData?.data.data.length / itemsPerPage);
    // setTotalPages(noOfPages);

    let ledgerDataBeforeSort = ledgerData?.data.data;

    if (selectedVal === 'newest') {
      ledgerDataBeforeSort?.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    } else {
      ledgerDataBeforeSort?.sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );
    }

    const newLedgerData = ledgerDataBeforeSort?.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setUpdateLedgerData(newLedgerData);
  }, [ledgerData, selectedVal]);

  console.log({ updatedLedgerData });

  // function paginateData(data, currentPage, itemsPerPage) {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return data.slice(startIndex, endIndex);
  // }

  useEffect(() => {
    if (updatedLedgerData) {
      if (filterText === '') {
        // const noOfPages = Math.ceil(updatedLedgerData?.length / itemsPerPage);
        // setTotalPages(noOfPages);
        // const paginatedItems = paginateData(
        //   updatedLedgerData,
        //   currentPage,
        //   itemsPerPage
        // );

        // if (paginatedItems) {
        //   setFilteredData(paginatedItems);
        // }

        setFilteredData(updatedLedgerData);
      } else {
        // old
        // const filteredItems = updatedLedgerData.filter(
        //   (item) =>
        //     item.txUserAction &&
        //     item.txUserAction.toLowerCase().includes(filterText.toLowerCase())
        // );
        // new
        const filteredItems = updatedLedgerData.filter(
          (item) =>
            (item.txUserAction &&
              item.txUserAction
                .toLowerCase()
                .includes(filterText.toLowerCase())) ||
            (item.txID &&
              item.txID.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.txData &&
              item.txData.toLowerCase().includes(filterText.toLowerCase()))
        );

        // const noOfPages = Math.ceil(filteredItems?.length / itemsPerPage);
        // setTotalPages(noOfPages);
        // const paginatedItems = paginateData(
        //   filteredItems,
        //   currentPage,
        //   itemsPerPage
        // );
        // if (paginatedItems) {
        //   setFilteredData(paginatedItems);
        // }
        setFilteredData(filteredItems);
      }
    }
  }, [currentPage, filterText, updatedLedgerData, ledgerData]);

  const handleChange = (event, page) => {
    setCurrentPage(page * 1);
  };

  const handleDropdown = () => {
    setSelectedOption(!selectedOption);
  };

  const handleOptionClick = (option) => {
    setSelectedVal(option);
    setSelectedOption(false);
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="flex justify-between w-full">
        <div className="flex gap-[63px]">
          {/* profile */}
          <div className="flex gap-[13px]">
            <img
              src="/assets/svgs/dashboard/person.svg"
              alt="person icon"
              className="h-[44.2px] w-[44.2px]"
            />
            <div>
              <h1 className="text-[#ACACAC] text-[20.7px] font-semibold leading-normal -tracking-[0.207px]">
                My Profile
              </h1>
              <div className="text-[#616161] text-[13.824px] font-normal leading-normal flex gap-1">
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
              <h1 className="text-[#ACACAC] text-[20.7px] font-semibold leading-normal -tracking-[0.207px]">
                Treasury
              </h1>
              <div className="text-[#616161] text-[13.824px] font-normal leading-normal flex gap-1">
                <p>Balance</p>
                <p>1,357,432.20</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-[23.5px] items-center">
          {/* search */}
          <div className="relative flex h-[43px]">
            <img
              src="/assets/svgs/dashboard/search2.svg"
              alt="search icon"
              className="w-[27px] h-[27px] absolute left-[9.22px] top-1/2 transform -translate-y-[50%]"
            />
            <input
              type="text"
              onChange={(e) => setFilterText(e.target.value)}
              value={filterText}
              placeholder="Search"
              className="w-[248px] py-[8.07px] pl-[46px] bg-white rounded-[11.526px] border-[1.153px] border-[#C1C1C1] text-[#B5B7C0] text-[20px] font-normal leading-normal -tracking-[0.2px]"
            />
          </div>
          {/* sort */}
          <div className="relative h-[43.3px] w-[186px] border-[1.153px] border-[#C1C1C1] bg-white rounded-[11.526px]">
            <button
              onClick={handleDropdown}
              className="flex items-center gap-1 w-full h-full pl-[17px]"
            >
              <h1 className="text-[#7E7E7E] text-[20.021px] font-normal leading-noremal -tracking-[0.2px]">
                Sort by :
              </h1>
              <h1 className="text-[#3D3C42] text-[20.021px] font-semibold leading-noremal -tracking-[0.2px] capitalize">
                {selectedVal}
              </h1>
            </button>
            <div
              className={`${
                selectedOption ? 'flex duration-200 ease-in-out' : 'hidden'
              } bg-gray text-black px-1 py-2 flex-col gap-2 absolute w-32 text-left rounded-md mt-2 z-50`}
            >
              <p
                className="hover:bg-white duration-200 ease-in-out cursor-pointer rounded-md px-2"
                onClick={() => handleOptionClick('newest')}
              >
                Newest
              </p>
              <p
                className="hover:bg-white duration-200 ease-in-out cursor-pointer rounded-md px-2"
                onClick={() => handleOptionClick('oldest')}
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
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-14 ml-[156px]">
        Ledger
      </h1>
      <div className="mx-[106px] rounded-[45px] shadow-inside pt-[31px] pb-6 pl-5 pr-[43.25px] flex flex-col gap-[23px] my-[54px]">
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={tableCustomStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
        <div className="flex justify-between">
          {currentPage === 1 ? (
            <h1>
              Showing data 1 to {ledgerData?.data.data.length} of{' '}
              {ledgerData?.data.totalCount} entries
            </h1>
          ) : (
            <h1>
              Showing data {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(
                currentPage * itemsPerPage,
                ledgerData?.data.totalCount
              )}{' '}
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
