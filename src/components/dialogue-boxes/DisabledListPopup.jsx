import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';

export default function DisabledListPopup({ handleClose, modalVisible, type, categoryId }) {
  console.log(type);
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: () =>
      api.post(`/userlists/listEnableDisable`, {
        uuid: persistedUserInfo.uuid,
        categoryId,
        enable: type === 'disable' ? 'false' : 'true',
      }),
    onSuccess: (resp) => {
      toast.success(resp?.data.message);

      queryClient.invalidateQueries(['lists']);
      // queryClient.setQueryData(['lists'], (oldData) => {
      //   const updatedData = {
      //     ...oldData,
      //     ...resp.data.userList.userList, // Merging changes from the API response
      //   };
      //   setItems(updatedData); // Sync local state with the new data
      //   return updatedData; // Return updated data for query cache
      // });

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
    updateStatus();
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/link.svg`}
      title={type === 'disable' ? 'Disable Sharing' : 'Enable Sharing'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          {type === 'disable' ? (
            <span>
              Are you sure you want to disable sharing? This content will no longer be public on your Home Page, and all
              associated shared links will be disabled. You can re-enable it anytime.
            </span>
          ) : (
            <span>
              Are you sure you want to enable sharing? This content will be public on your Home Page, and all associated
              shared links will be re-enabled. You can disable it again at anytime.
            </span>
          )}
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} disabled={isLoading} onClick={handleLinkStatusApi}>
            {isLoading ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
