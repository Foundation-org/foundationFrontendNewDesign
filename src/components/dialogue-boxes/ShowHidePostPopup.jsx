import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hideQuest, updateHiddenQuest } from '../../services/api/questsApi';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import PopUp from '../ui/PopUp';
import { useSelector } from 'react-redux';
import { userInfo } from '../../services/api/userAuth';
import { useDispatch } from 'react-redux';
import * as authActions from '../../features/auth/authSlice';

const customStyle = {
  width: 'fit-content',
  minWidth: 'auto',
};


export default function ShowHidePostPopup({ handleClose, modalVisible, questStartData,checkboxStates,setCheckboxStates,data }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const [selectedTitle, setSelectedTitle] = useState(null);

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = new Array(data.length).fill(false);
    newCheckboxStates[index] = true;
    setCheckboxStates(newCheckboxStates);

    setSelectedTitle(data[index].title);
  };

  const { mutateAsync: getUserInfo } = useMutation({
    mutationFn: userInfo,
    onSuccess: (resp) => {
      if (resp?.status === 200) {
        if (resp.data) {
          dispatch(authActions.addUser(resp?.data));

          if (!localStorage.getItem('uuid')) {
            localStorage.setItem('uuid', resp.data.uuid);
          }
        }
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: hidePost } = useMutation({
    mutationFn: hideQuest,
    onSuccess: (resp) => {
      toast.success('Post hidden successfully');
      getUserInfo();
      queryClient.invalidateQueries('FeedData');
      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: updateHiddenPost } = useMutation({
    mutationFn: updateHiddenQuest,
    onSuccess: (resp) => {
      toast.success('Post hidden successfully');
      getUserInfo();
      queryClient.invalidateQueries('FeedData');
      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleHiddenPostApiCall = () => {
    if (questStartData?.userQuestSetting) {
      updateHiddenPost({
        uuid: persistedUserInfo?.uuid,
        questForeignKey: questStartData._id,
        hidden: true,
        hiddenMessage: selectedTitle,
      });
    } else {
      hidePost({
        uuid: persistedUserInfo?.uuid,
        questForeignKey: questStartData._id,
        hidden: true,
        hiddenMessage: selectedTitle,
        Question: questStartData.Question,
      });
    }
  };

  return (
    <PopUp
      logo={'/assets/svgs/eye-latest-cut.svg'}
      title={'Hide Post'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={true}
      customStyle={customStyle}
    >
      <div className="px-[25px] py-[13px] tablet:py-[27px] tablet:px-[50px]">
        <div className="flex flex-col gap-[5px] tablet:gap-3">
          {data.map((item, index) => (
            <div
              key={index + 1}
              id={item.id}
              className="border-[1.52px] tablet:border-[3px] border-[#DEE6F7] rounded-[5.05px] tablet:rounded-[10px] w-full py-[5px] px-[10px] tablet:py-3 min-w-[183px] tablet:min-w-[364px] flex items-center gap-2 cursor-pointer"
              onClick={() => handleCheckboxChange(index)}
            >
              <div id="custom-checkbox-popup" className="flex h-full items-center">
                <input
                  type="checkbox"
                  className="checkbox h-[12.63px] w-[12.63px] rounded-full tablet:h-[25px] tablet:w-[25px] after:mt-[-2px] tablet:after:mt-[1px]"
                  checked={checkboxStates[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </div>
              <p className="text-[10px] tablet:text-[19px] font-normal leading-[12px] tablet:leading-[23px] text-[#435059]">
                {item.title}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-[10px] tablet:mt-[27px] flex justify-center gap-4">
          <Button
            variant={'danger'}
            className={'rounded-[7.58px] min-w-[68.2px] max-w-[68.2px] tablet:min-w-[139px] tablet:max-w-[139px]'}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant={'submit'}
            className={'rounded-[7.58px] min-w-[68.2px] max-w-[68.2px] tablet:min-w-[139px] tablet:max-w-[139px]'}
            onClick={() => {
              handleHiddenPostApiCall();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
