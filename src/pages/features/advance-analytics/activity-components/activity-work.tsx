import { useEffect, useState } from 'react';
import { ActivityProps } from '../../../../types/advanceAnalytics';
import CustomCombobox from '../../../../components/ui/Combobox';
import api from '../../../../services/api/Axios';

export default function ActivityWork({ state, dispatch }: ActivityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [workData, setWorkData]: any[] = useState([]);
  const [workType, setWorkType] = useState('');
  const [selected, setSelected] = useState();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const searchJobTitles = async () => {
    try {
      const jobs = await api.post(`search/searchJobTitles/?name=${query}`);
      setWorkData(jobs.data);
    } catch (err) {
      setWorkData([]);
    }
  };

  const searchCompanies = async () => {
    try {
      const companies = await api.post(`search/searchCompanies/?name=${query}`);
      setWorkData(companies.data);
    } catch (err) {
      setWorkData([]);
    }
  };

  useEffect(() => {
    if (workType === 'Job Title') searchJobTitles();

    if (workType === 'Company') searchCompanies();

    if (workType === 'Mode of Job')
      setWorkData([
        { id: 1, name: 'Remote' },
        { id: 2, name: 'Hybrid' },
        { id: 3, name: 'Onsite' },
      ]);
  }, [query]);

  useEffect(() => {
    if (selected) {
      dispatch({ type: 'SET_WORK_FIELD_VALUE', payload: selected });
    }
    if (workType) {
      dispatch({ type: 'SET_WORK_FIELD_NAME', payload: workType });
    }
  }, [selected, workType]);

  return (
    <div className="relative inline-block w-full space-y-3">
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
      >
        {workType === '' ? 'Select Field' : workType}
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
            onClick={() => {
              toggleDropdown();
              setWorkType('Company');
            }}
          >
            Company
          </li>
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
            onClick={() => {
              toggleDropdown();
              setWorkType('Job Title');
            }}
          >
            Job Title
          </li>
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
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
          items={workData}
          selected={selected}
          setSelected={setSelected}
          placeholder={`Enter ${workType} here`}
          query={query}
          setQuery={setQuery}
          type={'city'}
          disabled={null}
          handleTab={null}
          id={null}
          isArrow={null}
          verification={null}
          verify={null}
          wordsCheck={null}
          key={null}
        />
      )}
    </div>
  );
}
