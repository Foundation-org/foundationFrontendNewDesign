import { Link } from 'react-router-dom';

export default function SharedLists({ lists }: { lists: any }) {
  // console.log('lists', lists);

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Shared List</h1>
        <Link to="/user/profile/shared-posts/create" className="underline">
          Manage my Shared Lists
        </Link>
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">Content</div>
    </div>
  );
}
