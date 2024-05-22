import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { findPostsByCategoryId } from '../../../../services/api/listsApi';
import QuestionCardWithToggle from '../QuestStartSection/components/QuestionCardWithToggle';

const PostsByList = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  let { categoryId } = useParams();

  const {
    data: listData,
    isError,
    isPending,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      return await findPostsByCategoryId({ userUuid: persistedUserInfo.uuid, categoryId });
    },
    queryKey: ['postsByCategory', categoryId, persistedUserInfo.uuid],
  });

  const content = listData?.post.map((item) => {
    return (
      <div key={item._id}>
        <QuestionCardWithToggle questStartData={item.questForeginKey} />
      </div>
    );
  });

  return (
    <div className="mx-auto mt-[0.94rem] flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-134px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)] dark:bg-[#242424]">
      <div className="no-scrollbar flex h-[calc(100dvh-174px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full">
        {content}
      </div>
    </div>
  );
};

export default PostsByList;
