import { useEffect, useState } from 'react';
import { useDebounce } from '../../../../utils/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestUtils } from '../../../../features/quest/utilsSlice';
import { GrClose } from 'react-icons/gr';
import { newsFeedFilters, updateNewsFeedSearch } from '../../../../features/news-feed/newsFeedSlice';

export default function NewsFeedSearch() {
  const dispatch = useDispatch();
  const questUtils = useSelector(getQuestUtils);
  const getNewsFeedFilters = useSelector(newsFeedFilters);
  const [newsFeedSearch, setNewsFeedSearch] = useState('');

  const handleNewsFeedSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsFeedSearch(e.target.value);
  };

  const debouncedNewsFeedSearch = useDebounce(newsFeedSearch, 1000);

  useEffect(() => {
    dispatch(updateNewsFeedSearch(debouncedNewsFeedSearch));
  }, [debouncedNewsFeedSearch]);

  useEffect(() => {
    if (getNewsFeedFilters.searchData === '') {
      setNewsFeedSearch('');
    }
  }, [getNewsFeedFilters.searchData]);

  return (
    <>
      {location.pathname === '/news' && questUtils.areNewsFeed && (
        <div className="mx-4 my-2 h-fit w-[128px] rounded-[3.55px] bg-white dark:border dark:border-gray-100 dark:bg-gray-200 laptop:my-[15px] laptop:ml-[31px] laptop:block laptop:w-[18.75rem] laptop:min-w-[18.75rem] laptop:rounded-[15px] laptop:py-[23px] laptop:pl-[1.3rem] laptop:pr-[2.1rem]">
          <div className="relative">
            <div className="relative h-[18px] w-full laptop:h-[45px]">
              <input
                type="text"
                id="floating_outlined"
                className="peer block h-full w-full appearance-none rounded-[3.55px] border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-[6px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-gray-300 dark:focus:border-blue-500 tablet:text-[18.23px] laptop:rounded-[10px] laptop:border-2 laptop:text-sm"
                value={newsFeedSearch}
                placeholder=""
                onChange={handleNewsFeedSearch}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-[8.33px] text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] laptop:text-sm rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Search
              </label>
            </div>
            {getNewsFeedFilters.searchData && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => {
                  dispatch(updateNewsFeedSearch(''));
                }}
              >
                <GrClose className="size-2 text-[#ACACAC] dark:text-white laptop:size-4" />
              </button>
            )}
            {!getNewsFeedFilters.searchData && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                alt="search"
                className="absolute right-3 top-1/2 size-2 -translate-y-1/2 laptop:size-4"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
