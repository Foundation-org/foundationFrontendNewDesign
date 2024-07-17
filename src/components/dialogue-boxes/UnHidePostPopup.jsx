import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateHiddenQuest } from '../../services/api/questsApi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { removeHiddenPosts } from '../../features/quest/utilsSlice';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import showToast from '../ui/Toast';

export default function UnHidePostPopup({ handleClose, modalVisible, questStartData }) {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: hidePost } = useMutation({
    mutationFn: updateHiddenQuest,
    onSuccess: (resp) => {
      showToast('success', 'postUnhidden');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.setQueriesData(['hiddenPosts'], (oldData) => {
        // if (oldData.pages[0].length <= 1) {
        //   queryClient.invalidateQueries(['hiddenPosts']);
        // } else {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
        // }
      });

      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
      console.log(err);
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/unhide.svg`}
      title={'Unhide Post'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to unhide this post? It will appear on your home feed.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              setIsLoading(true);
              hidePost({
                uuid: persistedUserInfo?.uuid,
                questForeignKey: questStartData._id,
                hidden: false,
                hiddenMessage: '',
              });
              dispatch(removeHiddenPosts(questStartData._id));
            }}
            disabled={isLoading}
          >
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
