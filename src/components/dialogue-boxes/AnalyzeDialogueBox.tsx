import PopUp from '../ui/PopUp';
import { useState } from 'react';
import { analyzeButtons } from '../../constants/advanceAnalytics';
import { AnalyzeModalProps } from '../../types/advanceAnalytics';
import BadgeCount from '../../pages/features/advance-analytics/BadgeCount';
import Target from '../../pages/features/advance-analytics/Target';
import HideOption from '../../pages/features/advance-analytics/HideOption';
import Activity from '../../pages/features/advance-analytics/Activity';

export default function AnalyzeDialogueBox({
  handleClose,
  modalVisible,
  title,
  image,
  questStartData,
  update,
  selectedItem,
}: AnalyzeModalProps) {
  const [selectedBtn, setSelectedBtn] = useState('Hide Option');

  const renderSelectedComponent = () => {
    switch (selectedBtn) {
      case 'Hide Option':
        return (
          <HideOption
            handleClose={handleClose}
            questStartData={questStartData}
            update={update}
            selectedItem={selectedItem}
          />
        );
      case 'Badge Count':
        return <BadgeCount handleClose={handleClose} questStartData={questStartData} />;
      // case 'Target':
      //   return <Target handleClose={handleClose} questStartData={questStartData} />;
      // case 'Activity':
      //   return (
      //     <Activity
      //       handleClose={handleClose}
      //       questStartData={questStartData}
      //       update={update}
      //       selectedItem={selectedItem}
      //     />
      //   );
      default:
        return (
          <h1 className="my-4 text-center text-[10px] font-semibold leading-[12px] text-accent-400 dark:text-gray-300 tablet:my-14 tablet:text-[22px] tablet:leading-[22px]">
            Coming Soon!
          </h1>
        );
    }
  };

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      customStyle=""
      customClasses=""
      closeIcon=""
      isBackground=""
      remove=""
      autoSize=""
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <div className="flex items-center justify-center gap-[15px]">
          {analyzeButtons.map((item) => (
            <button
              key={item.id}
              className={`slider-link min-w-[60px] tablet:min-w-[120px] ${selectedBtn === item.title ? 'slider-link-active' : 'slider-inactive'}`}
              onClick={() => setSelectedBtn(item.title)}
            >
              {item.title}
            </button>
          ))}
        </div>
        {renderSelectedComponent()}
      </div>
    </PopUp>
  );
}
