import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import { useUpdateSpotLight } from '../../services/api/profile';
import ListCard from '../Dashboard/pages/Lists/components/ListCard';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import SummaryCard from '../../components/SummaryCard';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

export default function Spotlight({ spotlight }: any) {
  const location = useLocation();
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();

  // console.log('first', spotlight);

  return (
    <>
      <SummaryCard
        headerIcon="/assets/profile/homepagebadges.svg"
        headerTitle="Spotlight"
        isPublicProfile={isPublicProfile}
      >
        {!isPublicProfile && (
          <>
            <h1 className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
              Need Copy
            </h1>

            <div className="mt-3 flex w-full justify-center gap-3 tablet:mt-5">
              <Button variant={'submit'} onClick={() => setIsPersonalPopup(true)}>
                Remove From Spotlight
              </Button>
            </div>
          </>
        )}
      </SummaryCard>

      <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
        {/* <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Spotlight</h1>
        {!isPublicProfile && (
          <button
            className="underline"
            onClick={() => {
              const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;
              const id = spotlight.spotLightType === 'lists' ? spotlight.category._id : spotlight._id;

              handleSpotLight({ domain, type: spotlight.spotLightType, id, status: 'reset' });
            }}
          >
            Remove from Spotlight
          </button>
        )}
      </div> */}

        <div className="flex w-full flex-col gap-3 tablet:gap-5">
          {spotlight?.spotLightType === 'posts' ? (
            <QuestionCardWithToggle
              key={spotlight._id}
              questStartData={spotlight}
              playing={spotlight._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
            />
          ) : spotlight?.spotLightType === 'news' ? (
            <NewsFeedCard key={spotlight._id} data={spotlight} innerRef={null} />
          ) : spotlight?.spotLightType === 'lists' ? (
            <ListCard listData={[spotlight.category]} />
          ) : null}
        </div>
      </div>
    </>
  );
}
