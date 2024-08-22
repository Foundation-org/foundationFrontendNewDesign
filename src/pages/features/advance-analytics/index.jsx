import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../../components/ui/Button';
import AnalyzeDialogueBox from '../../../components/dialogue-boxes/AnalyzeDialogueBox';
import HideOption from './HideOption';
import BadgeCountOption from './BadgeCountOption';

export default function AdvanceAnalytics({ questStartData }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const plusImg = `${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/plus.svg' : 'assets/svgs/dashboard/add.svg'}`;
  const [analyzePopup, setAnalyzePopup] = useState(false);

  const handleAnalyzeClose = () => setAnalyzePopup(false);

  return (
    <div className="mt-2 rounded-[12.3px] border-2 border-white-500 bg-white p-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:mt-[15px] tablet:rounded-[15px] tablet:py-[25px]">
      <h1 className="text-center text-[0.75rem] font-semibold leading-[15px] text-accent-600 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[1.25rem]">
        Advanced Analytics
      </h1>
      {questStartData?.hiddenAnswers && questStartData?.hiddenAnswers.length >= 1 && (
        <HideOption questStartData={questStartData} />
      )}
      {questStartData?.oprend >= 1 && questStartData?.range && <BadgeCountOption questStartData={questStartData} />}
      <div className="mt-[10px] space-y-[10px] tablet:mx-[36px] tablet:mt-[15px] tablet:space-y-[15px]">
        <Button
          variant={'addOption'}
          onClick={() => {
            setAnalyzePopup(true);
          }}
        >
          <img src={plusImg} alt="add" className="size-[7.398px] tablet:size-[15.6px]" />
          Add Function
        </Button>
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
    </div>
  );
}
