import { useLocation } from 'react-router-dom';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import { useUpdateSpotLight } from '../../services/api/profile';

export default function Spotlight({ spotlight }: any) {
  const location = useLocation();
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const isPublicProfile = location.pathname.startsWith('/h/');

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Spotlight</h1>
        {!isPublicProfile && (
          <button
            className="underline"
            onClick={() => {
              const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;
              handleSpotLight({ domain, type: spotlight.spotLightType, id: spotlight._id, status: 'reset' });
            }}
          >
            Remove from Spotlight
          </button>
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
