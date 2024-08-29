import { useEffect, useState } from 'react';
import { ActivityProps } from '../../../../types/advanceAnalytics';
import CustomCombobox from '../../../../components/ui/Combobox';
import api from '../../../../services/api/Axios';

export default function ActivityEducation({ state, dispatch }: ActivityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [eduType, setEduType] = useState('');
  const [eduData, setEduData]: any[] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const searchUniversities = async () => {
    try {
      const universities = await api.post(`search/searchUniversities/?name=${query}`);
      setEduData(universities.data);
    } catch (err) {
      setEduData([]);
    }
  };

  const searchDegreesAndFields = async () => {
    try {
      const degreesAndFields = await api.post(
        `search/searchDegreesAndFields/?name=${query}&type=${eduType === 'Degree Program' ? 'degreeProgram' : 'fieldOfStudy'}`,
      );
      setEduData(degreesAndFields.data);
    } catch (err) {
      setEduData([]);
    }
  };

  useEffect(() => {
    if (eduType === 'School') searchUniversities();
    if (eduType === 'Degree Program' || eduType === 'Field of Study') searchDegreesAndFields();
  }, [eduType, query]);

  useEffect(() => {
    if (selected) {
      dispatch({ type: 'SET_EDUCATION_FIELD_VALUE', payload: selected });
    }
    if (eduType) {
      dispatch({ type: 'SET_EDUCATION_FIELD_NAME', payload: eduType });
    }
  }, [selected, eduType]);

  return (
    <div className="relative inline-block w-full space-y-3">
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
      >
        {eduType === '' ? 'Select Field' : eduType}
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
              setEduType('School');
            }}
          >
            School
          </li>
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
            onClick={() => {
              toggleDropdown();
              setEduType('Degree Program');
            }}
          >
            Degree Program
          </li>
          <li
            className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
            onClick={() => {
              toggleDropdown();
              setEduType('Field of Study');
            }}
          >
            Field of Study
          </li>
        </ul>
      )}

      {eduType !== '' && (
        <CustomCombobox
          items={eduData}
          selected={selected}
          setSelected={setSelected}
          placeholder={`Enter ${eduType} here`}
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
