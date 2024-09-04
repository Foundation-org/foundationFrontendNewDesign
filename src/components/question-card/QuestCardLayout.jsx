import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDialogueBox } from '../../features/quest/utilsSlice';
import CardTopbar from './CardTopbar';
import QuestBottombar from './QuestBottombar';
import * as HomepageApis from '../../services/api/homepageApis';
import { isImageUrl } from '../../utils/embeddedutils';
import { EmbededVideo } from './EmbededVideo';
import { EmbededImage } from './EmbededImage';
import DeletePostPopup from '../dialogue-boxes/DeletePostPopup';
import showToast from '../ui/Toast';
import PostTopBar from './PostTopBar';
import EmbedStatusBar from '../../pages/Embed/EmbedStatusBar';

const QuestCardLayout = ({ questStartData, playing, postProperties, questType, children }) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const imageGetter = useRef(null);

  useEffect(() => {
    setbookmarkStatus(questStartData.bookmark);
  }, [questStartData.bookmark]);

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: HomepageApis.createBookmark,
    onSuccess: (resp) => {
      queryClient.setQueryData(['posts'], (oldData) => ({
        ...oldData,
        pages: oldData?.pages?.map((page) =>
          page.map((item) => (item._id === resp.data.id ? { ...item, bookmark: true } : item)),
        ),
      }));
    },
    onError: (error) => {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: DelBookmark } = useMutation({
    mutationFn: HomepageApis.deleteBookmarkById,
    onSuccess: (resp) => {
      queryClient.setQueryData(['posts'], (oldData) => ({
        ...oldData,
        pages: oldData?.pages?.map((page) =>
          page.map((item) => (item._id === resp.data.id ? { ...item, bookmark: false } : item)),
        ),
      }));
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleBookmark = () => {
    if (questType === 'feedback') return;

    setbookmarkStatus((prevIsBookmarked) => !prevIsBookmarked);
    if (bookmarkStatus) {
      const params = {
        questForeignKey: questStartData._id,
        uuid: persistedUserInfo.uuid,
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: questStartData._id,
        Question: questStartData.Question,
        whichTypeQuestion: questStartData.whichTypeQuestion,
        moderationRatingCount: questStartData.moderationRatingCount,
        uuid: persistedUserInfo.uuid,
      };
      AddBookmark(params);
    }
  };

  const showDisableSharedLinkPopup = () => {
    dispatch(
      updateDialogueBox({
        type: 'Delete',
        status: true,
        link: questStartData.userQuestSetting.link,
        id: questStartData._id,
      }),
    );
  };

  const handleClose = () => setModalVisible(false);

  return (
    <div
      className="card-iframe h-full max-w-[730px] rounded-[12.3px] border-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[15px]"
      ref={imageGetter}
    >
      {postProperties === 'Embed' && <EmbedStatusBar />}
      <PostTopBar
        questStartData={questStartData}
        postProperties={postProperties}
        setDelModalVisible={setModalVisible}
      />
      {questStartData?.suppressed &&
        questStartData?.uuid === persistedUserInfo.uuid &&
        questStartData?.type !== 'embed' && (
          <div className="flex items-center justify-between border-b-2 border-gray-250 bg-white-300 px-5 py-2 text-[0.75rem] font-semibold leading-[15px] text-red-100 dark:border-gray-100 dark:bg-red-300 dark:text-red-400 tablet:py-[10px] tablet:text-[1.25rem] tablet:leading-[23px]">
            <h4 className="">SUPPRESSED</h4>
            {questStartData.uuid === localStorage.getItem('uuid') && (
              <Link to="/profile/feedback" className="underline">
                See Why
              </Link>
            )}
          </div>
        )}

      {questStartData.url &&
        questStartData.url.length !== 0 &&
        questStartData.url[0] !== '' &&
        (isImageUrl(questStartData.url) ? (
          <EmbededImage description={questStartData.description} url={questStartData.url} id={questStartData._id} />
        ) : (
          <EmbededVideo
            description={questStartData.description}
            url={questStartData.url}
            questId={questStartData._id}
            playing={playing}
          />
        ))}
      <CardTopbar
        questStartData={questStartData}
        QuestTopic={questStartData.QuestTopic}
        img={'assets/svgs/dashboard/badge.svg'}
        alt={'badge'}
        badgeCount={questStartData.getUserBadge?.badges?.length}
        createdBy={questStartData.uuid}
        bookmarkStatus={bookmarkStatus}
        handleBookmark={handleBookmark}
        postProperties={postProperties}
        showDisableSharedLinkPopup={showDisableSharedLinkPopup}
      />
      <div className={`${questStartData.type !== 'embed' && 'pb-[0.94rem] tablet:pb-6'}`}>{children}</div>
      {modalVisible && (
        <DeletePostPopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Delete Post'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          id={questStartData._id}
        />
      )}

      {questStartData?.type !== 'embed' && questStartData?.page !== 'advance-analytics' && (
        <QuestBottombar
          time={
            postProperties === 'HiddenPosts'
              ? questStartData.userQuestSetting.feedbackTime
              : postProperties === 'SharedLinks'
                ? questStartData.userQuestSetting.sharedTime
                : questStartData.createdAt
          }
          questStartData={questStartData}
          postProperties={postProperties}
          showDisableSharedLinkPopup={showDisableSharedLinkPopup}
        />
      )}
    </div>
  );
};

export default QuestCardLayout;
