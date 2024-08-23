import React, { useState } from 'react';
import { AddBadgeProps } from '../../../types/advanceAnalytics';
import { useSelector } from 'react-redux';
import { useSearchPosts } from '../../../services/mutations/quest';

export default function Target({ handleClose, questStartData }: AddBadgeProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useSearchPosts(search, persistedUserInfo);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <h1 className="my-2 text-center text-[10px] font-normal leading-[12px] text-accent-400 dark:text-gray-300 tablet:my-4 tablet:text-[16px] tablet:leading-[16px]">
        You can select a targeted option
      </h1>
      <div className="flex flex-col items-center justify-center gap-[15px]">
        <div className="relative inline-block w-full">
          <input
            value={search}
            placeholder="Search post here"
            onChange={handleSearch}
            className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
          />
          {/* {selectedOptions.length > 0 ? selectedOptions[selectedOptions.length - 1] : 'Select an option'}
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
              alt="arrow-right.svg"
              className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
            />
          </button> */}
          {data?.pages[0].length >= 0 && (
            <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
              {data?.pages.map((posts) =>
                posts.map((post: { id: number; Question: string }) => (
                  <li
                    key={post.id}
                    className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                    onClick={() => {
                      // setSelectedOptions(post)
                    }}
                  >
                    {post.Question}
                  </li>
                )),
              )}
            </ul>
          )}
        </div>
        {questStartData.QuestAnswers.map((option: { id: number; question: string }) => (
          <div key={option.id} className="relative flex w-full justify-between rounded-[4.7px] tablet:rounded-[10px]">
            <div className="relative flex w-full items-center rounded-[5.387px] bg-white dark:bg-accent-100 tablet:rounded-[10px]">
              <div className="flex h-full min-h-[21.8px] w-3 min-w-[12px] items-center justify-center rounded-l-[5.387px] bg-white-500 dark:bg-gray-100 tablet:h-full tablet:min-h-[49px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px]" />
              <div className="flex h-full min-h-[21.8px] w-full justify-between rounded-r-[5.387px] border-y border-r border-white-500 pb-[5.7px] pl-2 pr-8 pt-[5.6px] dark:border-gray-100 tablet:h-full tablet:min-h-[49px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:py-3 tablet:pl-[18px] tablet:pr-16">
                <h1 className="text-[8.52px] font-normal leading-[10px] text-accent-600 dark:text-[#D3D3D3] tablet:text-[19px] tablet:leading-[19px]">
                  {option.question}
                </h1>
              </div>
            </div>
            <div id="custom-checkbox" className="absolute right-3 flex h-full items-center tablet:right-6">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[11.4px] w-[11.4px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                // checked={props.check}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
