import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTimeAgo } from '../../../../utils/utils';
import { NewsFeedPropsType } from '../../../../types/news-feed';
import { Button } from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getArticleStates, setArticleData } from '../../../../features/seldon-ai/articleSlice';
import { setSeldonData } from '../../../../features/seldon-ai/seldonDataSlice';
import { handleSeldonInput } from '../../../../features/seldon-ai/seldonSlice';

export default function NewsFeedCard(props: NewsFeedPropsType) {
  const { data, innerRef } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const timeAgo = useMemo(() => calculateTimeAgo(data.createdAt), [data?.createdAt]);
  const getArticleData = useSelector(getArticleStates);

  const handleUpdateArticle = () => {
    dispatch(
      setSeldonData({
        title: data?.title,
        abstract: data?.abstract,
        seoSummary: data?.seoSummary,
        findings: data?.findings,
        suggestions: data?.suggestions,
        sources: data?.source,
        debug: '',
        articleId: data?._id,
        prompt: data?.prompt,
        createdAt: data?.createdAt,
      }),
    );
    dispatch(handleSeldonInput({ name: 'question', value: data?.prompt }));

    navigate('/seldon-ai');
  };

  console.log('getArticleData', getArticleData);

  return (
    <div
      ref={innerRef}
      className="h-full max-w-[730px] rounded-[12.3px] border-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[15px]"
    >
      {/* Header */}
      <div className="flex items-center justify-end border-b-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
        <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-[#9C9C9C] dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
            {timeAgo}
          </h4>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col justify-between gap-1.5 border-gray-250 px-[0.87rem] py-2 tablet:gap-3 tablet:px-10 tablet:py-4">
        <h4 className="text-[0.75rem] font-semibold leading-[15px] text-gray-900 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          {data?.title}
        </h4>
        <p className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          {data?.seoSummary}
        </p>
        <div className="flex w-full items-center justify-between gap-4">
          {/* <button className="h-[22px] w-full cursor-default tablet:h-[50px]">&#x200B;</button> */}
          <Button
            variant={'submit'}
            className={'!laptop:px-0 w-full whitespace-nowrap !px-0'}
            onClick={handleUpdateArticle}
          >
            Update Article
          </Button>
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
    </div>
  );
}
