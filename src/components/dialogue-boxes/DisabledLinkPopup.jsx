import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSharedLinkStatus } from '../../services/api/questsApi';
import * as questUtilsActions from '../../features/quest/utilsSlice';
import PopUp from '../ui/PopUp';

export default function DisabledLinkPopup({ handleClose, modalVisible }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: updateSharedLinkStatus,
    onSuccess: (resp) => {
      console.log('resp', resp);
      toast.success(resp?.data.message);
      queryClient.invalidateQueries('FeedData');
      if (questUtils.sharedQuestStatus.type === 'Delete') {
        dispatch(questUtilsActions.addHiddenPostId(questUtils.sharedQuestStatus.id));
      }
      if (questUtils.sharedQuestStatus.type === 'Disable') {
        dispatch(questUtilsActions.addDisabledPostId(questUtils.sharedQuestStatus.id));
      }
      if (questUtils.sharedQuestStatus.type === 'Enable') {
        dispatch(questUtilsActions.addEnablePostId(questUtils.sharedQuestStatus.id));
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
      logo={'/assets/svgs/link.svg'}
      title={
        questUtils.sharedQuestStatus.type === 'Delete'
          ? 'Delete Link'
          : questUtils.sharedQuestStatus.type === 'Enable'
            ? 'Enabled Link'
            : 'Disabled Link'
      }
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          {questUtils.sharedQuestStatus.type === 'Delete' ? (
            <span>
              it will say 'Are you sure you want to delete this Shared Link? The link will no longer work and all
              related results and statistics will be lost.'
            </span>
          ) : questUtils.sharedQuestStatus.type === 'Enable' ? (
            <span>
              The link has been successfully enabled and is now functioning properly across all user accounts.
            </span>
          ) : (
            <span>
              Please note that upon disabling the link, it will become inactive. However, you have the option to enable
              it at any time in the future.
            </span>
          )}
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} disabled={isLoading} onClick={handleLinkStatusApi}>
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Ok'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
