import { useNavigate } from 'react-router-dom';
import { formatDateMDY } from '../../../../utils/utils';
import { Button } from '../../../../components/ui/Button';
import { NewsFeedPropsType } from '../../../../types/news-feed';
import { useDispatch, useSelector } from 'react-redux';
import { setSeldonData } from '../../../../features/seldon-ai/seldonDataSlice';
import { handleSeldonInput } from '../../../../features/seldon-ai/seldonSlice';

export default function NewsFeedCard(props: NewsFeedPropsType) {
  const { data, innerRef } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));

  const handleUpdateArticle = () => {
    dispatch(
      setSeldonData({
        title: data?.title,
        abstract: data?.abstract,
        seoSummary: data?.seoSummary,
        groundBreakingFindings: data?.groundBreakingFindings,
        suggestions: data?.suggestions,
        source: data?.source,
        discussion: data?.discussion,
        conclusion: data?.conclusion,
        debug: '',
        articleId: data?._id,
        prompt: data?.prompt,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
      }),
    );
    dispatch(handleSeldonInput({ name: 'question', value: data?.prompt }));

    navigate('/seldon-ai');
  };

  return (
    <div
      ref={innerRef}
      className="h-full max-w-[730px] rounded-[12.3px] border-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[15px]"
    >
      {/* Header */}
      <div className="flex flex-col border-b border-gray-250 p-[0.57rem] tablet:border-b-[1.846px] tablet:px-[15px] tablet:py-3">
        <h4 className="text-[12.145px] font-semibold text-gray-150 dark:text-white tablet:text-[18px]">
          {data?.title}
        </h4>
      </div>
      {/* Body */}
      <div className="flex flex-col justify-between gap-2 px-3 pb-[15px] pt-2 tablet:gap-4 tablet:px-4 tablet:pb-6 tablet:pt-4">
        <p className="text-[10px] font-medium leading-[13.56px] text-accent-600 dark:text-white tablet:text-[17px] tablet:leading-normal">
          {data?.seoSummary}
        </p>
        <div className="flex w-full items-center justify-between gap-4">
          {isPseudoBadge ? (
            <Button
              variant={'g-submit'}
              className={'!laptop:px-0 bg-yellow-300 w-full whitespace-nowrap !px-0'}
              onClick={handleUpdateArticle}
            >
              Update Article
            </Button>
          ) : (
            <button className="w-full cursor-default">&#x200B;</button>
          )}
          <Button
            variant={'g-submit'}
            className={'!laptop:px-0 w-full whitespace-nowrap !px-0'}
            onClick={() => {
              navigate(`/r/${data?._id}`);
            }}
          >
            Read More
          </Button>
        </div>
      </div>
      {/* Footer */}
      <div className="relative flex items-center justify-end border-t border-gray-250 px-[0.57rem] py-[5px] tablet:border-t-[1.846px] tablet:px-5 tablet:py-3">
        <p className="text-[10px] font-normal text-[#9C9C9C] dark:text-white tablet:text-[20px]">
          Published {formatDateMDY(data.createdAt)}
        </p>
      </div>
    </div>
  );
}
