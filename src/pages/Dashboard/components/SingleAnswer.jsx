import React from 'react';

const SingleAnswer = ({ number, answer }) => {
  return (
    <div className="mx-[85px] flex items-center gap-[25px]">
      <h1 className="text-[#435059] text-[20px] font-[500] leading-normal">
        {number}
      </h1>
      <div className="bg-white rounded-[10px] w-full flex justify-between">
        <div className="flex items-center">
          <div className="rounded-l-[10px] h-full w-fit bg-[#DEE6F7] px-[7px] pt-[14px] pb-[13px]">
            <img src="/assets/svgs/dashboard/six-dots.svg" alt="six dots" />
          </div>
          <h1 className="ml-8 text-[#435059] text-[19px] font-normal leading-normal">
            {answer}
          </h1>
        </div>
        <div className="flex items-center gap-[37px] mr-[20.63px]">
          <img
            src="/assets/svgs/dashboard/edit.svg"
            alt="edit"
            className="w-[16px] h-[19.942px]"
          />
          <img
            src="/assets/svgs/dashboard/trash.svg"
            alt="trash"
            className="w-[16px] h-[19.942px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleAnswer;
