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
import LinkHub from './LinkHub';
import HomepageBadge from '../Dashboard/pages/Profile/pages/verification-badges/HomepageBadge';

export default function UserProfile() {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [domain, setDomain] = useState('');
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));
  const isDomainBadge = persistedUserInfo?.badges?.some((badge: any) => !!badge?.domain) || false;

  useEffect(() => {
    if (location.pathname.startsWith('/h/')) {
      setDomain(location.pathname.split('/')[2]);
    } else {
      setDomain(persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name);
    }
  }, [isDomainBadge]);

  const { data, isLoading, error } = useFetchMyProfile(domain, persistedUserInfo.uuid);

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col gap-3 px-4 tablet:gap-6 tablet:px-0">
      {isLoading ? (
        <div className="mt-10 flex h-fit w-full justify-center">
          <Loader />
        </div>
      ) : !domain ? (
        <div className="dar flex flex-col gap-2 rounded-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-3 dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[10px] tablet:p-5">
          <h1 className="text-[11px] leading-normal text-[#85898C] dark:text-[#f1f1f1] tablet:text-[18px]">
            You must add 'Domain' Badge to view your profile.
            {/* To continue using this wallet, you must <span className="font-semibold">“Add”</span> your{' '}
            <span className="font-semibold">“Ethereum Badge”</span> for secure and verified access. This ensures your
            identity is linked and helps safeguard your assets. */}
          </h1>

          <HomepageBadge checkPseudoBadge={checkPseudoBadge} isProfile={false} isDomain={true} />
        </div>
      ) : error?.message === 'No such page exists.' ? (
        <div className="mt-16 flex h-full flex-col items-center text-[#616161] dark:text-[#f1f1f1]">
          <h1 className="text-[32px] font-bold leading-normal">Sorry!</h1>
          <h2 className="text-[26px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1]">
            Page not found
          </h2>
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
        <div className="mb-4 flex flex-col gap-3 tablet:gap-6">
          <ProfileCard profile={data?.profile} />
          {data?.linkHub && data?.linkHub === 'No Link Hub badge added yet!' && isPublicProfile ? null : (
            <LinkHub linkHub={data?.linkHub} />
          )}
          {data?.spotLight && data?.spotLight.message !== 'No list exists yet.' && (
            <Spotlight spotlight={data?.spotLight} />
          )}
          {data?.posts?.data.length >= 1 && <SharedPosts posts={data?.posts?.data} />}
          {data?.lists?.length >= 1 && <SharedLists lists={data?.lists} />}
          {data?.articles.length >= 1 && <NewsArticles articles={data?.articles} />}
        </div>
      )}
    </div>
  );
}
