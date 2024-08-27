import { useState } from 'react';
import CustomCombobox from '../../../../components/ui/Combobox';

export default function ActivityWork({ query, setQuery, selected, setSelected, data, workType, setWorkType }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [field, setField] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block w-full space-y-3">
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px] dark:border-gray-100 dark:text-gray-300"
      >
        {workType === '' ? 'Select Field' : workType}
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] tablet:max-h-48 tablet:border-[2px] tablet:text-[20px] dark:border-gray-100 dark:bg-gray-200">
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white tablet:px-4 tablet:py-2 dark:text-gray-300"
            onClick={() => {
              toggleDropdown();
              setWorkType('Company');
            }}
          >
            Company
          </li>
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white tablet:px-4 tablet:py-2 dark:text-gray-300"
            onClick={() => {
              toggleDropdown();
              setWorkType('Job Title');
            }}
          >
            Job Title
          </li>
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white tablet:px-4 tablet:py-2 dark:text-gray-300"
            onClick={() => {
              toggleDropdown();
              setWorkType('Mode of Job');
            }}
          >
            Mode of Job
          </li>
        </ul>
      )}
      {workType !== '' && (
        <CustomCombobox
          items={data}
          selected={selected}
          setSelected={setSelected}
          placeholder={`Enter ${workType} here`}
          query={query}
          setQuery={setQuery}
          type={'city'}
        />
      )}
    </div>
  );
}
