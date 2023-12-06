import React, { useState } from "react";

const Dropdown = ({ label, title, items, handleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <p className="tablet:ml-[17px] tablet:pb-[9px] tablet:text-[18px] ml-[5.96px] text-[6.267px] font-[500] leading-normal">
        {label}
      </p>
      <div className="dropdown 5xl:w-full">
        <label
          tabIndex={0}
          className="tablet:h-[36.5px] tablet:pb-[9px] tablet:pl-[1.063rem] tablet:pr-5 tablet:pt-[11px] tablet:text-[15px] tablet:min-w-[150px] flex h-[18px] w-full min-w-[73.8px] max-w-[13.25rem] cursor-pointer items-center justify-between rounded-[18px] bg-[#F6F6F6] pb-1 pl-[5.9px] pr-[8.2px] pt-[5px] text-[7.66px] font-[400] leading-normal text-[#787878] dark:border-[1px] dark:border-[#989898] dark:bg-[#000] dark:text-[#E6E6E6] xl:h-[47px] xl:min-w-[212px] 5xl:max-w-full"
          onClick={toggleDropdown}
        >
          {title}
          <img
            src="/assets/svgs/dashboard/down-arrow.svg"
            alt="down-arrow"
            className={`tablet:h-[6px] tablet:w-[14px] h-[2px] w-[4.71px] ${
              isOpen
                ? "rotate-180 transform transition-all duration-300"
                : "transition-all duration-300"
            }`}
          />
        </label>

        {isOpen && (
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box z-[1] w-52 bg-[#ACACAC] p-0 text-white shadow"
          >
            {items.map((item, index) => (
              <li
                key={index + 1}
                onClick={() => {
                  handleSelect(item);
                  setIsOpen(!open);
                }}
                className="text-white hover:bg-[#0A0A0C]  "
              >
                <a>{item}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
