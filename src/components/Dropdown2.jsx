import { useState } from "react";

const Dropdown2 = ({ label, title, items, handleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown 5xl:w-full">
      <div className="relative">
        <label
          tabIndex={0}
          className="flex h-[18px] w-full min-w-[73.8px] max-w-[13.25rem] cursor-pointer items-center justify-between rounded-[5px] border-2 border-[#707175] bg-[#F6F6F6] pb-1 pl-[5.9px] pr-[8.2px] pt-[5px] text-[7.66px] font-[400] leading-normal text-[#787878] dark:border-[1px] dark:border-[#989898] dark:bg-[#000] dark:text-[#E6E6E6] tablet:h-[36.5px] tablet:min-w-[150px] tablet:pb-[9px] tablet:pl-[1.063rem] tablet:pr-5 tablet:pt-[11px] tablet:text-[15px] laptop:h-[45px] laptop:min-w-[212px] laptop:rounded-[10px] 5xl:max-w-full"
          onClick={toggleDropdown}
        >
          {title}
          <img
            src="/assets/svgs/dashboard/down-arrow.svg"
            alt="down-arrow"
            className={`h-[2px] w-[4.71px] tablet:h-[6px] tablet:w-[14px] ${
              isOpen
                ? "rotate-180 transform transition-all duration-300"
                : "transition-all duration-300"
            }`}
          />
        </label>
        <p className="absolute -top-3 left-[14px] w-fit bg-[#F6F6F6] px-2 pl-1 text-[6.267px] font-normal leading-normal dark:bg-[#0A0A0C] tablet:text-[17px]">
          {label}
        </p>
      </div>

      {isOpen && (
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[100] w-fit min-w-[5rem] rounded-[10px] bg-[#F4F6F6] p-0 py-1 text-[0.5rem] leading-[2] text-white shadow shadow-md tablet:rounded-box dark:bg-dark-gray tablet:w-36 tablet:text-sm laptop:w-52"
        >
          {items.map((item, index) => (
            <li
              key={index + 1}
              onClick={() => {
                handleSelect(item);
                setIsOpen(!open);
              }}
              className="rounded-[10px] text-[#9D9D9D] hover:bg-[#ecf0f0] dark:text-white dark:hover:bg-[black]  "
            >
              <a className="px-2 py-0.5 tablet:px-4 tablet:py-2">{item}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown2;
