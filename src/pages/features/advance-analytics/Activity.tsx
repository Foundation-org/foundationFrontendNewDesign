import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { ActivityType, AddBadgeProps, PostAnswer, HideOptionProps } from '../../../types/advanceAnalytics';
import { useAnalyzePostMutation } from '../../../services/mutations/advance-analytics';
import { activityList, dualOptionsMap } from '../../../constants/advanceAnalytics';
import showToast from '../../../components/ui/Toast';
import { DateInput } from '../../../components/ui/DateInput';
import ActivitySex from './activity-components/activity-sex';
import ActivityRelationShip from './activity-components/activity-relationship';
import ActivityWork from './activity-components/activity-work';
import ActivityEducation from './activity-components/activity-education';
import CustomCombobox from '../../../components/ui/Combobox';
import api from '../../../services/api/Axios';

export default function Activity({ handleClose, questStartData, update, selectedItem }: HideOptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [currentSelection, setCurrentSelection] = useState('');
  const [cities, setCities] = useState([]);

  const [workData, setworkData]: any[] = useState([]);
  const [workType, setWorkType] = useState('');

  const [eduData, setEduData]: any[] = useState([]);
  const [eduType, setEduType] = useState('');

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState();

  const searchCities = async () => {
    try {
      const cities = await api.post(`search/searchCities/?name=${query}`);
      setCities(cities.data);
    } catch (err) {
      setCities([]);
    }
  };

  const searchJobTitles = async () => {
    try {
      const jobs = await api.post(`search/searchJobTitles/?name=${query}`);
      setworkData(jobs.data);
    } catch (err) {
      setworkData([]);
    }
  };

  const searchCompanies = async () => {
    try {
      const companies = await api.post(`search/searchCompanies/?name=${query}`);
      setworkData(companies.data);
    } catch (err) {
      setworkData([]);
    }
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
    console.log(selectedBadge, query);

    if (selectedBadge === 'Current City' || selectedBadge === 'Home Town') {
      searchCities();
    }
    if (selectedBadge === 'Work' || selectedBadge === 'Education') {
      if (selectedBadge === 'Work') {
        if (workType === 'Company') searchCompanies();

        if (workType === 'Job Title') searchJobTitles();

        if (workType === 'Mode of Job')
          setworkData([
            { id: 1, name: 'Remote' },
            { id: 2, name: 'Hybrid' },
            { id: 3, name: 'Onsite' },
          ]);
      }
      if (selectedBadge === 'Education') {
        console.log(eduType);

        if (eduType === 'School') searchUniversities();
        if (eduType === 'Degree Program' || eduType === 'Field of Study') searchDegreesAndFields();
      }
    }
  }, [query]);

  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzePostMutation({ handleClose });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const showSelectedBadge = (data: string) => {
    switch (data) {
      case 'Twitter':
        return (
          <input
            type="number"
            // value={badgeNumber ?? ''}
            placeholder={`Enter no of followers here`}
            className="flex w-full items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
            // onChange={handleBadgeNumber}
          />
        );
      case 'Date of Birth':
        return (
          <div className="flex items-center justify-between gap-4">
            <div className="w-full">
              <label htmlFor="dateInput-from" className="text-[20px]">
                From
              </label>
              <DateInput />
            </div>
            <div className="w-full">
              <label htmlFor="dateInput-from" className="text-[20px]">
                To
              </label>
              <DateInput />
            </div>
          </div>
        );
      case 'Current City':
        return (
          <CustomCombobox
            items={cities}
            selected={selected}
            setSelected={setSelected}
            placeholder={'Enter city here'}
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
          // <input
          //   type="text"
          //   // value={badgeNumber ?? ''}
          //   placeholder={`Enter city name here`}
          //   className="flex w-full items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
          //   // onChange={handleBadgeNumber}
          // />
        );
      case 'Home Town':
        return (
          <CustomCombobox
            items={cities}
            selected={selected}
            setSelected={setSelected}
            placeholder={'Enter hometown here'}
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
        );
      case 'Sex':
        return <ActivitySex />;
      case 'Relationship':
        return <ActivityRelationShip />;
      case 'Work':
        return (
          <ActivityWork
            query={query}
            setQuery={setQuery}
            selected={selected}
            setSelected={setSelected}
            data={workData}
            workType={workType}
            setWorkType={setWorkType}
          />
        );
      case 'Education':
        return (
          <ActivityEducation
            query={query}
            setQuery={setQuery}
            selected={selected}
            setSelected={setSelected}
            data={eduData}
            eduType={eduType}
            setEduType={setEduType}
          />
        );
      case 'Cell Phone':
        return (
          <input
            type="text"
            // value={badgeNumber ?? ''}
            placeholder={`Country here`}
            className="flex w-full items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
            // onChange={handleBadgeNumber}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="my-2 text-center text-[10px] font-normal leading-[12px] text-accent-400 dark:text-gray-300 tablet:my-4 tablet:text-[16px] tablet:leading-[16px]">
        You can Hide an option
      </h1>
      <div className="relative inline-block w-full space-y-3">
        <button
          onClick={toggleDropdown}
          className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
        >
          {/* {selectedOptions.length > 0
            ? update
              ? currentSelection
              : selectedOptions[selectedOptions.length - 1]
            : 'Select an option'} */}
          {selectedBadge === '' ? 'Select an option' : selectedBadge}
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
            alt="arrow-right.svg"
            className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
          />
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
            {activityList?.map((activity: ActivityType) => (
              <li
                key={activity.id}
                className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                onClick={() => {
                  if (update) {
                    const updatedOptions = (questStartData?.hiddenAnswers || []).map((item: string) =>
                      item === selectedItem ? activity.name : item,
                    );
                    setSelectedBadge(updatedOptions);
                    setCurrentSelection(activity.name);
                  } else {
                    if (questStartData?.QuestAnswers.length <= 2) {
                      showToast('warning', 'cantHideLastTwoOptions');
                    } else {
                      setSelectedBadge(activity.name);
                    }
                  }
                  toggleDropdown();
                }}
              >
                {activity.name}
              </li>
            ))}
          </ul>
        )}
        {showSelectedBadge(selectedBadge)}
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          variant="submit"
          // variant={
          //   update
          //     ? 'submit'
          //     : questStartData?.QuestAnswers.length <= 2 || selectedOptions.length <= 0
          //       ? 'submit-hollow'
          //       : 'submit'
          // }
          className=""
          // disabled={update ? false : questStartData?.QuestAnswers.length <= 2 || selectedOptions.length <= 0}
          rounded={false}
          onClick={() => {
            // handleAnalyzePost({
            //   userUuid: persistedUserInfo.uuid,
            //   questForeignKey: questStartData._id,
            //   hiddenOptionsArray: selectedOptions,
            //   actionType: 'create',
            // } as any);
          }}
        >
          {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Hide'}
        </Button>
      </div>
    </div>
  );
}
