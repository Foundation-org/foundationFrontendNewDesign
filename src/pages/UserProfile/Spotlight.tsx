import { Link, useLocation } from 'react-router-dom';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';

export default function Spotlight({ spotlight }: any) {
  const location = useLocation();
  const questUtils = useSelector(getQuestUtils);
  const isPublicProfile = location.pathname.startsWith('/h/');

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Spotlight</h1>
        {!isPublicProfile && (
          <Link to="/user/profile/shared-posts/create" className="underline">
            Remove from Spotlight
          </Link>
        )}
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">
        {spotlight?.spotLightType === 'posts' ? (
          <QuestionCardWithToggle
            key={spotlight._id}
            questStartData={spotlight}
            playing={spotlight._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
          />
        ) : spotlight?.spotLightType === 'news' ? (
          <NewsFeedCard key={spotlight._id} data={spotlight} innerRef={null} />
        ) : null}
      </div>
    </div>
  );
}
