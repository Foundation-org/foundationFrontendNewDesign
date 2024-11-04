import ProfileCard from './ProfileCard';
import SharedPosts from './SharedPosts';
import SharedLists from './SharedLists';
import Spotlight from './Spotlight';
import NewsArticles from './NewsArticles';
import { useFetchMyProfile } from '../../services/api/profile';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/h/')) {
      setDomain(location.pathname.split('/')[2]);
    } else {
      setDomain(persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name);
    }
  }, []);

  const { data, isLoading, error } = useFetchMyProfile(domain);

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col gap-3 px-4 tablet:gap-6 tablet:px-0">
      {isLoading ? (
        <div className="mt-10 flex h-fit w-full justify-center">
          <Loader />
        </div>
      ) : !domain ? (
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
          Add a domain badge to view your profile
        </p>
      ) : error?.message === 'No such page exists.' ? (
        <div className="mt-16 flex h-full flex-col items-center text-[#616161]">
          <h1 className="text-[32px] font-bold leading-normal">Sorry!</h1>
          <h2 className="text-[26px] font-semibold leading-normal text-[#616161]">Page not found</h2>
          <Button variant="submit" className="mt-10" onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/404.svg`}
            alt="page not found"
            className="h-[286px] w-full max-w-[333px] tablet:max-w-[444px]"
          />
        </div>
      ) : (
        <>
          <ProfileCard profile={data?.profile} />
          {data?.spotLight && data?.spotLight.message !== 'No list exists yet.' && (
            <Spotlight spotlight={data?.spotLight} />
          )}
          {data?.posts?.data.length >= 1 && <SharedPosts posts={data?.posts?.data} />}
          {data?.list?.length >= 1 && <SharedLists lists={data?.lists} />}
          {data?.articles.length >= 1 && <NewsArticles articles={data?.articles} />}
        </>
      )}
    </div>
  );
}
