import ProfileCard from './ProfileCard';
import SharedPosts from './SharedPosts';
import SharedLists from './SharedLists';

export default function UserProfile() {
  return (
    <div className="mx-auto my-3 flex max-w-[730px] flex-col gap-3 tablet:my-[15px] tablet:gap-6">
      <ProfileCard />
      <SharedPosts />
      <SharedLists />
    </div>
  );
}
