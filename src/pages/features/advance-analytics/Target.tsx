import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { TextareaAutosize } from '@mui/material';
import { Button } from '../../../components/ui/Button';
import { searchPosts } from '../../../services/api/listsApi';
import { AddBadgeProps } from '../../../types/advanceAnalytics';
import SelectionOption from '../../../components/SelectionOption';
import { useAnalyzeTargetMutation } from '../../../services/mutations/advance-analytics';

export default function Target({ handleClose, questStartData }: AddBadgeProps) {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [searchPost, setSearchPost] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [selectedOption, setSelectedOption] = useState<any>([]);

  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzeTargetMutation({ handleClose });

  useEffect(() => {
    const handleSearchPost = async () => {
      if (searchPost) {
        const resp = await searchPosts(searchPost, persistedUserInfo.uuid);
        setSearchResult(resp?.data);
      }
    };

    handleSearchPost();
  }, [searchPost]);

  const handleOptionSelection = (data: any) => {
    setSelectedOption((prevSelected: any[]) => {
      const isSelected = prevSelected.some((optionId: any) => optionId.id === data.id);

      if (isSelected) {
        return prevSelected.filter((optionId: any) => optionId.id !== data.id);
      } else {
        return [...prevSelected, data];
      }
    });
  };

  return (
    <div className="flex flex-col">
      <h1 className="my-2 text-center text-[10px] font-normal leading-[12px] text-accent-400 dark:text-gray-300 tablet:my-4 tablet:text-[16px] tablet:leading-[16px]">
        You can select a targeted option
      </h1>
      <div className="flex flex-col items-center justify-center gap-[15px]">
        <div className="relative w-full rounded-[5.387px] border border-white-500 dark:border-gray-100 tablet:rounded-[10px] tablet:border-[3px]">
          <TextareaAutosize
            value={selectedPost?.Question ?? searchPost}
            placeholder="Search Post"
            className="flex w-full resize-none items-center rounded-[5.387px] bg-white px-[9.24px] py-[6.84px] pr-2 text-[0.625rem] font-normal leading-[0.625rem] text-[#7C7C7C] focus-visible:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:px-[11px] tablet:py-3 tablet:text-[18px] tablet:leading-[18px]"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setSelectedPost(null);
              setSearchPost(e.target.value);
            }}
          />
          <ul className="absolute z-10 h-fit max-h-56 w-full overflow-y-auto border text-[10px] font-medium leading-normal text-[#707175] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:rounded-b-[10px] tablet:text-[15.7px]">
            {searchPost !== '' &&
              searchResult?.map((post: any) => (
                <li
                  key={post._id}
                  className="cursor-pointer border-b border-white-500 px-4 py-[6px] last:border-b-0 dark:border-gray-100 tablet:border-b-[3px] tablet:py-2"
                  onClick={() => {
                    setSearchPost('');
                    setSearchResult([]);
                    setSelectedPost(post);
                  }}
                >
                  {post.Question}
                </li>
              ))}
          </ul>
        </div>
        {selectedPost?.Question && (
          <ul className="flex w-full flex-col gap-[5.7px] tablet:gap-[10px]">
            {selectedPost?.QuestAnswers.map((post: any) => (
              <SelectionOption
                key={post._id}
                data={post}
                selected={selectedOption}
                handleSelection={handleOptionSelection}
              />
            ))}
          </ul>
        )}
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          variant={selectedOption.length <= 0 ? 'submit-hollow' : 'submit'}
          className=""
          disabled={isPending || selectedOption.length <= 0}
          rounded={false}
          onClick={() => {
            handleAnalyzePost({
              userUuid: persistedUserInfo.uuid,
              questForeignKey: questStartData._id,
              hiddenOptionsArray: selectedOption,
              targetQuestForeignKey: selectedPost._id,
              actionType: 'create',
            } as any);
          }}
        >
          {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Target'}
        </Button>
      </div>
    </div>
  );
}
