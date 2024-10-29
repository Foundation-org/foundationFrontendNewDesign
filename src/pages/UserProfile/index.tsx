import ProfileCard from './ProfileCard';
import SharedPosts from './SharedPosts';
import SharedLists from './SharedLists';
import Spotlight from './Spotlight';
import NewsArticles from './NewsArticles';
import { useFetchMyProfile } from '../../services/api/profile';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../../components/ui/Loader';

export default function UserProfile() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/h/')) {
      setDomain(location.pathname.split('/')[2]);
    } else {
      setDomain(persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name);
    }
  }, []);

  const { data, isLoading } = useFetchMyProfile(domain);

  return (
    <div className="mx-auto flex max-w-[730px] flex-col gap-3 px-4 tablet:gap-6 tablet:px-0">
      {isLoading ? (
        <div className="mt-10 flex h-fit w-full justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <ProfileCard />
          {data?.spotLight && <Spotlight spotlight={data?.spotLight} />}
          <SharedPosts posts={data?.posts?.data} />
          {/* <SharedLists lists={data?.lists} /> */}
          <NewsArticles articles={data?.articles} />
        </>
      )}
    </div>
  );
}
