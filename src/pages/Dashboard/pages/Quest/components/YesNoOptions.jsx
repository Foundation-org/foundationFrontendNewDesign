const YesNoOptions = ({ answer }) => {
  return (
    <div className="ml-[30px] mr-[50px] flex flex-row items-center gap-[25px] tablet:ml-[50px] tablet:mr-[103px]">
      <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
        <div className="flex w-full items-center">
          <div className="flex h-full w-[12.28px] min-w-[12.28px] items-center justify-center rounded-l-[5.387px] border-y border-s border-[#DEE6F7] bg-[#DEE6F7] px-[0px] py-[6px] tablet:w-[23.5px] tablet:rounded-l-[10px] tablet:border-y-[3px] tablet:border-s-[3px] tablet:pb-[13px] tablet:pt-[14px] laptop:w-[25.2px] laptop:min-w-[25.2px] dark:bg-[#9E9E9E]"></div>
          <div className="flex h-[27px] w-full items-center justify-between rounded-r-[4.89px] border-y border-r border-[#DEE6F7] pb-[1px] tablet:h-[51px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] dark:border-[#0D1012]">
            <h1 className="w-full pl-5 text-[0.625rem] font-normal leading-normal text-[#7C7C7C] tablet:pl-5 tablet:text-[20.7px] laptop:text-[18px] dark:text-[#D3D3D3]">
              {answer}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YesNoOptions;
