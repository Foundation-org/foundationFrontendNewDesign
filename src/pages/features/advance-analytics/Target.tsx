import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { TextareaAutosize } from '@mui/material';
import { Button } from '../../../components/ui/Button';
import { searchPosts } from '../../../services/api/listsApi';
import { AddBadgeProps } from '../../../types/advanceAnalytics';
import { useAnalyzeTargetMutation } from '../../../services/mutations/advance-analytics';
import SelectionOption from '../../../components/SelectionOption';
import QuestionCardWithToggle from '../../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { targetDualOptions } from '../../../constants/advanceAnalytics';
import { useDebounce } from '../../../utils/useDebounce';

export default function Target({ handleClose, questStartData, update, selectedItem }: AddBadgeProps) {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [searchPost, setSearchPost] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchPostLoad, setSearchPostLoad] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>([]);
  const debouncedSearch = useDebounce(searchPost, 1000);
  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzeTargetMutation({ handleClose });

  useEffect(() => {
    const handleSearchPost = async () => {
      setSearchPostLoad(true);
      if (debouncedSearch) {
        const resp = await searchPosts(debouncedSearch, persistedUserInfo.uuid);
        setSearchResult(resp?.data);
      }
      setSearchPostLoad(false);
    };

    handleSearchPost();
  }, [debouncedSearch]);

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

  function filterDualOptions(advanceAnalytics: any[], dualOptions: Record<string, any[]>): Record<string, any[]> {
    return Object.keys(dualOptions)?.reduce((acc: any, key: string) => {
      // Filter out options that match any item in the targetedOptionsArray
      const filteredOptions = dualOptions[key].filter((option: any) => {
        return !advanceAnalytics?.some((analytic: any) => analytic?.targetedOptionsArray?.includes(option.question));
      });

      // Add the filtered options to the result object
      if (filteredOptions.length > 0) {
        acc[key] = filteredOptions;
      }

      return acc;
    }, {});
  }

  function filterQuestAnswers(questAnswers: any[], advanceAnalytics: any[]): any[] {
    return questAnswers?.filter((answer: any) => {
      // Check if the question in QuestAnswers does not exist in any targetedOptionsArray in advanceAnalytics
      return !advanceAnalytics?.some((analytic: any) => analytic?.targetedOptionsArray?.includes(answer.question));
    });
  }

  return (
    <div className="flex flex-col">
      <h1 className="summary-text my-2 text-center tablet:my-4">You can select a targeted option</h1>
      <div className="flex flex-col items-center justify-center gap-[15px]">
        <div className="relative w-full rounded-[5.387px] border border-white-500 dark:border-gray-100 tablet:rounded-[10px] tablet:border-[3px]">
          <TextareaAutosize
            value={selectedPost?.Question ?? searchPost}
            placeholder="Search Post"
            className="flex w-full resize-none items-center rounded-[5.387px] bg-white px-2 py-[6px] text-[10px] font-normal leading-[0.625rem] text-accent-600 focus-visible:outline-none dark:border-gray-100 dark:bg-transparent dark:text-gray-300 tablet:rounded-[10px] tablet:px-4 tablet:py-3 tablet:text-[20px] tablet:leading-[20px]"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setSelectedPost(null);
              setSearchPost(e.target.value);
            }}
          />
          {searchPost !== '' &&
            (searchPostLoad ? (
              <div className="flex w-full items-center justify-center py-6">
                <FaSpinner className="size-6 animate-spin text-blue-200 tablet:size-16" />
              </div>
            ) : (
              <ul className="absolute z-10 h-fit max-h-80 w-full overflow-y-auto border border-white-500 bg-white text-[10px] font-medium leading-normal text-[#707175] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:max-h-96 tablet:rounded-b-[10px] tablet:border-[3px] tablet:text-[15.7px]">
                {searchResult?.map((post: any) => (
                  <li
                    key={post._id}
                    className="cursor-pointer px-4 py-[6px] tablet:py-2"
                    onClick={() => {
                      setSearchPost('');
                      setSearchResult([]);
                      setSelectedPost(post);
                    }}
                  >
                    <QuestionCardWithToggle questStartData={post} />
                  </li>
                ))}
              </ul>
            ))}
        </div>

        {/* {selectedPost?.Question && (
          <div className="max-h-[40dvh] w-full overflow-y-auto">
            <QuestionCardWithToggle questStartData={selectedPost} />
          </div>
        )} */}

        {selectedPost?.whichTypeQuestion === 'yes/no' ||
        selectedPost?.whichTypeQuestion === 'agree/disagree' ||
        selectedPost?.whichTypeQuestion === 'like/dislike' ? (
          <ul className="flex max-h-[112px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:gap-[10px]">
            {filterDualOptions(questStartData.advanceAnalytics, targetDualOptions)[selectedPost?.whichTypeQuestion]
              ?.length > 0 ? (
              filterDualOptions(questStartData.advanceAnalytics, targetDualOptions)[
                selectedPost?.whichTypeQuestion
              ]?.map((item) => (
                <SelectionOption
                  key={item.id}
                  data={item}
                  selected={selectedOption}
                  handleSelection={handleOptionSelection}
                />
              ))
            ) : (
              <p className="text-center text-[8px] tablet:text-[16px]">No options available to target</p>
            )}
          </ul>
        ) : (
          selectedPost?.QuestAnswers.length > 0 && (
            <ul className="flex max-h-[112px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:gap-[10px]">
              {filterQuestAnswers(selectedPost?.QuestAnswers || [], questStartData.advanceAnalytics).length > 0 ? (
                filterQuestAnswers(selectedPost?.QuestAnswers || [], questStartData.advanceAnalytics).map(
                  (post: any) => (
                    <SelectionOption
                      key={post._id}
                      data={post}
                      selected={selectedOption}
                      handleSelection={handleOptionSelection}
                    />
                  ),
                )
              ) : (
                <p className="text-center text-[8px] tablet:text-[16px]">No options available to target</p>
              )}
            </ul>
          )
        )}
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          variant={selectedOption.length <= 0 ? 'submit-hollow' : 'submit'}
          className=""
          disabled={isPending || selectedOption.length <= 0}
          rounded={false}
          onClick={() => {
            const modifiedArray = selectedOption.map((item: { question: string }) => item.question);

            handleAnalyzePost({
              userUuid: persistedUserInfo.uuid,
              questForeignKey: questStartData._id,
              targetedOptionsArray: modifiedArray,
              targetedQuestForeignKey: selectedPost._id,
              id: update ? selectedItem?._id : null,
              order: update ? selectedItem?.order : null,
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
