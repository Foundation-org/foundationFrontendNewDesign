import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createFeedback } from '../../services/api/questsApi';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import HidePostPopup from './HidePostPopup';
import { useQueryClient } from '@tanstack/react-query';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [hidePostModal, setHidePostModal] = useState(false);

  const handleHidePostModalClose = () => setHidePostModal(false);

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = new Array(data.length).fill(false);
    newCheckboxStates[index] = true;
    setCheckboxStates(newCheckboxStates);

    setSelectedTitle(data[index].title);
  };

  const { mutateAsync: handleCreateFeedback, isPending } = useMutation({
    mutationFn: createFeedback,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        setHidePostModal(true);
        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) =>
              item._id === resp.data.data.questForeignKey ? { ...item, startStatus: 'completed' } : item,
            ),
          ),
        }));
        toast.success(resp.data.message);
      }
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const handleHiddenPostApiCall = () => {
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
      return;
    } else {
      if (selectedTitle === '') {
        showToast('warning', 'hiddenReason');
        return;
      } else {
        handleCreateFeedback({
          uuid: persistedUserInfo?.uuid,
          questForeignKey: questStartData._id,
          hiddenMessage: selectedTitle,
          Question: questStartData.Question,
        });
      }
    }
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-latest-cut.svg`}
      title={'Give Feedback / Hide'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={true}
      customStyle={customStyle}
    >
      <div className="px-[25px] py-[13px] tablet:px-[50px] tablet:py-[27px]">
        {hidePostModal && (
          <HidePostPopup
            handleClose={handleHidePostModalClose}
            modalVisible={hidePostModal}
            title={'Hide Post'}
            image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
            questStartData={questStartData}
            selectedTitle={selectedTitle}
            dispatch={dispatch}
          />
        )}
        <div className="flex flex-col gap-[5px] tablet:gap-3">
          {data
            .filter((filterItem) => (questStartData.usersAddTheirAns ? ![4].includes(filterItem.id) : true))
            .map((item, index) => (
              <div
                key={index + 1}
                id={item.id}
                className="flex w-full min-w-[183px] cursor-pointer items-center gap-2 rounded-[5.05px] border-[1.52px] border-white-500 px-[10px] py-[5px] dark:border-gray-100 dark:bg-accent-100 tablet:min-w-[364px] tablet:rounded-[10px] tablet:border-[3px] tablet:py-3"
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
                <p className="text-nowrap text-[10px] font-normal leading-[12px] text-[#435059] dark:text-gray-300 tablet:text-[19px] tablet:leading-[23px]">
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
            disabled={isPending}
            onClick={() => {
              handleHiddenPostApiCall();
            }}
          >
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
