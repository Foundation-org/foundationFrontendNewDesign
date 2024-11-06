import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useState } from 'react';

export default function SharedPosts({ posts }: { posts: any }) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const questUtils = useSelector(getQuestUtils);
  const [showAll, setShowAll] = useState(false);

  const visiblePosts = showAll ? posts : posts.slice(0, 5);

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Shared Posts</h1>
        {!isPublicProfile && (
          <Link to="/profile/shared-links" className="underline">
            Manage my Shared Posts
          </Link>
        )}
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">
        {visiblePosts?.map((post: any) => (
          <QuestionCardWithToggle
            key={post._id}
            questStartData={post}
            playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
          />
        ))}
        {!showAll && posts.length > 5 && (
          <button className="text-[19px] font-semibold leading-normal text-[#389CE3]" onClick={() => setShowAll(true)}>
            See All Posts
          </button>
        )}
      </div>
    </div>
  );
}
