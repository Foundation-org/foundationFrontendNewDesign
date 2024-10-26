import { Link } from 'react-router-dom';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';

export default function NewsArticles({ articles }: { articles: any }) {
  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>News Articles</h1>
        <Link to="/user/profile/shared-posts/create" className="underline">
          Manage my News Articles
        </Link>
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">
        {articles?.map((article: any) => <NewsFeedCard key={article._id} data={article} innerRef={null} />)}
      </div>
    </div>
  );
}
