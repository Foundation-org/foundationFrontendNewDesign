import { useSelector } from 'react-redux';
import api from '../../services/api/Axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useInView } from 'react-intersection-observer';
import { getQuestUtils } from '../../features/quest/utilsSlice';

export default function SharedPosts() {
  const { ref, inView } = useInView();
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const fetchPosts = async function getInfoQuestions({ pageParam: pageParam = 1 }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      Page: 'SharedLink',
      terms: '',
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['sharedLink'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nexPage = lastPage.length ? allPages.length + 1 : undefined;
      return nexPage;
    },
  });

  const content = data?.pages.map((posts) =>
    posts.map((post: any, index: number) => {
      const isLastPost = posts.length === index + 1;

      return (
        <QuestionCardWithToggle
          key={post._id}
          innerRef={isLastPost ? ref : null}
          questStartData={post}
          playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
        />
      );
    })
  );

  // rounded-[13.84px] border-[1.846px] border-[#D9D9D9] bg-white
  //rounded-t-[10px]

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-6">
      <div className="flex h-[43.2px] w-full items-center bg-blue-200 px-8">
        <h1 className="text-[18px] font-medium text-white">Shared Posts</h1>
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">{content}</div>
    </div>
  );
}
