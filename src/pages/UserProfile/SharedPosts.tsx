import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import api from '../../services/api/Axios';
import SummaryCard from '../../components/SummaryCard';

export default function SharedPosts({ domain }: { domain: string }) {
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const questUtils = useSelector(getQuestUtils);
  const [showAll, setShowAll] = useState(false);

  const fetchPosts = async function getInfoQuestions({ pageParam }: { pageParam: number }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      sort: 'Newest First',
      Page: 'SharedLink',
      terms: '',
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
      domain: domain,
      viewerUuid: persistedUserInfo.uuid,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });
    return response.data.data;
  };

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['sharedLink', ''],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nexPage = lastPage.length ? allPages.length + 1 : undefined;
      return nexPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const content = useMemo(() => {
    const pagesToShow = showAll ? data?.pages : data?.pages.slice(0, 1);

    return pagesToShow?.map((posts) =>
      posts.map((post: any, index: number) => {
        const isLastPost = index === posts.length - 1;

        return (
          <QuestionCardWithToggle
            key={post._id}
            innerRef={isLastPost ? ref : null}
            questStartData={post}
            playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
            postProperties={!isPublicProfile && 'user-profile'}
          />
        );
      })
    );
  }, [data, ref, questUtils, showAll]);

  return (
    <>
      {content && content[0].length !== 0 && (
        <>
          <SummaryCard
            headerIcon="/assets/summary/share-posts-logo.svg"
            headerTitle="Shared Posts"
            isPublicProfile={isPublicProfile}
          >
            {!isPublicProfile && (
              <>
                <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
                  Sharing posts helps broaden your reach. The more engagement your shares receive, the more FDX you
                  earn. Shared posts are displayed on your Home Page for all to see.
                </h1>
                <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Posts you’ve shared
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.sharedQuestsStatistics?.sharedQuests}
                    </h5>
                  </div>
                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total clicks
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.sharedQuestsStatistics?.totalQuestsImpression}
                    </h5>
                  </div>
                  <div>
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total engagements
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted}
                    </h5>
                  </div>
                </div>
                <div className="mt-3 flex w-full justify-center tablet:mt-5">
                  <Button variant={'submit'} onClick={() => navigate('/profile/shared-links')}>
                    View all shared posts
                  </Button>
                </div>
              </>
            )}
          </SummaryCard>
          <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
            {/* <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
          <h1>Shared Posts</h1>
          {!isPublicProfile && (
            <Link to="/profile/shared-links" className="underline">
              Manage my Shared Posts
            </Link>
          )}
        </div> */}
            <div className="flex w-full flex-col gap-3 tablet:gap-5">{content}</div>
            {!showAll && (
              <Button variant="submit" onClick={() => setShowAll(true)}>
                See All Posts
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
