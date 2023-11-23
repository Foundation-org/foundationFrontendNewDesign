import React, { useState } from 'react';

const Dropdown = ({ label, title, items, handleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <p className="text-[18px] font-[500] leading-normal pb-[9px] ml-[17px]">
        {label}
      </p>
      <div className="dropdown 5xl:w-full">
        <label
          tabIndex={0}
          className="min-w-[212px] flex items-center justify-between pr-5 pl-[1.063rem] pt-[11px] pb-[9px] w-full max-w-[13.25rem] 5xl:max-w-full bg-[#F6F6F6] dark:bg-[#000] rounded-[18px] dark:border-[1px] dark:border-[#989898] text-[15px] font-[400] leading-normal text-[#787878] dark:text-[#E6E6E6] cursor-pointer h-[47px]"
          onClick={toggleDropdown}
        >
          {title}
          <img
            src="/assets/svgs/dashboard/down-arrow.svg"
            alt="down-arrow"
            className={`w-[14px] h-[6px] ${
              isOpen
                ? 'transform rotate-180 transition-all duration-300'
                : 'transition-all duration-300'
            }`}
          />
        </label>

        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu shadow text-white bg-[#ACACAC] rounded-box w-52 p-0"
          >
            {items.map((item, index) => (
              <li
                key={index + 1}
                onClick={() => {
                  handleSelect(item);
                  setIsOpen(!open);
                }}
                className="hover:bg-[#0A0A0C] text-white  "
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
