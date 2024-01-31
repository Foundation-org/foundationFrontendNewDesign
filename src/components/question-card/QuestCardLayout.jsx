import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CardTopbar from './CardTopbar';
import QuestBottombar from './QuestBottombar';
import * as HomepageApis from '../../services/api/homepageApis';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';

const QuestCardLayout = ({ questStartData, isBookmarked, handleStartTest, children }) => {
  const queryClient = useQueryClient();
  const [bookmarkStatus, setbookmarkStatus] = useState(false);

  useEffect(() => {
    setbookmarkStatus(isBookmarked);
  }, [isBookmarked]);

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: HomepageApis.createBookmark,
    onSuccess: (resp) => {
      toast.success('Bookmarked Added');
      queryClient.invalidateQueries('FeedData');
      handleStartTest(null);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: DelBookmark } = useMutation({
    mutationFn: HomepageApis.deleteBookmarkById,
    onSuccess: (resp) => {
      toast.success('Bookmark Removed ');
      if (!isBookmarkTab) {
        queryClient.invalidateQueries('FeedData');
      }
      handleStartTest(null);
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
        badgeCount={questStartData.getUserBadge?.badges.length}
        createdBy={questStartData.uuid}
        bookmarkStatus={bookmarkStatus}
        handleBookmark={handleBookmark}
      />
      <div className="pb-[0.94rem] pt-[0.84rem] tablet:pb-5 tablet:pt-[0.94rem]">
        <div className="ml-[1.39rem] mr-[0.62rem] tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem]">
          <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem] leading-none">
            {questStartData.Question?.endsWith('?') ? 'Q.' : 'S.'} {questStartData.Question}
          </h4>
        </div>
        {children}
      </div>
      <QuestBottombar
        time={questStartData.createdAt}
        id={questStartData._id}
        createdBy={questStartData.uuid}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        question={questStartData.Question}
        img={'assets/svgs/dashboard/badge.svg'}
        alt={'badge'}
        badgeCount={questStartData.getUserBadge?.badges.length}
        questStartData={questStartData}
      />
    </div>
  );
};

export default QuestCardLayout;
