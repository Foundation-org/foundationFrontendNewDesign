import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';

export default function SharedPosts({ posts }: { posts: any }) {
  const questUtils = useSelector(getQuestUtils);

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Shared Posts</h1>
        <Link to="/user/profile/shared-posts/create" className="underline">
          Manage my Shared Posts
        </Link>
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">
        {posts.map((post: any) => (
          <QuestionCardWithToggle
            key={post._id}
            questStartData={post}
            playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
          />
        ))}
      </div>
    </div>
  );
}
