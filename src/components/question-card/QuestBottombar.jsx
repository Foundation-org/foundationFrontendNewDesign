import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Copy from '../../assets/Copy';
import BasicModal from '../BasicModal';
import CopyDialogue from '../question-card/Shareables/CopyDialogue';
import AddToListPopup from '../dialogue-boxes/AddToListPopup';
import showToast from '../ui/Toast';

const customModalStyle = {
  boxShadow: 'none',
  border: '0px',
  outline: 'none',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const QuestBottombar = ({
  time,
  createdBy,
  questStartData,
  postProperties,
  showDisableSharedLinkPopup,
  setDelModalVisible,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFullScreen } = useParams();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [copyModal, setCopyModal] = useState(false);
  const [addToList, setAddToList] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

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

  useEffect(() => {
    calculateTimeAgo();
  }, [time]);

  return (
    <div className="relative flex items-center justify-between border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
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
            <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C]  dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
              {postProperties === 'HiddenPosts' ? 'Hidden' : postProperties === 'SharedLinks' ? 'Shared' : null}{' '}
              {timeAgo}
            </h4>
          </div>
        </div>
      ) : null}

      {postProperties !== 'HiddenPosts' && postProperties !== 'SharedLinks' && (
        <div className="flex w-full items-center justify-between gap-[8px] tablet:gap-[25px]">
          {/* Share */}
          {postProperties !== 'HiddenPosts' && postProperties !== 'SharedLinks' && (
            <>
              <button
                onClick={() => {
                  handleCopyOpen();
                }}
                className="flex items-center gap-[0.17rem] tablet:min-w-[146px] tablet:gap-2"
              >
                {persistedTheme === 'dark' ? <Copy /> : <Copy />}
                <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
                  Share
                </h1>
              </button>
              <BasicModal
                open={copyModal}
                handleClose={handleCopyClose}
                customStyle={customModalStyle}
                customClasses="rounded-[10px] tablet:rounded-[26px]"
              >
                <CopyDialogue handleClose={handleCopyClose} questStartData={questStartData} />
              </BasicModal>{' '}
            </>
          )}

          {/* Add to list */}
          <button
            className="flex items-center gap-2 tablet:min-w-[146px]"
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
            <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
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
                {isFullScreen === undefined ? (
                  <div
                    className="flex cursor-pointer items-center justify-end gap-1 text-[#85898C] dark:text-[#ACACAC] tablet:gap-[0.66rem] "
                    onClick={() => {
                      navigate('/post/isfullscreen', {
                        state: { questId: questStartData._id },
                      });
                    }}
                  >
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/fullscreen.svg' : 'assets/svgs/fullscreen-icon.svg'}`}
                      alt="full-screen"
                      className="size-3 tablet:h-[23px] tablet:w-5"
                    />
                    <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
                      Expand Post
                    </h1>
                  </div>
                ) : (
                  <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem]">&#x200B;</p>
                )}
              </div>
            ) : null}
          </>

          {/* Delete */}
          <>
            {postProperties !== 'HiddenPosts' &&
              postProperties !== 'SharedLinks' &&
              !questStartData?.result?.length >= 1 &&
              createdBy === localStorage.getItem('uuid') && (
                <button
                  className="flex items-center justify-end gap-2 tablet:min-w-[146px]"
                  onClick={() => setDelModalVisible(true)}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/hiddenposts/unhide/deletePost.png'}`}
                    alt="eye-latest"
                    className="h-3 w-[9px] tablet:h-[22px] tablet:w-[17px]"
                  />
                  <h1 className="text-[0.6rem] font-medium text-accent-200 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
                    Delete
                  </h1>
                </button>
              )}
          </>
        </div>
      )}
    </div>
  );
};

export default QuestBottombar;
