import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { hideQuest } from '../../services/api/questsApi';
import { addHiddenPosts } from '../../features/quest/utilsSlice';

export default function HidePostPopup({
  handleClose,
  modalVisible,
  title,
  image,
  questStartData,
  selectedTitle,
  dispatch,
}) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: hidePost, isPending } = useMutation({
    mutationFn: hideQuest,
    onSuccess: (resp) => {
      // dispatch(addHiddenPosts(resp.data.data.questForeignKey));
      showToast('success', 'postHidden');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose} remove={true}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Do you also want to hide this post?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            disabled={isPending}
            onClick={() => {
              hidePost({
                uuid: persistedUserInfo?.uuid,
                questForeignKey: questStartData._id,
                hidden: true,
                hiddenMessage: selectedTitle,
                Question: questStartData.Question,
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
