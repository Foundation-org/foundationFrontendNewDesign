import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hideQuest, updateHiddenQuest } from '../../services/api/questsApi';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import PopUp from '../ui/PopUp';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import * as questsActions from '../../features/quest/utilsSlice';
import { useNavigate } from 'react-router-dom';
import showToast from '../ui/Toast';

const customStyle = {
  width: 'fit-content',
  minWidth: 'auto',
};

export default function ShowHidePostPopup({
  handleClose,
  modalVisible,
  questStartData,
  checkboxStates,
  setCheckboxStates,
  data,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const [selectedTitle, setSelectedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = new Array(data.length).fill(false);
    newCheckboxStates[index] = true;
    setCheckboxStates(newCheckboxStates);

    setSelectedTitle(data[index].title);
  };

  const { mutateAsync: hidePost } = useMutation({
    mutationFn: hideQuest,
    onSuccess: (resp) => {
      dispatch(questsActions.addHiddenPosts(resp.data.data.questForeignKey));
      showToast('success', 'postHidden');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
      console.log(err);
    },
  });

  const { mutateAsync: updateHiddenPost } = useMutation({
    mutationFn: updateHiddenQuest,
    onSuccess: (resp) => {
      dispatch(questsActions.addHiddenPosts(resp.data.data.questForeignKey));
      showToast('success', 'postHidden');
      queryClient.invalidateQueries(['userInfo']);

      queryClient.setQueriesData(['posts'], (oldData) => {
        // if (oldData.pages[0].length <= 1) {
        //   queryClient.invalidateQueries(['posts']);
        // } else {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
      console.log(err);
    },
  });

  const handleHiddenPostApiCall = () => {
    setIsLoading(true);
    if (persistedUserInfo?.role === 'guest') {
      toast.warning(
        <p>
          Please{' '}
          <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
            Create an Account
          </span>{' '}
          to unlock this feature
        </p>,
      );
      setIsLoading(false);
      return;
    } else {
      if (selectedTitle === '') {
        showToast('warning', 'hiddenReason');
        setIsLoading(false);
        return;
      } else {
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
      }
    }
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-latest-cut.svg`}
      title={'Hide Post'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={true}
      customStyle={customStyle}
    >
      <div className="px-[25px] py-[13px] tablet:px-[50px] tablet:py-[27px]">
        <div className="flex flex-col gap-[5px] tablet:gap-3">
          {data
            .filter((filterItem) => (questStartData.usersAddTheirAns ? ![4].includes(filterItem.id) : true))
            .map((item, index) => (
              <div
                key={index + 1}
                id={item.id}
                className="border-white-500 flex w-full min-w-[183px] cursor-pointer items-center gap-2 rounded-[5.05px] border-[1.52px] px-[10px] py-[5px] tablet:min-w-[364px] tablet:rounded-[10px] tablet:border-[3px] tablet:py-3"
                onClick={() => handleCheckboxChange(index)}
              >
                <div id="custom-checkbox-popup" className="flex h-full items-center">
                  <input
                    type="checkbox"
                    className="checkbox h-[12.63px] w-[12.63px] rounded-full after:mt-[-2px] tablet:h-[25px] tablet:w-[25px] tablet:after:mt-[1px]"
                    checked={checkboxStates[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </div>
                <p className="text-nowrap text-[10px] font-normal leading-[12px] text-[#435059] tablet:text-[19px] tablet:leading-[23px]">
                  {item.title}
                </p>
              </div>
            ))}
        </div>
        <div className="mt-[10px] flex justify-center gap-4 tablet:mt-[27px]">
          <Button
            variant={'danger'}
            className={'min-w-[68.2px] max-w-[68.2px] rounded-[7.58px] tablet:min-w-[139px] tablet:max-w-[139px]'}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant={'submit'}
            className={'min-w-[68.2px] max-w-[68.2px] rounded-[7.58px] tablet:min-w-[139px] tablet:max-w-[139px]'}
            onClick={() => {
              handleHiddenPostApiCall();
            }}
          >
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
