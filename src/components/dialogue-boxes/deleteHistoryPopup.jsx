import PopUp from '../ui/PopUp';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { deleteHistory } from '../../services/api/redemptionApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DeleteHistoryPopup({ isDeleteModal, handleClose, deleteHistoryCode }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: DeleteHistory, isPending } = useMutation({
    mutationFn: deleteHistory,
    onSuccess: (resp) => {
      queryClient.invalidateQueries('history');
      toast.success('History Removed Successfully');
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const handleDeleteHistory = () => {
    if (deleteHistoryCode === '') return toast.error('Enter some code to Delete');

    const params = {
      uuid: persistedUserInfo?.uuid,
      code: deleteHistoryCode,
    };
    DeleteHistory(params);
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/delete-history-icon.svg`}
      title={'Delete History'}
      open={isDeleteModal}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete history.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleDeleteHistory}>
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'danger'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
