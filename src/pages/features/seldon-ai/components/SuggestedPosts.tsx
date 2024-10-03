import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { transformPromptSuggestions } from '../../../../utils/seldon';
import { questionValidation } from '../../../../services/api/questsApi';
import { SuggestedPost } from '../../../../types/seldon';
import { usePublishArticleMutation, useChatGptDataMutation } from '../../../../services/mutations/seldon-ai';
import {
  addNewOption,
  addQuestion,
  delOption,
  resetCreateQuest,
  setOptionsByArray,
} from '../../../../features/createQuest/createQuestSlice';
import DotsLoading from '../../../../components/ui/DotsLoading';
import showToast from '../../../../components/ui/Toast';
import { getSeldonState } from '../../../../features/seldon-ai/seldonSlice';
import { getSeldonDataStates, setSeldonData } from '../../../../features/seldon-ai/seldonDataSlice';
import { shareArticles } from '../../../../services/api/seldon';
import { useMutation } from '@tanstack/react-query';

export default function SuggestedPosts({ apiResp }: { apiResp?: any }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const seldonState = useSelector(getSeldonState);
  const getSeldonDataState = useSelector(getSeldonDataStates);
  const [seldonsData, setSeldonsData] = useState(location.pathname.startsWith('/r') ? apiResp : getSeldonDataState);
  const { protocol, host } = window.location;
  const [suggestedPosts, setSuggestedPosts] = useState<SuggestedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handlePublishArticle, isPending: isPublishPending } = usePublishArticleMutation();

  const { mutateAsync: ShareArticle } = useMutation({
    mutationFn: shareArticles,
  });

  useEffect(() => {
    if (location.pathname.startsWith('/r')) {
      setSeldonsData(apiResp);
    } else {
      setSeldonsData(getSeldonDataState);
    }
  }, [apiResp, getSeldonDataState]);

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
      const processedQuestions = transformPromptSuggestions(seldonsData.suggestions);
      const results = await Promise.all(
        processedQuestions?.map(async (item) => {
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
    if (seldonsData.suggestions) {
      processQuestions();
    }
  }, [seldonsData.suggestions]);

  const { mutateAsync: handleSendPrompt, isPending } = useChatGptDataMutation();

  const handleUpdateArticle = async () => {
    try {
      const response = await handleSendPrompt({
        params: {
          ...seldonState,
          title: seldonsData.title,
          sources: seldonsData.source,
        },
      } as any);

      if (response?.status === 200) {
        const ids = response.data?.source
          .filter((fileName: string) => fileName.startsWith('post_'))
          .map((fileName: any) => fileName.match(/post_(\w+)\.pdf/)[1]);

        dispatch(
          setSeldonData({
            title: response.data.response.title,
            abstract: response.data.response.abstract,
            seoSummary: response.data.response.seoSummary,
            groundBreakingFindings: response.data.response.groundBreakingFindings,
            suggestions: response.data.response.suggestions,
            source: ids,
            debug: response.data?.debug,
            articleId: response.data?.response.articleId,
            prompt: '',
          }),
        );
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const copyToClipboard = async () => {
    const id = location.pathname.startsWith('/r') ? seldonsData?._id : seldonsData.articleId;
    ShareArticle(id);
    try {
      await navigator.clipboard.writeText(`${protocol}//${host}/r/${id}`);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <div
      id="posts-ideas"
      className={`mt-4 flex flex-col gap-4 ${suggestedPosts.length >= 1 && 'border-t-2'} border-gray-100 pt-8 tablet:mt-4 tablet:pt-10`}
    >
      {!seldonsData.debug && suggestedPosts.length >= 1 && (
        <>
          <div className="space-y-1">
            <h1 className="text-center text-[16px] font-bold tablet:text-[24px]">Contribute to the research</h1>{' '}
            <h5 className="text-center text-[14px] tablet:text-[20px]">
              Create one of these AI generated posts where results can improve, alter or validate the findings within
              the article.
            </h5>
          </div>
          <div className="space-y-4">
            {loading ? (
              <DotsLoading />
            ) : (
              suggestedPosts?.map((item, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]"
                >
                  <div className="col-span-3">
                    <h5 className="text-[12px] font-semibold tablet:text-[16px]">{item.question}</h5>
                  </div>
                  <div className="col-span-1 flex w-full justify-end">
                    <Link
                      to={item.postType === 'yes/no' ? '/post/yes-no' : '/post'}
                      state={{
                        postData: item,
                        articleId: location.pathname.startsWith('/r') ? seldonsData?._id : seldonsData.articleId,
                      }}
                      className="whitespace-nowrap text-[12px] font-semibold text-blue-200 underline dark:text-blue-600 tablet:text-[16px]"
                      onClick={() => {
                        dispatch(resetCreateQuest());
                        dispatch(addQuestion(item.question));
                        item.options.slice(0, item.options.length - 2).forEach((_, index) => {
                          dispatch(addNewOption(index));
                        });
                        dispatch(setOptionsByArray(item.options));
                      }}
                    >
                      Create Post {'>'}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      <div
        className={`${location.pathname.includes('/r') ? 'justify-center' : 'justify-between'} flex w-full items-center gap-4`}
      >
        {location.pathname.includes('/r') ? (
          <Button
            variant="submit"
            className="min-w-[152px] tablet:min-w-[315px]"
            rounded
            onClick={() => {
              copyToClipboard();
              showToast('success', 'copyLink');
            }}
            disabled={isPending}
          >
            {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : ' Share Article'}
          </Button>
        ) : (
          <>
            <Button
              variant="g-submit"
              className="w-full"
              rounded
              onClick={() => {
                handleUpdateArticle();
              }}
              disabled={isPending}
            >
              {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : ' Update'}
            </Button>
            <Button
              variant="submit"
              className="w-full"
              rounded
              disabled={isPublishPending}
              onClick={() => {
                handlePublishArticle({
                  userUuid: persistedUserInfo.uuid,
                  prompt: seldonState.question,
                  title: seldonsData.title,
                  abstract: seldonsData.abstract,
                  groundBreakingFindings: seldonsData.groundBreakingFindings,
                  suggestion: seldonsData.suggestions,
                  source: seldonsData.source,
                  seoSummary: seldonsData.seoSummary,
                  discussion: seldonsData.discussion,
                  conclusion: seldonsData.conclusion,
                  settings: seldonState,
                } as any);
              }}
            >
              {isPublishPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Publish Article'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
