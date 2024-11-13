import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';

export default function DeleteShareArticleLink({ handleClose, modalVisible, articleData, type }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const deleteShareLink = async ({ id, uuid, type }) => {
    let url;
    if (type === 'delete') {
      url = `/article/deleteArticleSetting`;
    } else {
      url = '/article/setArticleSettingStatus';
    }
    const response = await api.post(url, {
      id,
      uuid,
    });

    return response.data;
  };

  const { mutateAsync: deleteShareArticleLink, isPending } = useMutation({
    mutationFn: deleteShareLink,
    onSuccess: (resp) => {
      if (type === 'delete') {
        toast.success('Article link deleted successfully');
      } else if (type === 'enable') {
        toast.success('Article link enabled successfully');
      } else {
        toast.success('Article link disabled successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['news-feed', ''] }, { exact: true });
      // queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      // if (type === 'Delete') {
      //   queryClient.setQueriesData(['sharedLink'], (oldData) => {
      //     return {
      //       ...oldData,
      //       pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
      //     };
      //   });
      // }
      // if (type === 'Disable') {
      //   queryClient.setQueriesData(['sharedLink'], (oldData) => ({
      //     ...oldData,
      //     pages: oldData?.pages?.map((page) =>
      //       page.map((item) =>
      //         item._id === resp.data.data.questForeignKey
      //           ? { ...item, userQuestSetting: { ...item.userQuestSetting, linkStatus: 'Disable' } }
      //           : item
      //       )
      //     ),
      //   }));
      // }
      // if (type === 'Enable') {
      //   queryClient.setQueriesData(['sharedLink'], (oldData) => ({
      //     ...oldData,
      //     pages: oldData?.pages?.map((page) =>
      //       page.map((item) =>
      //         item._id === resp.data.data.questForeignKey
      //           ? { ...item, userQuestSetting: { ...item.userQuestSetting, linkStatus: 'Enable' } }
      //           : item
      //       )
      //     ),
      //   }));
      // }

      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/link.svg`}
      title={
        type === 'Delete' ? 'Delete Shared Link' : type === 'Enable' ? 'Enable Shared Link' : 'Disable Shared Link'
      }
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          {type === 'delete' ? (
            <span>
              Are you sure you want to delete this Shared news? The link will no longer work and all related results and
              statistics will be lost.
            </span>
          ) : type === 'enable' ? (
            <span>Are you sure you want to Enable this link? You can disable it again anytime.</span>
          ) : (
            <span>
              Are you sure you want to disable this link? It will no longer be publicly available. You can enable it
              again in the future.
            </span>
          )}
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            disabled={isPending}
            onClick={() => {
              deleteShareArticleLink({ id: articleData?.articleSetting._id, uuid: persistedUserInfo.uuid, type });
            }}
          >
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
