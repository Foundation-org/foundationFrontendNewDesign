import React from 'react';

const AddNewOption = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-[22px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF]">
        Add Your Own Option
      </h1>
      <div className="bg-white rounded-[10px] min-w-[30rem] w-full border-[1px] border-gray">
        <div className="flex items-center">
          <div className="rounded-l-[10px] h-full w-fit bg-[#DEE6F7]  px-[7px] pt-[14px] pb-[13px]">
            <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
          </div>
          <input
            type="text"
            className="ml-8 text-[#435059] text-[19px] font-normal leading-normal focus:outline-none"
          />
        </div>
      </div>
      <button
        className={` ${
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'bg-[#494C52]'
            : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
        } shadow-inner inset-0  rounded-[10px] py-2 px-5 text-[#EAEAEA] text-[20px] font-semibold leading-normal w-full`}
      >
        Submit
      </button>
    </div>
  );
};

export default AddNewOption;
