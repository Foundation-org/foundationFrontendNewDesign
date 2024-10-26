import ProfileCard from './ProfileCard';
import SharedPosts from './SharedPosts';
import SharedLists from './SharedLists';
import Spotlight from './Spotlight';
import NewsArticles from './NewsArticles';
import { useFetchMyProfile } from '../../services/api/profile';
import { useSelector } from 'react-redux';

export default function UserProfile() {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;

  const { data, isFetching } = useFetchMyProfile(domain);

  return (
    <div className="mx-auto flex max-w-[730px] flex-col gap-3 px-4 tablet:gap-6 tablet:px-0">
      <ProfileCard />
      {/* <Spotlight /> */}
      <SharedPosts posts={data?.posts?.data} />
      {/* <SharedLists lists={data?.lists} /> */}
      <NewsArticles articles={data?.articles} />
    </div>
  );
}
