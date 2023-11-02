import React from 'react';

const Dropdown = ({ label, title, items }) => {
  return (
    <div>
      <p className="text-[18px] font-[500] leading-normal pb-[9px] ml-[17px]">
        {label}
      </p>
      <div className="dropdown">
        <label
          tabIndex={0}
          className="flex items-center gap-[5.43rem] pr-5 pl-[1.063rem] pt-[11px] pb-[9px] w-full max-w-[13.25rem] bg-[#F6F6F6] dark:bg-[#0F1014] rounded-[18px] dark:border-[1px] dark:border-[#989898] text-[22px] font-[400] leading-normal text-[#787878] dark:text-[#E6E6E6] cursor-pointer h-[47px]"
        >
          {title}
          <img
            src="/assets/svgs/dashboard/down-arrow.svg"
            alt="down-arrow"
            className="w-[14px] h-[6px]"
          />
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {items.map((item, index) => (
            <li key={index}>
              <a>{item}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
