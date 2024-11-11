import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFetchNewsFeed } from '../../services/queries/news-feed';
import showToast from '../../components/ui/Toast';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';

export default function NewsArticles({ domain }: { domain: string }) {
  const location = useLocation();
  const { ref, inView } = useInView();
  const [showAll, setShowAll] = useState(false);
  const isPublicProfile = location.pathname.startsWith('/h/');

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
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
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
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">{content}</div>
      {!showAll && (
        <Button variant="submit" onClick={() => setShowAll(true)}>
          See All Articles
        </Button>
      )}
    </div>
  );
}
