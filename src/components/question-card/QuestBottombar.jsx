import { toast } from 'sonner';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTimeAgo } from '../../utils/utils';
import { referralModalStyle } from '../../constants/styles';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { feedBackAndHideOptions } from '../../constants/feedbackAndHide';
import showToast from '../ui/Toast';
import Copy from '../../assets/Copy';
import BasicModal from '../BasicModal';
import CopyDialogue from '../question-card/Shareables/CopyDialogue';
import AddToListPopup from '../dialogue-boxes/AddToListPopup';
import ShowHidePostPopup from '../dialogue-boxes/ShowHidePostPopup';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';

const QuestBottombar = ({ time, questStartData, postProperties, showDisableSharedLinkPopup }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isFullScreen } = useParams();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [copyModal, setCopyModal] = useState(false);
  const [addToList, setAddToList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(feedBackAndHideOptions.map(() => false));

  const handleCopyClose = () => setCopyModal(false);
  const addToListPopupClose = () => setAddToList(false);
  const showHidePostClose = () => setModalVisible(false);

  const handleHidePostClick = () => {
    if (questStartData.uuid === persistedUserInfo.uuid) {
      showToast('warning', 'hidingOwnPost');
      return;
    }

    setCheckboxStates(feedBackAndHideOptions.map(() => false));
    setModalVisible(true);
  };

  const handleSharePostClick = () => {
    if (persistedUserInfo?.role === 'guest') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else if (questStartData?.moderationRatingCount >= 1) {
      showToast('warning', 'AdultPost');
    } else {
      setCopyModal(true);
    }
  };

  const handleAddToListClick = () => {
    if (persistedUserInfo?.role === 'guest') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      setAddToList(true);
    }
  };

  const handleAnalyzeClick = () => {
    if (persistedUserInfo?.role === 'guest') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      if (questStartData?.startStatus === '') {
        showToast('warning', 'analyzeParticipatedPost');
      } else {
        navigate('/post/isfullscreen', { state: { questId: questStartData._id } });
      }
    }
  };

  return (
    <div className="relative flex items-center justify-between border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
      {postProperties === 'HiddenPosts' ? (
        <div className="flex items-center gap-[2px] tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/hidden.svg' : 'assets/svgs/eye-latest-cut.svg'}`}
            alt="eye-cut"
            className="h-[15.67px] w-[15.24px] tablet:h-[26.6px] tablet:w-[30px]"
          />
          <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-600 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
            {questStartData?.userQuestSetting?.feedbackMessage
              ? questStartData.userQuestSetting.feedbackMessage
              : questStartData.userQuestSetting.hiddenMessage}
          </h1>
        </div>
      ) : postProperties === 'SharedLinks' ? (
        <div className="flex w-full items-center justify-between">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
            alt="trash"
            className="h-3 w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
            onClick={showDisableSharedLinkPopup}
          />
          <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
              alt="clock"
              className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
            />
            <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C] dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
              {postProperties === 'HiddenPosts' ? 'Hidden' : postProperties === 'SharedLinks' ? 'Shared' : null}{' '}
              {calculateTimeAgo(time)}
            </h4>
          </div>
        </div>
      ) : null}

      {postProperties !== 'HiddenPosts' && postProperties !== 'SharedLinks' && (
        <div
          className={`grid w-full ${
            postProperties !== 'sharedlink-results' &&
            postProperties !== 'actual-results' &&
            !location.pathname.includes('/p/') &&
            !location.pathname.includes('/l/') &&
            location.pathname !== '/post/isfullscreen'
              ? 'grid-cols-4'
              : 'grid-cols-3'
          }`}
        >
          {/* Hide Post */}
          <button className="flex w-fit items-center gap-1 tablet:gap-2" onClick={handleHidePostClick}>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/hide-icon.svg' : 'assets/hiddenposts/unhide/icon1.png'}`}
              alt="eye-latest"
              className="h-[8.75px] w-[12.5px] cursor-pointer tablet:h-[17px] tablet:w-[25px]"
            />
            <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem]">
              Hide
            </h1>
          </button>
          {/* Share */}
          <button
            className={`${
              postProperties !== 'sharedlink-results' &&
              postProperties !== 'actual-results' &&
              !location.pathname.includes('/p/') &&
              !location.pathname.includes('/l/') &&
              location.pathname !== '/post/isfullscreen'
                ? 'w-fit'
                : 'w-full justify-center'
            } flex items-center gap-1 tablet:gap-2`}
            onClick={handleSharePostClick}
          >
            {persistedTheme === 'dark' ? <Copy /> : <Copy />}
            <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem]">
              Share
            </h1>
          </button>
          {/* Add to list */}
          <button
            className={`${
              postProperties !== 'sharedlink-results' &&
              postProperties !== 'actual-results' &&
              !location.pathname.includes('/p/') &&
              !location.pathname.includes('/l/') &&
              location.pathname !== '/post/isfullscreen'
                ? 'justify-center'
                : 'justify-end'
            } flex items-center gap-1 tablet:gap-2`}
            onClick={handleAddToListClick}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/list.svg' : 'assets/svgs/addToList.svg'}`}
              alt="addToList"
              className="h-auto w-3 cursor-pointer tablet:w-[22px]"
            />
            <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem]">
              Add to list
            </h1>
          </button>
          {/* Analyze Post */}
          <>
            {postProperties !== 'sharedlink-results' &&
            postProperties !== 'actual-results' &&
            !location.pathname.includes('/p/') &&
            !location.pathname.includes('/l/') &&
            location.pathname !== '/post/isfullscreen' ? (
              <div className="flex w-full justify-end">
                {isFullScreen === undefined ? (
                  <div
                    className="flex cursor-pointer items-center justify-end gap-1 text-[#85898C] dark:text-[#ACACAC] tablet:gap-[0.66rem]"
                    onClick={handleAnalyzeClick}
                  >
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/analyze-beaker.svg' : 'assets/svgs/analyze-beaker.svg'}`}
                      alt="full-screen"
                      className="size-3 tablet:h-[23px] tablet:w-5"
                    />
                    <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
                      Analyze
                    </h1>
                  </div>
                ) : (
                  <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem]">&#x200B;</p>
                )}
              </div>
            ) : null}
          </>
        </div>
      )}

      {modalVisible && (
        <ShowHidePostPopup
          handleClose={showHidePostClose}
          setCheckboxStates={setCheckboxStates}
          checkboxStates={checkboxStates}
          data={feedBackAndHideOptions}
          modalVisible={modalVisible}
          questStartData={questStartData}
          feature={'Hide'}
        />
      )}

      {addToList && (
        <AddToListPopup handleClose={addToListPopupClose} modalVisible={addToList} questStartData={questStartData} />
      )}

      {copyModal && (
        <BasicModal
          open={copyModal}
          handleClose={handleCopyClose}
          customStyle={referralModalStyle}
          customClasses="rounded-[10px] tablet:rounded-[26px]"
        >
          <CopyDialogue handleClose={handleCopyClose} questStartData={questStartData} />
        </BasicModal>
      )}
    </div>
  );
};

export default QuestBottombar;
