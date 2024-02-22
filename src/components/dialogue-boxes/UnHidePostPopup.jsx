import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { updateHiddenQuest } from '../../services/api/questsApi';

export default function UnHidePostPopup({ handleClose, modalVisible, questStartData }) {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: hidePost } = useMutation({
    mutationFn: updateHiddenQuest,
    onSuccess: (resp) => {
      toast.success('Post removed successfully');
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
