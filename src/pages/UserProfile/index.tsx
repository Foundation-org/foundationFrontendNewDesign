import ProfileCard from './ProfileCard';
import SharedPosts from './SharedPosts';
import SharedLists from './SharedLists';
import Spotlight from './Spotlight';
import NewsArticles from './NewsArticles';

export default function UserProfile() {
  return (
    <div className="mx-auto flex max-w-[730px] flex-col gap-3 px-4 tablet:gap-6 tablet:px-0">
      <ProfileCard />
      <Spotlight />
      <SharedPosts />
      <SharedLists />
      <NewsArticles />
    </div>
  );
}
