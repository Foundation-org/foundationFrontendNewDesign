import { Link } from 'react-scroll';
import { FaCircleArrowUp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useChatGptDataMutation } from '../../../services/mutations/seldon-ai';
import { getSeldonState, handleSeldonInput } from '../../../features/seldon-ai/seldonSlice';
import { addDebug, getSeldonDataStates, setSeldonData } from '../../../features/seldon-ai/seldonDataSlice';
import Markdown from 'react-markdown';
import SourcePosts from './components/SourcePosts';
import SeldonInputs from './components/SeldonInputs';
import SuggestedPosts from './components/SuggestedPosts';
import DotsLoading from '../../../components/ui/DotsLoading';
import { formatDateMDY } from '../../../utils/utils';

export default function SeldonAi() {
  const dispatch = useDispatch();
  const seldonState = useSelector(getSeldonState);
  const getSeldonDataState = useSelector(getSeldonDataStates);

  const { mutateAsync: handleSendPrompt, isPending } = useChatGptDataMutation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await handleSendPrompt({
        params: seldonState,
      } as any);

      if (response?.status === 200) {
        const ids = response.data?.source
          .filter((fileName: string) => fileName.startsWith('post_'))
          .map((fileName: any) => fileName.match(/post_(\w+)\.pdf/)[1]);

        if (response.data.debug) {
          dispatch(addDebug({ debug: response.data.debug, sources: ids }));
        } else {
          dispatch(
            setSeldonData({
              debug: response.data.debug,
              title: response.data.response.title,
              abstract: response.data.response.abstract,
              seoSummary: response.data.response.seoSummary,
              findings: response.data.response.findings,
              suggestions: response.data.response.suggestions,
              createdAt: new Date().toISOString(),
              sources: ids,
              articleId: response.data.response?.articleId ? response.data.response.articleId : '',
              prompt: seldonState.question,
            }),
          );
        }
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
        <div id="containerElement2" className="flex flex-col gap-4 pt-4 text-gray-500 dark:text-white tablet:pt-8">
          {getSeldonDataState.debug ? (
            <div className="mt-4 rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-[#85898C] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mt-8 tablet:py-[18.73px]">
              <h1 className="text-[16px] font-bold">Debug Mode:</h1>
              <br></br>
              <Markdown>{getSeldonDataState.debug}</Markdown>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-[16px] font-bold tablet:text-[24px]">{getSeldonDataState.title}</h1>
                <h5 className="text-[14px] tablet:text-[20px]">Foundation News</h5>
                <p className="text-[10px] tablet:text-[16px]">Posted: {formatDateMDY(getSeldonDataState.createdAt)}</p>
              </div>
              <p className="text-[12px] tablet:text-[20px]">
                <strong>Seo Summary </strong>
                {getSeldonDataState.seoSummary}
              </p>
              <p className="text-[12px] tablet:text-[20px]">{getSeldonDataState.abstract}</p>
              <div className="flex flex-col gap-2 tablet:mt-[10px] tablet:gap-5">
                <Link
                  to="posts-list"
                  containerId="containerElement2"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                >
                  View posts that informed this article
                </Link>
                <Link
                  to="posts-ideas"
                  containerId="containerElement2"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600 tablet:-mt-3 tablet:text-[20px]"
                >
                  Get post ideas and earn FDX
                </Link>
              </div>
              <h1 className="text-[16px] font-bold tablet:text-[24px]">Findings</h1>
              <ol className="list-disc space-y-4">
                {getSeldonDataState.findings.map((item: { heading: string; content: string }, index: number) => (
                  <li key={index} className="ml-6 text-[12px] tablet:ml-10 tablet:text-[20px]">
                    <strong className="font-bold">{item.heading}:</strong> {item.content}
                  </li>
                ))}
              </ol>
            </>
          )}

          <SourcePosts />
          <SuggestedPosts />
        </div>
      )}
    </div>
  );
}
