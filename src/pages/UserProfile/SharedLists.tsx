import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ListCard from '../Dashboard/pages/Lists/components/ListCard';

export default function SharedLists({ lists }: { lists: any }) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [showAll, setShowAll] = useState(false);

  const visibleLists = showAll ? lists : lists.slice(0, 5);

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      <div className="flex h-[25px] w-full items-center justify-between bg-blue-200 px-5 text-[12px] font-medium text-white tablet:h-[43.2px] tablet:px-7 tablet:text-[18px]">
        <h1>Shared List</h1>
        {!isPublicProfile && (
          <Link to="/profile/lists" className="underline">
            Manage my Lists
          </Link>
        )}
      </div>
      <div className="flex w-full flex-col gap-3 tablet:gap-5">
        <ListCard listData={visibleLists} />
        {!showAll && lists.length > 5 && (
          <button className="text-[19px] font-semibold leading-normal text-[#389CE3]" onClick={() => setShowAll(true)}>
            See All Lists
          </button>
        )}
      </div>
    </div>
  );
}
