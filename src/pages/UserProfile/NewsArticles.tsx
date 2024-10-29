import { useLocation } from 'react-router-dom';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import showToast from '../../components/ui/Toast';

export default function NewsArticles({ articles }: { articles: any }) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');

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
      <div className="mb-4 flex w-full flex-col gap-3 tablet:gap-5">
        {articles?.map((article: any) => <NewsFeedCard key={article._id} data={article} innerRef={null} />)}
      </div>
    </div>
  );
}
