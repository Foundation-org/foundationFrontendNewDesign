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
import { Element } from 'react-scroll';

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
          sources: seldonsData.sources,
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
    try {
      await navigator.clipboard.writeText(`${protocol}//${host}/r/${id}`);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };



  return (
    <Element name="posts-ideas" className="space-y-4">
      {!seldonsData.debug && suggestedPosts.length >= 1 && (
        <>
          <div className="space-y-1">
            <h1 className="text-center text-[16px] font-bold tablet:text-[24px]">Inspired by this post?</h1>{' '}
            <h5 className="text-center text-[14px] tablet:text-[20px]">
              Check out these post ideas that can get people engaged and FDX in your portfolio!
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
                      state={{ postData: item, articleId: location.pathname.startsWith('/r') ? seldonsData?._id : seldonsData.articleId }}
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
        className={`${location.pathname.includes('/r') || seldonsData.articleId ? 'justify-center' : 'justify-between'} flex w-full items-center gap-4`}
      >
        {!location.pathname.includes('/r') && !seldonsData.articleId ? (
          <Button
            variant="g-submit"
            className="w-full"
            rounded
            onClick={() => {
              handleUpdateArticle();
            }}
          >
            Update
          </Button>
        ) : null}
        <Button
          variant="submit"
          className={`${location.pathname.includes('/r') || seldonsData.articleId ? 'min-w-[152px] tablet:min-w-[315px]' : 'w-full'}`}
          rounded
          disabled={isPublishPending}
          onClick={() => {
            if (location.pathname.startsWith('/r/') || seldonsData.articleId) {
              copyToClipboard();
              showToast('success', 'copyLink');
            } else {
              handlePublishArticle({
                userUuid: persistedUserInfo.uuid,
                prompt: seldonState.question,
                title: seldonsData.title,
                abstract: seldonsData.abstract,
                groundBreakingFindings: seldonsData.groundBreakingFindings,
                suggestion: seldonsData.suggestions,
                source: seldonsData.sources,
                seoSummary: seldonsData.seoSummary,
                discussion: seldonsData.discussion,
                conclusion: seldonsData.conclusion,
              } as any);
            }
          }}
        >
          {location.pathname.startsWith('/r/') || seldonsData.articleId ? (
            'Share Article'
          ) : isPublishPending ? (
            <FaSpinner className="animate-spin text-[#EAEAEA]" />
          ) : (
            'Publish Article'
          )}
        </Button>
      </div>
    </Element>
  );
}
