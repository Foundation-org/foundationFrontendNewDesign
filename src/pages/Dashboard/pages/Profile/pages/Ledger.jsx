import { Menu } from '@headlessui/react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';

const Ledger = () => {
  const [filterText, setFilterText] = useState('');
  const [selectedOption, setSelectedOption] = useState(false);

  const columns = [
    {
      name: 'txUserAction',
      selector: (row) => row.txUserAction,
    },
    {
      name: 'txID',
      selector: (row) => row.txID,
    },
    {
      name: 'txAuth',
      selector: (row) => row.txAuth,
    },
    {
      name: 'txFrom',
      selector: (row) => row.txFrom,
    },
    {
      name: 'txTo',
      selector: (row) => row.txTo,
    },
    {
      name: 'txAmount',
      selector: (row) => row.txAmount,
    },
    {
      name: 'txFrom',
      selector: (row) => row.txFrom1,
    },
    {
      name: 'txTo',
      selector: (row) => row.txTo1,
    },
    {
      name: 'txAmount',
      selector: (row) => row.txAmount1,
    },
  ];

  const data = [
    {
      id: 1,
      txUserAction: 'Jane Cooper',
      txID: 'Microsoft',
      txAuth: '(225) 555-0118',
      txFrom: 'jane@microsoft.com',
      txTo: 'United Statest',
      txAmount: 'Microsoft',
      txFrom1: '(225) 555-0118',
      txTo1: 'jane@microsoft.com',
      txAmount1: 'United States',
    },
    {
      id: 2,
      txUserAction: 'Maxvell',
      txID: 'Microsoft',
      txAuth: '(225) 555-0118',
      txFrom: 'jane@microsoft.com',
      txTo: 'United Statest',
      txAmount: 'Microsoft',
      txFrom1: '(225) 555-0118',
      txTo1: 'jane@microsoft.com',
      txAmount1: 'United States',
    },
  ];

  const tableCustomStyles = {
    headRow: {
      style: {
        color: '#B5B7C0',
        fontSize: '16.128px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        letterSpacing: '-0.161px',
        border: '1px solid #EEE',
      },
    },
    rows: {
      style: {
        color: '#292D32',
        fontSize: '13.824px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        letterSpacing: '-0.138px',
      },
    },
  };

  const filteredItems = data.filter(
    (item) =>
      item.txUserAction &&
      item.txUserAction.toLowerCase().includes(filterText.toLowerCase())
  );

  const items = [
    { label: 'Account' },
    { label: 'Support' },
    { label: 'License' },
    { label: 'Sign out' },
  ];

  console.log(selectedOption);

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
          <div
            className="flex gap-1"
            onClick={() => {
              setSelectedOption(!selectedOption);
            }}
          >
            <h1 className="text-[#7E7E7E] text-[13.82px] font-normal leading-noremal -tracking-[0.138px]">
              Sort by :
            </h1>
            <h1 className="text-[#3D3C42] text-[13.82px] font-semibold leading-noremal -tracking-[0.138px]">
              Newest
            </h1>
          </div>
          {/* <div
            className={`${
              selectedOption ? 'flex' : 'hidden'
            } bg-black text-white p-4 flex-col gap-2`}
          >
            <p>dasdasd</p>
            <p>dasdasd</p>
            <p>dasdasd</p>
            <p>dasdasd</p>
          </div> */}
        </div>
      </div>
    );
  }, [filterText]);

  return (
    <div>
      <h1 className="text-[#4A8DBD] text-[32px] font-semibold leading-normal mt-14 ml-[156px]">
        Ledger
      </h1>
      <div className="mx-[106px] rounded-[45px] shadow-inside pt-[53px] pb-[56.6px] px-[60px] flex flex-col gap-[23px] my-[54px]">
        <DataTable
          columns={columns}
          data={filteredItems}
          customStyles={tableCustomStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
        <div className="flex justify-between">
          <h1 className="text-[#B5B7C0] text-[11.14px] font-medium leading-normal -tracking-[0.111px]">
            Showing data 1 to 8 of 256K entries
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
