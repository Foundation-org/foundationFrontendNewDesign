import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CardTopbar from './CardTopbar';
import QuestBottombar from './QuestBottombar';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import { useLocation } from 'react-router-dom';
import ShowHidePostPopup from '../dialogue-boxes/ShowHidePostPopup';
import { addBookmarkResponse, removeBookmarkResponse, updateDialogueBox } from '../../features/quest/utilsSlice';
import { useDispatch } from 'react-redux';
import * as HomepageApis from '../../services/api/homepageApis';

import { EmbededVideo } from './EmbededVideo';
import { isImageUrl } from '../../utils/embeddedutils';
import { EmbededImage } from './EmbededImage';
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
  isBookmarked,
  setPlayingPlayerId,
  playing,
  setIsPlaying,
  setIsShowPlayer,
  isPlaying,
  postProperties,

  children,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(data.map(() => false));

  const showHidePostOpen = () => {
    setCheckboxStates(data.map(() => false));
    setModalVisible(true);
  };

  const showHidePostClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setbookmarkStatus(isBookmarked);
  }, [isBookmarked]);

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: HomepageApis.createBookmark,
    onSuccess: (resp) => {
      // toast.success('Bookmarked Added');
      dispatch(
        addBookmarkResponse({
          questForeignKey: resp.data.id,
        }),
      );
      queryClient.invalidateQueries('FeedData');
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: DelBookmark } = useMutation({
    mutationFn: HomepageApis.deleteBookmarkById,
    onSuccess: (resp) => {
      // toast.success('Bookmark Removed ');
      // if (location.pathname === '/dashboard') {
      // queryClient.invalidateQueries('FeedData');
      dispatch(removeBookmarkResponse(resp.data.id));
      // }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleBookmark = () => {
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

  return (
    <div className="max-w-[730px] rounded-[12.3px] border-2 border-[#D9D9D9] bg-white tablet:rounded-[15px] dark:border-white dark:bg-[#000] ">
      <div className="px-2 pt-2 tablet:px-5 tablet:pt-4 laptop:px-5">
        {postProperties === 'SharedLinks' && (
          <div className="mb-2 flex justify-between tablet:mb-5">
            <div className="max-w-48 tablet:max-w-[18rem] lgTablet:max-w-[28rem] laptop:max-w-fit">
              <h1 className="truncate text-wrap text-[10px] font-semibold text-[#707175] tablet:text-[20px] tablet:font-medium">
                {url}
              </h1>
            </div>
            <div
              className="flex cursor-pointer items-center gap-[4.8px] tablet:gap-3"
              onClick={() => {
                copyToClipboard();
                toast.success('Link Copied!');
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
      </div>
      {questStartData.url !== '' &&
        (isImageUrl(questStartData.url) ? (
          <EmbededImage description={questStartData.description} url={questStartData.url} />
        ) : (
          <EmbededVideo
            description={questStartData.description}
            url={questStartData.url}
            setPlayingPlayerId={setPlayingPlayerId}
            questId={questStartData._id}
            playing={playing}
            setIsPlaying={setIsPlaying}
            setIsShowPlayer={setIsShowPlayer}
            isPlaying={isPlaying}
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
      <QuestBottombar
        uniqueShareLink={questStartData.uniqueShareLink}
        time={questStartData.createdAt}
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
