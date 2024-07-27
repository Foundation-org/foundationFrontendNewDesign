import { useSelector } from 'react-redux';
import showToast from '../../../../../../../components/ui/Toast';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { feedBackAndHideOptions } from '../../../../../../../constants/feedbackAndHide';
import ShowHidePostPopup from '../../../../../../../components/dialogue-boxes/ShowHidePostPopup';

type FeedbackAndVisibilityProps = {
  questStartData: any;
};

const FeedbackAndVisibility = forwardRef(({ questStartData }: FeedbackAndVisibilityProps, ref) => {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(feedBackAndHideOptions.map(() => false));

  useImperativeHandle(ref, () => ({
    showHidePostOpen,
  }));

  const showHidePostOpen = () => {
    if (questStartData.uuid === persistedUserInfo.uuid) {
      showToast('warning', 'hidingOwnPost');
      return;
    }

    setCheckboxStates(feedBackAndHideOptions.map(() => false));
    setModalVisible(true);
  };

  const showHidePostClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ShowHidePostPopup
        handleClose={showHidePostClose}
        setCheckboxStates={setCheckboxStates}
        checkboxStates={checkboxStates}
        data={feedBackAndHideOptions}
        modalVisible={modalVisible}
        questStartData={questStartData}
      />
    </>
  );
});

export default FeedbackAndVisibility;
