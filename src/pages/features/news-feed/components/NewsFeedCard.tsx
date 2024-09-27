import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/utils';
import { Button } from '../../../../components/ui/Button';
import { NewsFeedPropsType } from '../../../../types/news-feed';
import { setSeldonData } from '../../../../features/seldon-ai/seldonDataSlice';
import { handleSeldonInput } from '../../../../features/seldon-ai/seldonSlice';

export default function NewsFeedCard(props: NewsFeedPropsType) {
  const { data, innerRef } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <div ref={innerRef} className="h-full max-w-[730px]">
      {/* Header */}
      <div className="flex flex-col rounded-t-[12.3px] bg-blue-100 p-[0.57rem] tablet:rounded-t-[15px] tablet:px-5 tablet:py-[11px]">
        <h4 className="text-[0.6rem] font-semibold text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
          {data?.title}
        </h4>
        <p className="text-[0.6rem] font-normal text-white tablet:text-[14px]">Posted {formatDate(data.createdAt)}</p>
      </div>
      {/* Body */}
      <div className="flex flex-col justify-between gap-1.5 rounded-b-[12.3px] border-x-2 border-b-2 border-blue-100 bg-white p-[0.87rem] tablet:gap-4 tablet:rounded-b-[15px] tablet:p-4">
        <p className="text-[12px] font-medium leading-[13.56px] tablet:text-[16px] tablet:leading-normal">
          {data?.seoSummary}
        </p>
        <div className="flex w-full items-center justify-between gap-4">
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
