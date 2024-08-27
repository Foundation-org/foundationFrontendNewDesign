import { BsCalendar2Date } from 'react-icons/bs';

export const DateInput = () => {
  return (
    <div className="relative w-full">
      <input type="date" className="verification_badge_input" />
      <BsCalendar2Date className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
    </div>
  );
};
