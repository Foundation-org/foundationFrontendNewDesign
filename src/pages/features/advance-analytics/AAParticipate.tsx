import { useState } from 'react';
import FilterAnalyzedOptions from './components/FilterAnalyzedOptions';
import showToast from '../../../components/ui/Toast';

export default function AAParticipate({ questStartData }: { questStartData: any }) {
  const [showModal, setShowModal] = useState(false);

  const handleHideModal = () => setShowModal(false);

  return (
    <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-center">
      {showModal && (
        <FilterAnalyzedOptions
          handleClose={handleHideModal}
          modalVisible={showModal}
          title={'Target Participants'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
        />
      )}
      <p className="summary-text">
        {questStartData?.participantsCount} Participants -{' '}
        <button
          onClick={() => {
            if (questStartData?.participantsCount > 0) {
              setShowModal(true);
            } else {
              showToast('warning', 'noParticipants');
            }
          }}
          className="border-b border-blue-100 text-blue-100"
        >
          Direct Message these Users
        </button>
      </p>
    </div>
  );
}
