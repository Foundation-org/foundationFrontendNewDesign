import { useSelector } from 'react-redux';
import AnalyzeDialogueBox from '../../../components/dialogue-boxes/AnalyzeDialogueBox';
import { useState } from 'react';
import DeleteAnalyzeHiddenOption from '../../../components/dialogue-boxes/DeleteAnalyzeHiddenOption';

export default function HideOption({ questStartData }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [analyzePopup, setAnalyzePopup] = useState(false);
  const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleAnalyzeClose = () => setAnalyzePopup(false);
  const handleDeleteConfirmClose = () => setDeleteConfirmPopup(false);

  const handleItemSelection = (item) => {
    return questStartData.hiddenAnswers.filter((answer) => answer !== item);
  };

  return (
    <div className="mt-[10px] space-y-[10px] tablet:mx-[36px] tablet:mt-[15px] tablet:space-y-[15px]">
      {questStartData.hiddenAnswers.map((item, index) => (
        <div
          key={index + 1}
          className="flex items-center gap-[6.24px] rounded-[6.683px] border-[1.248px] border-white-500 p-[6.24px] text-accent-600 tablet:gap-[15px] tablet:rounded-[16.068px] tablet:border-[3px] tablet:px-4 tablet:py-3 dark:border-gray-100 dark:text-gray-300"
        >
          <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-4 tablet:py-3 dark:border-gray-100">
            <h1 className="whitespace-nowrap text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
              Hide Option
            </h1>
          </div>
          <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-4 tablet:py-3 dark:border-gray-100">
            <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">{item}</h1>
          </div>
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/edit.svg' : 'assets/svgs/edit.svg'}`}
            alt="trash"
            className="size-[12.47px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
            onClick={() => {
              setAnalyzePopup(true);
              setSelectedItem(item);
            }}
          />
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
            alt="trash"
            className="h-[12.47px] w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
            onClick={() => {
              setDeleteConfirmPopup(true);
              setSelectedItem(item);
            }}
          />
        </div>
      ))}
      {analyzePopup && (
        <AnalyzeDialogueBox
          handleClose={handleAnalyzeClose}
          modalVisible={analyzePopup}
          title={'Analyze'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
          update={true}
          selectedItem={selectedItem}
        />
      )}
      {deleteConfirmPopup && (
        <DeleteAnalyzeHiddenOption
          handleClose={handleDeleteConfirmClose}
          modalVisible={deleteConfirmPopup}
          title={'Delete Option'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          questStartData={questStartData}
          type="hideOption"
          hiddenItem={handleItemSelection(selectedItem)}
        />
      )}
    </div>
  );
}
