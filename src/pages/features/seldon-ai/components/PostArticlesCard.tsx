import { Link } from 'react-router-dom';
import { PostArticlesCardProps } from '../../../../types/seldon';

export default function PostArticlesCard({ questStartData }: PostArticlesCardProps) {
  const { articles } = questStartData;

  function getTruncatedAbstract(abstract: string): string {
    const maxTextLength = 146;
    return abstract && abstract.length > maxTextLength ? abstract.slice(0, maxTextLength) + '...' : abstract || '';
  }

  return (
    <>
      {articles?.length > 0 && (
        <div className="border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
          <h4 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
            Articles related to this post
          </h4>
          <div className="flex w-full overflow-x-auto overflow-y-hidden">
            {articles?.map((article: any) => (
              <div
                key={article._id}
                className="my-2 flex w-full max-w-[160px] flex-col gap-[10px] rounded-lg border border-gray-250 p-2 tablet:my-5 tablet:max-w-[335px] tablet:gap-3 tablet:rounded-2xl tablet:border-2 tablet:p-4"
              >
                <h5 className="text-[10px] font-semibold leading-[10px] text-gray-900 dark:text-white-400 tablet:text-[1rem] tablet:leading-[1rem]">
                  {article.title}
                </h5>
                <div className="flex w-full justify-end">
                  <Link
                    to={`/r/${article._id}`}
                    className="text-[14px] font-normal leading-[121.4%] text-blue-200 hover:underline dark:text-blue-600"
                  >
                    Read
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
