import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  findPostsByCategoryId,
  findPostsBySharedLink,
  updateCategoryViewCount,
} from '../../../../services/api/listsApi';
import QuestionCardWithToggle from '../QuestStartSection/components/QuestionCardWithToggle';
import Topbar from '../../components/Topbar';
import DashboardLayout from '../../components/DashboardLayout';
import { useEffect } from 'react';

const PostsByList = () => {
  let { id, categoryId } = useParams();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const {
    data: listData,
    isError,
    isPending,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      if (id === null || id === '' || id === undefined) {
        return await findPostsByCategoryId({ userUuid: persistedUserInfo.uuid, categoryId });
      } else {
        return await findPostsBySharedLink({ id });
      }
    },
    queryKey: ['postsByCategory', categoryId, persistedUserInfo.uuid, id],
  });

  useEffect(() => {
    if (isSuccess && listData) {
      updateCategoryViewCount({ categoryLink: id });
    }
  }, [isSuccess, listData]);

  const content =
    listData?.post?.map((item) => {
      return (
        <div key={item._id}>
          <QuestionCardWithToggle questStartData={item.questForeginKey} categoryId={item._id} />
        </div>
      );
    }) ?? null;

  return (
    <>
      {id === null || id === '' || id === undefined ? (
        <div className="mx-auto mt-[0.94rem] flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-134px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)] dark:bg-[#242424]">
          <div className="no-scrollbar flex h-[calc(100dvh-174px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full">
            {content}
          </div>
        </div>
      ) : (
        <>
          <Topbar />
          <div className="w-full bg-[#F2F3F5]">
            <DashboardLayout>
              <div className="no-scrollbar mx-auto mt-[0.94rem] flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-134px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)] dark:bg-[#242424]">
                <div className="no-scrollbar flex h-[calc(100dvh-174px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full">
                  {content}
                </div>
              </div>
            </DashboardLayout>
          </div>
        </>
      )}
    </>
  );
};

export default PostsByList;
