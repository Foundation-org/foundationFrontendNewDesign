import { useState } from 'react';
import { useSelector } from 'react-redux';
import { comparisonOperators } from '../../../constants/advanceAnalytics';
import AnalyzeDialogueBox from '../../../components/dialogue-boxes/AnalyzeDialogueBox';
import DeleteAnalyzeHiddenOption from '../../../components/dialogue-boxes/DeleteAnalyzeHiddenOption';

export default function BadgeCountOption({ item, questStartData }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [analyzePopup, setAnalyzePopup] = useState(false);
  const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false);

  const handleAnalyzeClose = () => setAnalyzePopup(false);
  const handleDeleteConfirmClose = () => setDeleteConfirmPopup(false);

  const findOperatorName = (id) => {
    return comparisonOperators.find((operator) => operator.id === id)?.name || 'Unknown Operator';
  };

  return (
    <div className="mt-[10px] space-y-[10px] tablet:mx-[36px] tablet:mt-[15px] tablet:space-y-[15px]">
      <div className="flex items-center gap-[6.24px] rounded-[6.683px] border-[1.248px] border-white-500 p-[6.24px] text-accent-600 dark:border-gray-100 dark:text-gray-300 tablet:gap-[15px] tablet:rounded-[16.068px] tablet:border-[3px] tablet:px-4 tablet:py-3">
        <div className="w-fit min-w-[76px] max-w-[76px] rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:min-w-[150px] tablet:max-w-[150px] tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-4 tablet:py-3">
          <h1 className="whitespace-nowrap text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
            Badge Count
          </h1>
        </div>
        <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-4 tablet:py-3">
          <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
            {findOperatorName(item.oprend)}
          </h1>
        </div>
        <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-4 tablet:py-3">
          <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
            {item.range}
          </h1>
        </div>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/edit.svg' : 'assets/svgs/edit.svg'}`}
          alt="trash"
          className="size-[12.47px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
          onClick={() => setAnalyzePopup(true)}
        />
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
          alt="trash"
          className="h-[12.47px] w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
          onClick={() => {
            setDeleteConfirmPopup(true);
          }}
        />
      </div>

      {analyzePopup && (
        <AnalyzeDialogueBox
          handleClose={handleAnalyzeClose}
          modalVisible={analyzePopup}
          title={'Analyze'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
        />
      )}
      {deleteConfirmPopup && (
        <DeleteAnalyzeHiddenOption
          handleClose={handleDeleteConfirmClose}
          modalVisible={deleteConfirmPopup}
          title={'Delete Option'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          questStartData={questStartData}
          type={'badgeCount'}
        />
      )}
    </div>
  );
}
