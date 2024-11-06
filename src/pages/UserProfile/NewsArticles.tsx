import { useLocation } from 'react-router-dom';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import showToast from '../../components/ui/Toast';
import { useState } from 'react';

export default function NewsArticles({ articles }: { articles: any }) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');

  const [showAll, setShowAll] = useState(false);

  const visibleArticles = showAll ? articles : articles.slice(0, 5);

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
      <div className="flex w-full flex-col gap-3 tablet:gap-5">
        {visibleArticles?.map((article: any) => <NewsFeedCard key={article._id} data={article} innerRef={null} />)}
        {!showAll && articles.length > 5 && (
          <button className="text-[19px] font-semibold leading-normal text-[#389CE3]" onClick={() => setShowAll(true)}>
            See All Articles
          </button>
        )}
      </div>
    </div>
  );
}
