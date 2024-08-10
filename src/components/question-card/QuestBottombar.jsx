import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Copy from '../../assets/Copy';
import BasicModal from '../BasicModal';
import CopyDialogue from '../question-card/Shareables/CopyDialogue';
import AddToListPopup from '../dialogue-boxes/AddToListPopup';
import showToast from '../ui/Toast';
import { referralModalStyle } from '../../constants/styles';
import ShowHidePostPopup from '../dialogue-boxes/ShowHidePostPopup';
import { feedBackAndHideOptions } from '../../constants/feedbackAndHide';
import AnalyzeDialogueBox from '../dialogue-boxes/AnalyzeDialogueBox';

const QuestBottombar = ({ time, questStartData, postProperties, showDisableSharedLinkPopup }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFullScreen } = useParams();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [copyModal, setCopyModal] = useState(false);
  const [addToList, setAddToList] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(feedBackAndHideOptions.map(() => false));
  const [analyzePopup, setAnalyzePopup] = useState(false);

  const handleAnalyzeClose = () => setAnalyzePopup(false);

  const handleCopyOpen = () => {
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      return;
    } else if (questStartData?.moderationRatingCount >= 1) {
      showToast('warning', 'AdultPost');
    } else {
      setCopyModal(true);
    }
  };

  const handleCopyClose = () => setCopyModal(false);

  const addToListPopupClose = () => setAddToList(false);

  const calculateTimeAgo = () => {
    const currentDate = new Date();
    const createdAtDate = new Date(time);

    if (isNaN(createdAtDate.getTime())) {
      setTimeAgo('Invalid date');
      return;
    }

    const timeDifference = currentDate - createdAtDate;
    const seconds = Math.floor(Math.max(timeDifference / 1000, 0));
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      setTimeAgo(`${days} ${days === 1 ? 'day' : 'days'} ago`);
    } else if (hours > 0) {
      setTimeAgo(`${hours} ${hours === 1 ? 'hour' : 'hours'} ago`);
    } else if (minutes > 0) {
      setTimeAgo(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`);
    } else {
      setTimeAgo(`${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`);
    }
  };

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

  useEffect(() => {
    calculateTimeAgo();
  }, [time]);

  return (
    <div className="relative flex items-center justify-between border-t-2 border-gray-250 px-[0.57rem] py-[5px] tablet:px-5 tablet:py-[11px] dark:border-gray-100">
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

      {postProperties === 'HiddenPosts' ? (
        <div className="flex items-center gap-[2px] tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/hidden.svg' : 'assets/svgs/eye-latest-cut.svg'}`}
            alt="eye-cut"
            className="h-[15.67px] w-[15.24px] tablet:h-[26.6px] tablet:w-[30px]"
          />
          <h1 className="text-[0.6rem] font-medium text-accent-200 tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white-600">
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
            <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C]  tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white">
              {postProperties === 'HiddenPosts' ? 'Hidden' : postProperties === 'SharedLinks' ? 'Shared' : null}{' '}
              {timeAgo}
            </h4>
          </div>
        </div>
      ) : null}

      {postProperties !== 'HiddenPosts' && postProperties !== 'SharedLinks' && (
        <div className="flex w-full items-center justify-between gap-[8px] tablet:gap-[25px]">
          {/* Hide Post */}
          <button
            className="flex min-w-[63px] items-center gap-1 tablet:min-w-[146px] tablet:gap-2"
            onClick={showHidePostOpen}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/hide-icon.svg' : 'assets/hiddenposts/unhide/icon1.png'}`}
              alt="eye-latest"
              className="h-[8.75px] w-[12.5px] cursor-pointer tablet:h-[17px] tablet:w-[25px]"
            />
            <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem] dark:text-white-200">
              Hide
            </h1>
          </button>
          {/* Share */}
          {postProperties !== 'HiddenPosts' && postProperties !== 'SharedLinks' && (
            <>
              <button
                onClick={() => {
                  handleCopyOpen();
                }}
                className="flex min-w-[63px] items-center gap-1 tablet:min-w-[146px] tablet:gap-2"
              >
                {persistedTheme === 'dark' ? <Copy /> : <Copy />}
                <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem] dark:text-white-200">
                  Share
                </h1>
              </button>
              <BasicModal
                open={copyModal}
                handleClose={handleCopyClose}
                customStyle={referralModalStyle}
                customClasses="rounded-[10px] tablet:rounded-[26px]"
              >
                <CopyDialogue handleClose={handleCopyClose} questStartData={questStartData} />
              </BasicModal>{' '}
            </>
          )}
          {/* Add to list */}
          <button
            className="flex min-w-[63px] items-center gap-1 tablet:min-w-[146px] tablet:justify-end tablet:gap-2"
            onClick={() => {
              if (persistedUserInfo?.role === 'guest') {
                toast.warning(
                  <p>
                    Please{' '}
                    <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
                      Create an Account
                    </span>{' '}
                    to unlock this feature
                  </p>,
                );
                return;
              } else {
                setAddToList(true);
              }
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/list.svg' : 'assets/svgs/addToList.svg'}`}
              alt="addToList"
              className="h-auto w-3 cursor-pointer tablet:w-[22px]"
            />
            <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-accent-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem] dark:text-white-200">
              Add to list
            </h1>
          </button>
          {/* Expand Post */}
          <>
            {postProperties !== 'HiddenPosts' &&
            postProperties !== 'SharedLinks' &&
            postProperties !== 'sharedlink-results' &&
            postProperties !== 'actual-results' &&
            !window.location.href.includes('/p/') &&
            !location.pathname.includes('/l/') &&
            location.pathname !== '/post/isfullscreen' ? (
              <div className="flex justify-center tablet:min-w-[146px]">
                {analyzePopup && (
                  <AnalyzeDialogueBox
                    handleClose={handleAnalyzeClose}
                    modalVisible={analyzePopup}
                    title={'Analyze'}
                    image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
                    questStartData={questStartData}
                  />
                )}
                {isFullScreen === undefined ? (
                  <div
                    className="flex cursor-pointer items-center justify-end gap-1 text-[#85898C] tablet:gap-[0.66rem] dark:text-[#ACACAC] "
                    onClick={() => {
                      setAnalyzePopup(true);
                      // navigate('/post/isfullscreen', {
                      //   state: { questId: questStartData._id },
                      // });
                    }}
                  >
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/fullscreen.svg' : 'assets/svgs/fullscreen-icon.svg'}`}
                      alt="full-screen"
                      className="size-3 tablet:h-[23px] tablet:w-5"
                    />
                    <h1 className="text-[0.6rem] font-medium text-accent-200 tablet:text-[1.13531rem] laptop:text-[1.2rem] dark:text-white-200">
                      Expand Post
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
    </div>
  );
};

export default QuestBottombar;
