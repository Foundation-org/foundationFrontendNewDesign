import { useState } from 'react';
import { FaCircleArrowUp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { processPromptResponse } from '../../../utils/seldon';
import { getSeldonState, handleSeldonInput } from '../../../features/seldon-ai/seldonSlice';
import { useChatGptDataMutation } from '../../../services/mutations/seldon-ai';
import Markdown from 'react-markdown';
import SeldonInputs from './components/SeldonInputs';
import SuggestedPosts from './components/SuggestedPosts';
import ThreeDotsLoading from '../../../components/ui/threedotsLoading';
import SourcePosts from './components/SourcePosts';

export default function SeldonAi() {
  const dispatch = useDispatch();
  const seldonState = useSelector(getSeldonState);
  const [promptResponse, setPromptResponse] = useState(localStorage.getItem('seldomResp') || '');
  const [promptSources, setPromptSources] = useState([]);

  const { mutateAsync: handleSendPrompt, isPending } = useChatGptDataMutation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await handleSendPrompt({
        params: seldonState,
      } as any);

      // console.log(response.data);
      if (response?.status === 200) {
        localStorage.setItem('seldomResp', response.data.response);
        setPromptResponse(response.data.response);

        const ids = response.data?.source
          .filter((fileName: string) => fileName.startsWith('post_'))
          .map((fileName: any) => fileName.match(/post_(\w+)\.pdf/)[1]); // Extract the ID from the filename

        setPromptSources(ids);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  // const regex = /\**\s*survey suggestions[:\-]*\s*\**/i;
  // const parts = promptResponse.split(regex);
  // const beforeSuggestions = parts[0];
  // const afterSuggestions = parts[1] ? parts[1].trim() : '';

  // console.log('promptSources', promptSources);

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
        <ThreeDotsLoading />
      ) : (
        promptResponse && (
          <div className="flex flex-col gap-4">
            <div className="mt-4 rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mt-8 tablet:py-[18.73px]">
              <Markdown>{processPromptResponse(promptResponse).before}</Markdown>
            </div>
            <SuggestedPosts afterSuggestions={processPromptResponse(promptResponse).after} />
            <h1 className="text-[16px] font-bold">Sourced Posts:</h1>
            <SourcePosts />
          </div>
        )
      )}
    </div>
  );
}
