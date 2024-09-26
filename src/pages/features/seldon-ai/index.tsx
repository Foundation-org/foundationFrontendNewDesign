import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaCircleArrowUp } from 'react-icons/fa6';
import { PromptResponse } from '../../../types/seldon';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../../../services/api/seldon';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useChatGptDataMutation } from '../../../services/mutations/seldon-ai';
import { getSeldonState, handleSeldonInput } from '../../../features/seldon-ai/seldonSlice';
import Markdown from 'react-markdown';
import SourcePosts from './components/SourcePosts';
import SeldonInputs from './components/SeldonInputs';
import SuggestedPosts from './components/SuggestedPosts';
import DotsLoading from '../../../components/ui/DotsLoading';

export default function SeldonAi() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const articleId = params.get('articleId');
  const seldonState = useSelector(getSeldonState);
  const [promptResponse, setPromptResponse] = useState<PromptResponse | null>(null);
  const [promptSources, setPromptSources] = useState([]);
  const [promptDebug, setPromptDebug] = useState('');

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticles(articleId),
    enabled: !!articleId,
  });

  useEffect(() => {
    setPromptResponse({ ...apiResponse?.data, articleId });
    setPromptSources(apiResponse?.data.source);
  }, [apiResponse]);

  const { mutateAsync: handleSendPrompt, isPending } = useChatGptDataMutation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await handleSendPrompt({
        params: seldonState,
      } as any);

      if (response?.status === 200) {
        localStorage.setItem('seldomResp', JSON.stringify(response?.data?.response));
        localStorage.setItem('seldonIds', JSON.stringify(response?.data?.source));
        localStorage.setItem('seldonDebug', JSON.stringify(response?.data?.debug));

        const ids = response.data?.source
          .filter((fileName: string) => fileName.startsWith('post_'))
          .map((fileName: any) => fileName.match(/post_(\w+)\.pdf/)[1]);

        setPromptResponse(response.data.response);
        setPromptSources(ids);
        setPromptDebug(response.data?.debug);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  useEffect(() => {
    const storedIds = localStorage.getItem('seldonIds');

    if (storedIds) {
      try {
        const ids = JSON.parse(storedIds)
          .filter((fileName: string) => fileName.startsWith('post_'))
          .map((fileName: string) => {
            const match = fileName.match(/post_(\w+)\.pdf/);
            return match ? match[1] : null;
          })
          .filter((id: string | null) => id !== null);

        setPromptSources(ids);
      } catch (error) {
        console.error('Failed to parse JSON from localStorage:', error);
        setPromptSources([]);
      }
    }
  }, [localStorage.getItem('seldonIds')]);

  useEffect(() => {
    const storedResponse = localStorage.getItem('seldomResp');

    if (storedResponse) {
      try {
        setPromptResponse(JSON.parse(storedResponse));
      } catch (error) {
        console.error('Failed to parse JSON from localStorage:', error);
        setPromptResponse(null);
      }
    }
  }, [localStorage.getItem('seldomResp')]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <div className="mx-auto mb-[10px] rounded-[10px] px-4 tablet:mb-[15px] tablet:max-w-[730px] tablet:px-0">
      <div className="mb-3 block laptop:hidden">
        <SeldonInputs />
      </div>
      <form className="relative flex gap-4" onSubmit={handleFormSubmit}>
        <TextareaAutosize
          className="focus:shadow-outline w-full resize-none appearance-none rounded-lg border bg-white py-1.5 pl-3 pr-12 text-[14px] leading-[14px] text-gray-900 shadow focus:outline-none dark:bg-gray-200 tablet:rounded-[10px] tablet:text-[20px] tablet:leading-tight"
          placeholder="Message Seldon"
          onChange={(e) => {
            dispatch(handleSeldonInput({ name: 'question', value: e.target.value }));
          }}
          onKeyDown={handleKeyDown}
          value={seldonState.question}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 size-4 -translate-y-1/2 tablet:bottom-2.5 tablet:size-6"
        >
          <FaCircleArrowUp className="size-4 rotate-180 text-gray-900 hover:text-black tablet:size-6" />
        </button>
      </form>

      {isPending ? (
        <DotsLoading />
      ) : (
        <div className="flex flex-col gap-4 pt-4 tablet:pt-8">
          {promptDebug ? (
            <div className="mt-4 rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mt-8 tablet:py-[18.73px]">
              <h1 className="text-[16px] font-bold">Debug Mode:</h1>
              <br></br>
              <Markdown>{promptDebug}</Markdown>
            </div>
          ) : (
            promptResponse && (
              <>
                <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
                  <h1 className="text-[12px] font-bold tablet:text-[16px]">{promptResponse?.title}</h1>
                </div>
                <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
                  <h1 className="text-[16px] font-bold">Abstract:</h1>
                  <p className="text-[12px] tablet:text-[16px]">{promptResponse?.abstract}</p>
                </div>
                <div className="rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
                  <h1 className="text-[16px] font-bold">Findings:</h1>
                  <ul className="space-y-4">
                    {promptResponse?.findings?.map((item, index) => (
                      <>
                        <li key={index} className="text-[12px] tablet:text-[16px]">
                          <strong className="text-[12px] font-bold tablet:text-[16px]">{item.heading}</strong>:{' '}
                          {item.content}
                        </li>
                      </>
                    ))}
                  </ul>
                </div>
              </>
            )
          )}
          <h1 className="text-[16px] font-bold">Sourced Posts:</h1>
          <SourcePosts promptSources={promptSources} setPromptSources={setPromptSources} />
          {!promptDebug && (
            <SuggestedPosts
              promptResponse={promptResponse!}
              promptSources={promptSources}
              articleId={promptResponse?.articleId || null}
            />
          )}
        </div>
      )}
    </div>
  );
}
