import { useQuery } from '@tanstack/react-query';
import { getQuestsCustom } from '../../../../services/api/questsApi';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../../../features/quest/utilsSlice';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../../../utils/useDebounce';
import { TextareaAutosize } from '@mui/material';
import { searchPosts } from '../../../../services/api/listsApi';
import DotsLoading from '../../../../components/ui/DotsLoading';
import QuestionCardWithToggle from '../../../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import { useLocation } from 'react-router-dom';

export default function SourcePosts({
  promptSources,
  setPromptSources,
}: {
  promptSources: string[];
  setPromptSources: any;
}) {
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchPost, setSearchPost] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchPostLoad, setSearchPostLoad] = useState(false);
  const debouncedSearch = useDebounce(searchPost, 1000);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const updateArticle = params.get('update-article');

  const transformSelectedPost = (selectedPost: any) => {
    setSelectedPost(null);
    const newId = selectedPost._id;
    let storedIds = localStorage.getItem('seldonIds');
    let seldonIdsArray = storedIds ? JSON.parse(storedIds) : [];
    if (!seldonIdsArray.includes(newId)) {
      seldonIdsArray.unshift(`post_${newId}`);
    }
    localStorage.setItem('seldonIds', JSON.stringify(seldonIdsArray));
    setPromptSources((prevPromptSources: string[]) => {
      if (!prevPromptSources.includes(newId)) {
        return [newId, ...prevPromptSources];
      }
      return prevPromptSources;
    });
  };

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

  const {
    data: sourcePosts,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['sourcePosts', promptSources],
    queryFn: () => getQuestsCustom({ ids: promptSources, uuid: persistedUserInfo.uuid }),
  });

  if (isError) {
    return <h1>No Posts Found</h1>;
  }

  return (
    <>
      {updateArticle && (
        <div className="relative w-full rounded-[5.387px] border border-white-500 dark:border-gray-100 tablet:rounded-[10px] tablet:border-[3px]">
          <TextareaAutosize
            value={(selectedPost && selectedPost?.Question) ?? searchPost}
            placeholder="Add more sources..."
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
              <ul className="h-fit max-h-80 w-full overflow-y-auto border border-white-500 bg-white text-[10px] font-medium leading-normal text-[#707175] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:max-h-96 tablet:rounded-b-[10px] tablet:border-[3px] tablet:text-[15.7px]">
                {searchResult?.map((post: any) => (
                  <li
                    key={post._id}
                    className="cursor-pointer px-4 py-[6px] tablet:py-2"
                    onClick={() => {
                      setSearchPost('');
                      setSearchResult([]);
                      transformSelectedPost(post);
                    }}
                  >
                    <QuestionCardWithToggle questStartData={post} />
                  </li>
                ))}
              </ul>
            ))}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {isFetching ? (
          <DotsLoading />
        ) : (
          sourcePosts?.map((post: any) => (
            <div className="relative">
              {updateArticle && promptSources.length > 1 && (
                <button
                  className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full bg-gray-100"
                  onClick={() => {
                    setPromptSources((prevPromptSources: string[]) =>
                      prevPromptSources.filter((id: string) => id !== post._id),
                    );
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/preferences/close.png`}
                    alt="close"
                    className="size-[10px] tablet:size-3.5"
                  />
                </button>
              )}
              <QuestionCardWithToggle
                key={post._id}
                questStartData={post}
                playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
