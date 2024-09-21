import { Link } from 'react-router-dom';
import { extractSections, processPromptResponse } from '../../../../utils/seldon';
import { toast } from 'sonner';

interface PropsType {
  questStartData: any;
}

export default function PostArticlesCard({ questStartData }: PropsType) {
  const { articles } = questStartData;

  function getTruncatedAbstract(articleBody: string): string {
    const maxTextLength = 146;
    const abstractText = extractSections(processPromptResponse(articleBody)?.before)?.abstract;

    return abstractText && abstractText.length > maxTextLength
      ? abstractText.slice(0, maxTextLength) + '...'
      : abstractText || '';
  }

  return (
    <>
      {articles?.length > 0 && (
        <div className="border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
          <h4 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
            Articles
          </h4>
          <div className="flex w-full overflow-x-auto overflow-y-hidden">
            {articles?.map((article: any) => (
              <div key={article._id} className="my-5 flex w-full min-w-full flex-col gap-3">
                <h5 className="text-[0.5rem] font-semibold leading-[0.5rem] text-gray-900 dark:text-white-400 tablet:text-[1rem] tablet:leading-[1rem]">
                  {extractSections(processPromptResponse(article.body).before).title}
                </h5>
                <p className="text-[0.5rem] leading-[0.5rem] text-gray-900 dark:text-white-400 tablet:text-[1rem] tablet:leading-[1rem]">
                  {getTruncatedAbstract(article.body)}
                </p>
                <Link
                  to={`seldon-ai/r/${article._id}`}
                  state={{ articleId: article._id }}
                  className="text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   toast.warning('Feature coming soon');
                  // }}
                >
                  View Article
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
