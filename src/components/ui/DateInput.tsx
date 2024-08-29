import { BsCalendar2Date } from 'react-icons/bs';
import React from 'react';

export const DateInput = ({
  setVal,
  value,
  id,
}: {
  setVal: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  id: string;
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setVal(dateValue);
  };

  return (
    <div className="relative w-full">
      <input type="date" className="verification_badge_input" onChange={handleDateChange} value={value} id={id} />
      <BsCalendar2Date className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
    </div>
  );
};
