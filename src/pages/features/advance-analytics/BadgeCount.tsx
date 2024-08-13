import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useAnalyzePostMutation } from '../../../services/mutations/advance-analytics';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { AddBadgeProps } from '../../../types/advanceAnalytics';
import { comparisonOperators } from '../../../constants/advanceAnalytics';

export default function BadgeCount({ handleClose, questStartData }: AddBadgeProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState<number | null>(null);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzePostMutation({ handleClose });

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleBadgeNumber = (e: any) => {
    const value = e.target.value === '' ? null : Number(e.target.value);
    if (value === null || (value >= 0 && value <= 20)) {
      setBadgeNumber(value);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="my-2 text-center text-[10px] font-normal leading-[12px] text-accent-400 dark:text-gray-300 tablet:my-4 tablet:text-[16px] tablet:leading-[16px]">
        You can check results by counts
      </h1>
      <div className="flex items-center justify-center gap-[15px]">
        <div className="relative inline-block w-full max-w-[120px] tablet:max-w-[230px]">
          <button
            onClick={toggleDropdown}
            className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
          >
            {selectedOptions ? selectedOptions : 'Select an option'}
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
              alt="arrow-right.svg"
              className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
          {isOpen && (
            <ul className="absolute z-10 mt-2 max-h-32 w-fit min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
              {comparisonOperators.map((operator) => (
                <li
                  key={operator.id}
                  className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                  onClick={() => {
                    setSelectedOptions(operator.name);
                    toggleDropdown();
                  }}
                >
                  {operator.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="number"
          value={badgeNumber ?? ''}
          placeholder={`0 - 19`}
          className="flex w-full max-w-14 items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:max-w-[143px] tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
          onChange={handleBadgeNumber}
        />
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          variant={'submit'}
          className=""
          rounded={false}
          onClick={() => {
            handleAnalyzePost({
              userUuid: persistedUserInfo.uuid,
              questForeignKey: questStartData._id,
              hiddenOptionsArray: selectedOptions,
              actionType: 'addBadge',
            } as any);
          }}
        >
          {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
        </Button>
      </div>
    </div>
  );
}
