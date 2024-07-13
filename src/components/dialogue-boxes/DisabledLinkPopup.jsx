import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSharedLinkStatus } from '../../services/api/questsApi';
import * as questUtilsActions from '../../features/quest/utilsSlice';
import PopUp from '../ui/PopUp';

export default function DisabledLinkPopup({ handleClose, modalVisible }) {
  const queryClient = useQueryClient();

  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: updateSharedLinkStatus,
    onSuccess: (resp) => {
      toast.success(resp?.data.message);
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      if (questUtils.sharedQuestStatus.type === 'Delete') {
        queryClient.setQueriesData(['sharedLink'], (oldData) => {
          return {
            ...oldData,
            pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
          };
        });
      }
      if (questUtils.sharedQuestStatus.type === 'Disable') {
        queryClient.setQueriesData(['sharedLink'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) =>
              item._id === resp.data.data.questForeignKey
                ? { ...item, userQuestSetting: { ...item.userQuestSetting, linkStatus: 'Disable' } }
                : item,
            ),
          ),
        }));
      }
      if (questUtils.sharedQuestStatus.type === 'Enable') {
        queryClient.setQueriesData(['sharedLink'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) =>
              item._id === resp.data.data.questForeignKey
                ? { ...item, userQuestSetting: { ...item.userQuestSetting, linkStatus: 'Enable' } }
                : item,
            ),
          ),
        }));
      }
      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
      console.log(err);
    },
  });

  const handleLinkStatusApi = () => {
    setIsLoading(true);
    updateStatus({ link: questUtils.sharedQuestStatus.link, data: questUtils.sharedQuestStatus.type });
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/link.svg`}
      title={
        questUtils.sharedQuestStatus.type === 'Delete'
          ? 'Delete Shared Link'
          : questUtils.sharedQuestStatus.type === 'Enable'
            ? 'Enable Shared Link'
            : 'Disable Shared Link'
      }
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          {questUtils.sharedQuestStatus.type === 'Delete' ? (
            <span>
              Are you sure you want to delete this Shared Link? The link will no longer work and all related results and
              statistics will be lost.
            </span>
          ) : questUtils.sharedQuestStatus.type === 'Enable' ? (
            <span>Are you sure you want to Enable this link? You can disable it again anytime.</span>
          ) : (
            <span>
              Are you sure you want to disable this link? It will no longer be publicly available. You can enable it
              again in the future.
            </span>
          )}
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} disabled={isLoading} onClick={handleLinkStatusApi}>
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>{' '}
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
