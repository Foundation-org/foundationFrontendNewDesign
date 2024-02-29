import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CardTopbar from './CardTopbar';
import QuestBottombar from './QuestBottombar';
import * as HomepageApis from '../../services/api/homepageApis';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import { useLocation } from 'react-router-dom';
import ShowHidePostPopup from '../dialogue-boxes/ShowHidePostPopup';
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
    id:6,
    title: 'Duplicate / Similar Post',
  },
  {
    id: 7,
    title: 'Offensive',
  },
  {
    id: 8,
    title: 'Spam',
  },
];

const QuestCardLayout = ({ questStartData, isBookmarked, postProperties, children }) => {
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
      if (location.pathname === '/dashboard') {
        queryClient.invalidateQueries('FeedData');
      }
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
      };
      AddBookmark(params);
    }
  };

  return (
    <div className="rounded-[12.3px] border-2 border-[#D9D9D9] bg-white dark:border-white dark:bg-[#000] tablet:rounded-[15px]">
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
      />
      <div className="pb-[0.94rem] pt-[0.84rem] tablet:pb-5 tablet:pt-[0.94rem]">
        <div className="ml-[1.39rem] mr-[0.62rem] tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem] flex items-start justify-between">
          <div className="flex gap-1.5 tablet:gap-3 pr-5 tablet:pr-6">
            <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem] leading-[15px] tablet:leading-[23px]">
              {questStartData.Question?.endsWith('?') ? 'Q.' : 'S.'}
            </h4>
            <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem] leading-[15px] tablet:leading-[23px]">
              {questStartData.Question}
            </h4>
          </div>
          {postProperties === 'HiddenPosts' ? null : postProperties === 'SharedLinks' ? null : (
            <img
              src="/assets/hiddenposts/unhide/icon1.png"
              alt="eye-latest"
              className="cursor-pointer w-[12.5px] h-[8.75px] tablet:w-[25px] tablet:h-[17px]"
              onClick={showHidePostOpen}
            />
          )}
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
        img={'/assets/svgs/dashboard/badge.svg'}
        alt={'badge'}
        badgeCount={questStartData.getUserBadge?.badges?.length}
        questStartData={questStartData}
        postProperties={postProperties}
      />
      <ShowHidePostPopup
        handleClose={showHidePostClose}
        setCheckboxStates={setCheckboxStates}
        checkboxStates={checkboxStates}
        data={data}
        modalVisible={modalVisible}
        questStartData={questStartData}
      />
    </div>
  );
};

export default QuestCardLayout;
