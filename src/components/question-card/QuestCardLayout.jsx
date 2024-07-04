import { toast } from 'sonner';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CardTopbar from './CardTopbar';
import QuestBottombar from './QuestBottombar';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import { Link, useLocation } from 'react-router-dom';
import ShowHidePostPopup from '../dialogue-boxes/ShowHidePostPopup';
import { addBookmarkResponse, removeBookmarkResponse, updateDialogueBox } from '../../features/quest/utilsSlice';
import { useDispatch } from 'react-redux';
import * as HomepageApis from '../../services/api/homepageApis';

import { EmbededVideo } from './EmbededVideo';
import { isImageUrl } from '../../utils/embeddedutils';
import { EmbededImage } from './EmbededImage';
import DeletePostPopup from '../dialogue-boxes/DeletePostPopup';
import showToast from '../ui/Toast';

const data = [
  {
    id: 1,
    title: 'Does not apply to me',
  },
  {
    id: 2,
    title: 'Not interested',
  },
  {
    id: 3,
    title: 'Has Mistakes or Errors',
  },
  {
    id: 4,
    title: 'Needs More Options',
  },
  {
    id: 5,
    title: 'Unclear / Doesn’t make Sense',
  },
  {
    id: 6,
    title: 'Duplicate / Similar Post',
  },
];

const QuestCardLayout = ({
  questStartData,
  playing,
  postProperties,
  questType,
  children,
  // isBookmarked,
  // setPlayingPlayerId,
  // setIsPlaying,
  // setIsShowPlayer,
  // isPlaying,
}) => {
  const dispatch = useDispatch();
  // const location = useLocation();
  const queryClient = useQueryClient();
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(data.map(() => false));
  const imageGetter = useRef(null);

  // const showHidePostOpen = () => {
  //   setCheckboxStates(data.map(() => false));
  //   setModalVisible(true);
  // };

  // const showHidePostClose = () => {
  //   setModalVisible(false);
  // };

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

      // dispatch(
      //   addBookmarkResponse({
      //     questForeignKey: resp.data.id,
      //   }),
      // );

      // queryClient.invalidateQueries('FeedData');
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
      // toast.success('Bookmark Removed ');
      // if (location.pathname === '/') {
      // queryClient.invalidateQueries('FeedData');
      // dispatch(removeBookmarkResponse(resp.data.id));
      // }
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
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: questStartData._id,
        Question: questStartData.Question,
        whichTypeQuestion: questStartData.whichTypeQuestion,
        moderationRatingCount: questStartData.moderationRatingCount,
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

  const { protocol, host } = window.location;
  let url = `${protocol}//${host}/p/${questStartData?.userQuestSetting?.link}`;

  const copyToClipboard = async () => {
    const textToCopy = url;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };
  // const getImage = useCallback(() => {
  //   if (imageGetter.current === null) {
  //     return;
  //   }

  //   toPng(imageGetter.current, { cacheBust: true })
  //     .then((dataUrl) => {
  //       const link = document.createElement('a');
  //       link.download = `image-${questStartData._id}.png`;
  //       link.href = dataUrl;
  //       link.click();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [imageGetter]);
  // function dataURLToBlob(dataURL) {
  //   const parts = dataURL.split(';base64,');
  //   const contentType = parts[0].split(':')[1];
  //   const byteString = atob(parts[1]);
  //   const mimeString = contentType;

  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const uint8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     uint8Array[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([arrayBuffer], { type: mimeString });
  // }

  // const getImage = useCallback(
  //   (link) => {
  //     console.log(link);
  //     if (imageGetter.current === null) {
  //       return;
  //     }
  //     toPng(imageGetter.current, { cacheBust: true })
  //       .then((dataUrl) => {
  //         const formData = new FormData();
  //         const blob = dataURLToBlob(dataUrl);

  //         formData.append('file', blob);
  //         formData.append('path', `image-${questStartData._id}.png`);
  //         formData.append('link', link.link);
  //         formData.append('data', JSON.parse(link.questStartData));

  //         fetch(`${import.meta.env.VITE_API_URL}/aws/s3ImageUploadToFrames`, {
  //           method: 'POST',
  //           body: formData,
  //         })
  //           .then((response) => {
  //             console.log('then', response);
  //             if (response.ok) {
  //               console.log('Image uploaded successfully!');
  //             } else {
  //               console.error('Error uploading image:', response.statusText);
  //             }
  //           })
  //           .catch((error) => {
  //             console.error('Error sending image to server:', error);
  //           });
  //       })
  //       .catch((err) => {
  //         console.error('Error converting image to dataURL:', err);
  //       });
  //   },
  //   [imageGetter],
  // );
  const handleClose = () => setModalVisible(false);
  return (
    <div
      className="max-w-[730px] rounded-[12.3px] border-2 border-[#D9D9D9] bg-white tablet:rounded-[15px] dark:border-white dark:bg-[#000] "
      ref={imageGetter}
    >
      {questStartData?.suppressed && (
        <div className="flex items-center justify-between rounded-t-[12.3px] border-b-[1.834px] border-[#D9D9D9] bg-[#FEECEC] px-5 py-2 text-[0.75rem] font-semibold leading-[15px] text-[#FF2C2C] tablet:rounded-t-[13.842px] tablet:py-[10px] tablet:text-[1.25rem] tablet:leading-[23px]">
          <h4 className="">SUPRESSED</h4>
          {questStartData.uuid === localStorage.getItem('uuid') && (
            <Link to="/profile/feedback" className="underline">
              See Why
            </Link>
          )}
        </div>
      )}

      {postProperties === 'SharedLinks' && !questStartData?.suppressed && (
        <div className="mb-2 flex justify-between border-b border-[#D9D9D9] px-2 py-[5px] tablet:mb-5 tablet:border-b-2 tablet:px-5 tablet:py-[11px] laptop:px-5">
          <div className="max-w-48 tablet:max-w-[18rem] lgTablet:max-w-[28rem] laptop:max-w-fit">
            <h1 className="truncate text-wrap text-[10px] font-semibold text-[#707175] tablet:text-[20px] tablet:font-medium">
              {url}
            </h1>
          </div>
          <div
            className="flex cursor-pointer items-center gap-[4.8px] tablet:gap-3"
            onClick={() => {
              copyToClipboard();
              showToast('success', 'copyLink');
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copylinkblue.png`}
              alt="eye-cut"
              className="h-3 w-3 tablet:h-[22.92px] tablet:w-[19.79px]"
            />
            <h1 className="text-[10.45px] font-semibold text-[#6BA5CF] tablet:text-[20px]">Copy Link</h1>
          </div>
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

            // setPlayingPlayerId={setPlayingPlayerId}
            // setIsPlaying={setIsPlaying}
            // setIsShowPlayer={setIsShowPlayer}
            // isPlaying={isPlaying}
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

      <div className="pb-[0.94rem] tablet:pb-6">
        <div className="ml-[1.39rem] mr-[0.62rem] flex items-start  tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem]">
          {/* <div className="flex gap-1.5 pr-5 tablet:gap-3 tablet:pr-6"> */}
          {/* <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
              {questStartData.Question?.endsWith('?') ? 'Q.' : 'S.'}
            </h4> */}
          {/* <h4 className="text-[0.75rem] font-semibold leading-[15px] text-[#7C7C7C] tablet:text-[1.25rem] tablet:leading-[23px]">
              {questStartData.Question}
            </h4>
          </div> */}
          {/* {postProperties === 'HiddenPosts' ? null : postProperties === 'SharedLinks' ? null : (
            <img
              src="/assets/hiddenposts/unhide/icon1.png"
              alt="eye-latest"
              className="mt-[3px] h-[8.75px] w-[12.5px] cursor-pointer tablet:h-[17px] tablet:w-[25px]"
              onClick={showHidePostOpen}
            />
          )} */}
          {/* {postProperties === 'SharedLinks' ? (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
              alt="trash"
              className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
              onClick={showDisableSharedLinkPopup}
            />
          ) : null} */}
        </div>
        {children}
      </div>
      {modalVisible && (
        <DeletePostPopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Delete Post'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          id={questStartData._id}
        />
      )}
      <QuestBottombar
        uniqueShareLink={questStartData.uniqueShareLink}
        time={
          postProperties === 'HiddenPosts'
            ? questStartData.userQuestSetting.hiddenTime
            : postProperties === 'SharedLinks'
              ? questStartData.userQuestSetting.sharedTime
              : questStartData.createdAt
        }
        id={questStartData._id}
        createdBy={questStartData.uuid}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        question={questStartData.Question}
        img={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
        alt={'badge'}
        badgeCount={questStartData.getUserBadge?.badges?.length}
        questStartData={questStartData}
        postProperties={postProperties}
        showDisableSharedLinkPopup={showDisableSharedLinkPopup}
        // getImage={getImage}
        setDelModalVisible={setModalVisible}
      />
      {/* <ShowHidePostPopup
        handleClose={showHidePostClose}
        setCheckboxStates={setCheckboxStates}
        checkboxStates={checkboxStates}
        data={data}
        modalVisible={modalVisible}
        questStartData={questStartData}
      /> */}
    </div>
  );
};

export default QuestCardLayout;
