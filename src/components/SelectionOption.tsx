export default function SelectionOption({ data, handleSelection }: any) {
  return (
    <li
      className="flex w-full cursor-pointer justify-between rounded-[5.387px] border border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[10px] tablet:border-[3px]"
      onClick={() => handleSelection(data)}
    >
      <div className="flex h-[21.8px] w-3 min-w-[12px] items-center justify-center rounded-l-[4px] bg-white-500 dark:bg-gray-100 tablet:h-[43px] tablet:w-5 tablet:min-w-5">
        &#x200B;
      </div>
      <div className="flex w-full items-center">
        <h1 className="pb-[5.7px] pl-2 pt-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] dark:text-[#D3D3D3] tablet:py-3 tablet:pl-[18px] tablet:text-[19px]">
          {data?.option}
        </h1>
      </div>
      <div className="flex items-center gap-[10.3px] pr-[10px] text-[9.2px] tablet:gap-[22px] tablet:text-[16px]">
        <div className="flex items-center gap-1 laptop:gap-[18px]">
          <div id="custom-checkbox" className="flex h-full items-center">
            <input
              id="small-checkbox"
              type="checkbox"
              className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
              checked={data.selected}
              readOnly
            />
          </div>
        </div>
      </div>
    </li>
  );
}
