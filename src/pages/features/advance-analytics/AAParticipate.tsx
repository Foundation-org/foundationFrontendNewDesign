import { useState } from 'react';
import FilterAnalyzedOptions from './components/FilterAnalyzedOptions';
import showToast from '../../../components/ui/Toast';

export default function AAParticipate({ questStartData }: { questStartData: any }) {
  const [showModal, setShowModal] = useState(false);

  const handleHideModal = () => setShowModal(false);

  return (
    <div className="mt-2 rounded-[12.3px] border-2 border-white-500 bg-white p-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:mt-[15px] tablet:rounded-[15px] tablet:py-[25px]">
      <h1 className="text-center text-[0.75rem] font-semibold leading-[15px] text-accent-600 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[1.25rem]">
        Post participation
      </h1>
      {showModal && (
        <FilterAnalyzedOptions
          handleClose={handleHideModal}
          modalVisible={showModal}
          title={'Target Participants'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
        />
      )}
      <p className="summary-text mt-[10px] text-center tablet:mt-[15px]">
        <span className="font-bold">{questStartData?.participantsCount}</span> total participants engaged -{' '}
        <button
          onClick={() => {
            if (questStartData.whichTypeQuestion !== 'ranked choise' && questStartData?.participantsCount > 0) {
              setShowModal(true);
            } else if (questStartData.whichTypeQuestion === 'ranked choise') {
              showToast('warning', 'rankChoiceParticipantNotAllowed');
            } else {
              showToast('warning', 'noParticipants');
            }
          }}
          className="border-b border-blue-100 text-blue-100"
        >
          Direct Message participants
        </button>
      </p>
    </div>
  );
}
