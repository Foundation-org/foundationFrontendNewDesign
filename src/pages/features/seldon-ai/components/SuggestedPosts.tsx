import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { parseQuestionsAndOptions } from '../../../../utils/seldon';
import { questionValidation } from '../../../../services/api/questsApi';
import { SuggestedPost, SuggestedPostsProps } from '../../../../types/seldon';
import { usePublishArticleMutation } from '../../../../services/mutations/seldon-ai';
import { addNewOption, addQuestion, setOptionsByArray } from '../../../../features/createQuest/createQuestSlice';
import DotsLoading from '../../../../components/ui/DotsLoading';
import showToast from '../../../../components/ui/Toast';

export default function SuggestedPosts({
  afterSuggestions,
  promptResponse,
  promptSources,
  title,
}: SuggestedPostsProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { protocol, host } = window.location;
  const [suggestedPosts, setSuggestedPosts] = useState<SuggestedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handlePublishArticle, isPending: isPublishPending } = usePublishArticleMutation();

  const checkDuplicatePost = async (value: string) => {
    try {
      const { errorMessage } = await questionValidation({
        question: value,
        queryType: 'yes/no',
      });

      return { question: value, errorMessage };
    } catch (err) {
      console.error('Error during question validation:', err);
      return { question: value, errorMessage: 'ERROR' }; // Handle or return a default error
    }
  };

  const processQuestions = async () => {
    setLoading(true);
    try {
      const processedQuestions = parseQuestionsAndOptions(afterSuggestions);

      const results = await Promise.all(
        processedQuestions.map(async (item) => {
          const { errorMessage } = await checkDuplicatePost(item.question);
          return { ...item, errorMessage };
        }),
      );

      // Filter out items with 'Duplication' error message
      const filteredQuestions = results.filter((item) => item.errorMessage !== 'DUPLICATION');

      setSuggestedPosts(filteredQuestions);
    } catch (err) {
      console.error('Error processing questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    processQuestions();
  }, [afterSuggestions]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${protocol}//${host}${location.pathname}`);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <>
      <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
        <h1 className="text-[16px] font-bold">New Post Suggestions:</h1>
        <div className="mt-4 flex flex-col gap-4">
          {loading ? (
            <DotsLoading />
          ) : (
            suggestedPosts?.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 tablet:gap-8">
                <div className="col-span-3">
                  <h5 className="text-[12px] font-semibold tablet:text-[16px]">
                    {index + 1} - {item.question}
                  </h5>
                  <ul className="flex gap-4">
                    {item.options.map((option, index) => (
                      <li key={index} className="text-[12px] tablet:text-[16px]">
                        {option}
                      </li>
                    ))}
                    {item.userCanAddOption && <li className="text-[12px] tablet:text-[16px]">Other</li>}
                  </ul>
                </div>
                <div className="col-span-1 flex w-full justify-end">
                  <Link
                    to={item.postType === 'yes/no' ? '/post/yes-no' : '/post'}
                    state={{ postData: item }}
                    className="whitespace-nowrap text-[12px] font-semibold text-blue-200 underline dark:text-blue-600 tablet:text-[16px]"
                    onClick={() => {
                      dispatch(addQuestion(item.question));
                      item.options.slice(0, item.options.length - 2).forEach((_, index) => {
                        dispatch(addNewOption(index));
                      });
                      dispatch(setOptionsByArray(item.options));
                    }}
                  >
                    Create Post
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <button className="w-full cursor-default">&#x200B;</button>
        <Button
          variant="submit"
          className="w-full"
          rounded
          disabled={isPublishPending}
          onClick={() => {
            if (location.pathname.startsWith('/r/')) {
              copyToClipboard();
              showToast('success', 'copyLink');
            } else {
              handlePublishArticle({
                userUuid: persistedUserInfo.uuid,
                body: promptResponse,
                source: promptSources,
                suggestion: suggestedPosts,
                title,
              } as any);
            }
          }}
        >
          {location.pathname.startsWith('/r/') ? (
            'Share Article'
          ) : isPublishPending ? (
            <FaSpinner className="animate-spin text-[#EAEAEA]" />
          ) : (
            'Publish Article'
          )}
        </Button>
      </div>
    </>
  );
}
