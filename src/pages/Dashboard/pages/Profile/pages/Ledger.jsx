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
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedLedgerData, setUpdateLedgerData] = useState();

  const { data: ledgerData } = useQuery({
    queryFn: () => getAllLedgerData(),
    queryKey: ['LedgerData'],
  });

  useEffect(() => {
    const newLedgerData = ledgerData?.data.data.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    const noOfPages = Math.ceil(ledgerData?.data.data.length / itemsPerPage);
    setTotalPages(noOfPages);

    if (selectedVal === 'newest') {
      newLedgerData?.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    } else {
      newLedgerData?.sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );
    }

    setUpdateLedgerData(newLedgerData);
  }, [ledgerData, selectedVal]);

  function paginateData(data, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  useEffect(() => {


    if (updatedLedgerData) {
      if (filterText === "") {
        const noOfPages = Math.ceil(updatedLedgerData?.length / itemsPerPage);
        setTotalPages(noOfPages);
        const paginatedItems = paginateData(
          updatedLedgerData,
          currentPage,
          itemsPerPage
        );

        if (paginatedItems) {


          setFilteredData(paginatedItems);
        }

      }
      else {
        const filteredItems = updatedLedgerData.filter(
          (item) =>
            item.txUserAction &&
            item.txUserAction.toLowerCase().includes(filterText.toLowerCase())
        );
        const noOfPages = Math.ceil(filteredItems?.length / itemsPerPage);
        setTotalPages(noOfPages);
        const paginatedItems = paginateData(
          filteredItems,
          currentPage,
          itemsPerPage
        );
        if (paginatedItems) {
          setFilteredData(paginatedItems)
        }

      }

    }
  }, [currentPage, filterText, updatedLedgerData]);

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
          <div className="relative flex h-fit">
            <img
              src="/assets/svgs/dashboard/search2.svg"
              alt="search icon"
              className="w-[19px] h-[19px] absolute left-[6.4px] top-1/2 transform -translate-y-[50%]"
            />
            <input
              type="text"
              onChange={(e) => setFilterText(e.target.value)}
              value={filterText}
              placeholder="Search"
              className="py-[5.57px] pl-[31.83px] bg-[#f9fbff] w-[171px] rounded-[8px] text-[#b5b7c0] text-[13.82px] font-normal leading-normal -tracking-[0.138px]"
            />
          </div>
          {/* sort */}
          <div className="relative">
            <button onClick={handleDropdown} className="flex gap-1">
              <h1 className="text-[#7E7E7E] text-[13.82px] font-normal leading-noremal -tracking-[0.138px]">
                Sort by :
              </h1>
              <h1 className="text-[#3D3C42] text-[13.82px] font-semibold leading-noremal -tracking-[0.138px]">
                {selectedVal}
              </h1>
            </button>
            <div
              className={`${selectedOption ? 'flex duration-200 ease-in-out' : 'hidden'
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
      <div className="mx-[106px] rounded-[45px] shadow-inside pt-[53px] pb-[56.6px] px-[70px] flex flex-col gap-[23px] my-[54px]">
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={tableCustomStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
        <div className="flex justify-between">
          {filteredData && (
            <h1 className="text-[#B5B7C0] text-[11.14px] font-medium leading-normal -tracking-[0.111px]">
              Showing data {filteredData[0]?.id} to{' '}
              {filteredData[filteredData.length - 1]?.id} of{' '}
              {ledgerData?.data.data.length} entries
            </h1>
          )}
          <Pagination
            count={totalPages}
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
