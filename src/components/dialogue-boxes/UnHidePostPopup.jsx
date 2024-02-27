import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateHiddenQuest } from '../../services/api/questsApi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { removeHiddenPosts } from '../../features/quest/utilsSlice';

export default function UnHidePostPopup({ handleClose, modalVisible, questStartData }) {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const { mutateAsync: hidePost } = useMutation({
    mutationFn: updateHiddenQuest,
    onSuccess: (resp) => {
      toast.success('Post unhidden successfully');
      queryClient.invalidateQueries('FeedData');
      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <PopUp logo={'/assets/dialoguebox/unhide.svg'} title={'Unhide Post'} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:py-[25px] tablet:px-[55px]">
        <h1 className="text-[10px] tablet:text-[20px] font-medium leading-[12px] tablet:leading-[24.2px] text-[#707175]">
          Are you sure you want to unhide this post? It will appear on your home feed.
        </h1>
        <div className="flex gap-[15px] tablet:gap-[34px] justify-end mt-[10px] tablet:mt-[25px]">
          <Button
            variant={'submit'}
            onClick={() => {
              hidePost({
                uuid: persistedUserInfo?.uuid,
                questForeignKey: questStartData._id,
                hidden: false,
                hiddenMessage: '',
              });
              dispatch(removeHiddenPosts(questStartData._id));
            }}
          >
            Yes
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
