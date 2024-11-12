import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFetchNewsFeed } from '../../services/queries/news-feed';
import showToast from '../../components/ui/Toast';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import SummaryCard from '../../components/SummaryCard';
import { useSelector } from 'react-redux';

export default function NewsArticles({ domain }: { domain: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [showAll, setShowAll] = useState(false);
  const isPublicProfile = location.pathname.startsWith('/h/');
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const { data, fetchNextPage, hasNextPage } = useFetchNewsFeed('', 'sharedArticles', domain);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const content = useMemo(() => {
    if (!data || !data.pages || data.pages.length === 0) {
      return null;
    }

    const pagesToShow = showAll ? data.pages : data.pages.slice(0, 1);

    return pagesToShow.map((posts) =>
      posts?.data?.map((post: any, index: number) => {
        const isLastPost = index === posts.data.length - 1;
        return <NewsFeedCard key={post._id} data={post} innerRef={isLastPost ? ref : null} />;
      })
    );
  }, [data, ref, showAll]);

  console.log('data', data);

  return (
    <>
      <SummaryCard headerIcon="/assets/topbar/news.svg" headerTitle="Shared Articles" isPublicProfile={isPublicProfile}>
        {!isPublicProfile && (
          <>
            <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
              Manage news articles you’ve shared and track engagement metrics. Shared articles also appear on your Home
              Page for your audience to see.
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
              <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
                <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
                  Articles you’ve shared
                </h1>
                <h5 className="text-center text-[18px] font-normal text-[#85898C] dark:text-gray-300">
                  {persistedUserInfo?.myArticleStatistics.totalSharedArticlesCount}
                </h5>
              </div>
              <div>
                <h1 className="text-center text-[12px] font-semibold leading-[116%] text-[#85898C] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
                  Total shared article engagements
                </h1>
                <h5 className="text-center text-[18px] font-normal text-[#85898C] dark:text-gray-300">
                  {persistedUserInfo?.myArticleStatistics.overAllArticleSharedEngagementCount}
                </h5>
              </div>
            </div>
            <div className="mt-3 flex w-full justify-center tablet:mt-5">
              <Button variant={'submit'} onClick={() => navigate('/profile/shared-articles')}>
                View all shared articles
              </Button>
            </div>
          </>
        )}
      </SummaryCard>

      <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
        {/* <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
          <h1>News Articles</h1>
          {!isPublicProfile && (
            <button
            className="underline"
            onClick={() => {
              showToast('warning', 'featureComingSoon');
              }}
            >
              Manage my News Articles
            </button>
          )}
        </div> */}
        <div className="flex w-full flex-col gap-3 tablet:gap-5">{content}</div>
        {!showAll && (
          <Button variant="submit" onClick={() => setShowAll(true)}>
            See All Articles
          </Button>
        )}
      </div>
    </>
  );
}
