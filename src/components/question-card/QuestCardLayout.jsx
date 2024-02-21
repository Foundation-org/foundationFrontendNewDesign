import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CardTopbar from './CardTopbar';
import QuestBottombar from './QuestBottombar';
import * as HomepageApis from '../../services/api/homepageApis';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import { useLocation } from 'react-router-dom';
import ShowHidePostPopup from './ShowHidePostPopup';

const QuestCardLayout = ({ questStartData, isBookmarked, children }) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const showHidePostOpen = () => setModalVisible(true);
  const showHidePostClose = () => setModalVisible(false);

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
        QuestTopic={questStartData.QuestTopic}
        img={'assets/svgs/dashboard/badge.svg'}
        alt={'badge'}
        badgeCount={questStartData.getUserBadge?.badges?.length}
        createdBy={questStartData.uuid}
        bookmarkStatus={bookmarkStatus}
        handleBookmark={handleBookmark}
      />
      <div className="pb-[0.94rem] pt-[0.84rem] tablet:pb-5 tablet:pt-[0.94rem]">
        <div className="ml-[1.39rem] mr-[0.62rem] tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem] flex items-start justify-between">
          <div className="flex gap-1.5 tablet:gap-3">
            <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem] leading-none">
              {questStartData.Question?.endsWith('?') ? 'Q.' : 'S.'}
            </h4>
            <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem] leading-none">
              {questStartData.Question}
            </h4>
          </div>
          <img
            src="/assets/svgs/eye-latest.svg"
            alt="eye-latest"
            className="cursor-pointer w-[15px] h-[15px] tablet:w-[30px] tablet:h-[30px]"
            onClick={showHidePostOpen}
          />
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
      />
      <ShowHidePostPopup handleClose={showHidePostClose} modalVisible={modalVisible} />
    </div>
  );
};

export default QuestCardLayout;
