import { useState } from 'react';
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

export default function Activity({ handleClose, questStartData, update, selectedItem }: HideOptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [currentSelection, setCurrentSelection] = useState('');
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
          <input
            type="text"
            // value={badgeNumber ?? ''}
            placeholder={`Enter city name here`}
            className="flex w-full items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
            // onChange={handleBadgeNumber}
          />
        );
      case 'Home Town':
        return (
          <input
            type="text"
            // value={badgeNumber ?? ''}
            placeholder={`Enter home town name here`}
            className="flex w-full items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
            // onChange={handleBadgeNumber}
          />
        );
      case 'Sex':
        return <ActivitySex />;
      case 'Relationship':
        return <ActivityRelationShip />;
      case 'Work':
        return <ActivityWork />;
      case 'Education':
        return <ActivityEducation />;
      case 'Cell Phone':
        return (
          <input
            type="text"
            // value={badgeNumber ?? ''}
            placeholder={`Enter city name here`}
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
          Select an option
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
