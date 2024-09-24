import { useQuery } from '@tanstack/react-query';
import { getQuestsCustom } from '../../../../services/api/questsApi';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../../../features/quest/utilsSlice';
import DotsLoading from '../../../../components/ui/DotsLoading';
import QuestionCardWithToggle from '../../../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';

export default function SourcePosts({ promptSources }: { promptSources: string[] }) {
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const {
    data: sourcePosts,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['sourcePosts', promptSources],
    queryFn: () => getQuestsCustom({ ids: promptSources, uuid: persistedUserInfo.uuid }),
  });

  if (isError) {
    return <h1>No Posts Found</h1>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isFetching ? (
        <DotsLoading />
      ) : (
        sourcePosts?.map((post: any, index: number) => (
          <QuestionCardWithToggle
            key={post._id}
            questStartData={post}
            playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
          />
        ))
      )}
    </div>
  );
}
