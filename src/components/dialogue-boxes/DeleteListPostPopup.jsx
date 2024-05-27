import PopUp from '../ui/PopUp';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { updateCategory } from '../../services/api/listsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export default function DeleteListPostPopup({ handleClose, modalVisible, title, image, categoryId, postId }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: handleDeletePost, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: (resp) => {
      console.log('resp', resp);
      console.log('Post deleted Successfully');

      // if (resp.response.status === 500) {
      //   toast.warning('Something goes wrong.');
      //   return;
      // }

      toast.success('Post deleted successfully');

      // queryClient.setQueriesData(['lists'], (oldData) => {
      //   console.log('old', oldData);
      //   return oldData?.map((page) => page.filter((item) => item._id !== categoryId));
      // });

      queryClient.invalidateQueries(['lists']);

      //   handleClose();
    },
    onError: (error) => {
      console.log(error);
      // toast.warning(error.response.data.message);
    },
  });

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete this Post?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              handleDeletePost({
                userUuid: persistedUserInfo.uuid,
                categoryId,
                postId,
              });
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
