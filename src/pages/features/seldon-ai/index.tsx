import { FaCircleArrowUp } from 'react-icons/fa6';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useDispatch, useSelector } from 'react-redux';
import { getSeldonState, handleSeldonInput } from '../../../features/seldon-ai/seldonSlice';
import { useChatGptDataMutation } from '../../../services/mutations/seldon-ai';
import { useState } from 'react';
import Markdown from 'react-markdown';

export default function SeldonAi() {
  const dispatch = useDispatch();
  const seldonState = useSelector(getSeldonState);
  const [promptResponse, setPromptResponse] = useState('');

  const { mutateAsync: handleSendPrompt, isPending } = useChatGptDataMutation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await handleSendPrompt({
        params: seldonState,
      } as any);

      if (response?.status === 200) {
        setPromptResponse(response.data);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
    dispatch(handleSeldonInput({ name: 'question', value: '' }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <div className="mx-auto mb-[10px] rounded-[10px] tablet:mb-[15px] tablet:max-w-[730px]">
      <form className="relative flex gap-4" onSubmit={handleFormSubmit}>
        <TextareaAutosize
          className="focus:shadow-outline w-full resize-none appearance-none rounded-[10px] border bg-white py-2 pl-3 pr-12 text-[20px] leading-tight text-gray-900 shadow focus:outline-none dark:bg-gray-200"
          placeholder="Message Seldon"
          onChange={(e) => {
            dispatch(handleSeldonInput({ name: 'question', value: e.target.value }));
          }}
          onKeyDown={handleKeyDown}
          value={seldonState.question}
        />
        <button type="submit" className="absolute bottom-2.5 right-4 size-6">
          <FaCircleArrowUp className="size-6 rotate-180 text-gray-900 hover:text-black" />
        </button>
      </form>

      {isPending ? (
        <div className="mt-8 flex items-center justify-center space-x-2 dark:invert">
          <span className="sr-only">Loading...</span>
          <div className="size-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.3s]"></div>
          <div className="size-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.15s]"></div>
          <div className="size-2 animate-bounce rounded-full bg-gray-900"></div>
        </div>
      ) : (
        promptResponse && (
          <div className="mt-8 rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
            <Markdown>{promptResponse}</Markdown>
          </div>
        )
      )}
    </div>
  );
}
