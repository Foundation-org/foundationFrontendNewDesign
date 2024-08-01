import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createFeedback, hideQuest } from '../../services/api/questsApi';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
// import PickHistoricalDateTime from './PickHistoricalDateTime';

export default function ShowHidePostPopup({
  handleClose,
  modalVisible,
  questStartData,
  checkboxStates,
  setCheckboxStates,
  data,
  setFeedbackLoading,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [hidePostModal, setHidePostModal] = useState(false);
  // const [pickHistoricalDateModal, setPickHistoricalDateModal] = useState(false);
  // const [historicalDate, setHistoricalDate] = useState('');

  // const handlePickHistoricalDateModalClose = () => setPickHistoricalDateModal(false);

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
            page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item)),
          ),
        }));
        toast.success(resp.data.message);
        setFeedbackLoading(false);
      }
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      setFeedbackLoading(false);
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
        setFeedbackLoading(true);
        setHidePostModal(true);
      }
    }
  };

  const { mutateAsync: hidePost, isPending: hidePostLoading } = useMutation({
    mutationFn: hideQuest,
    onSuccess: (resp) => {
      // dispatch(addHiddenPosts(resp.data.data.questForeignKey));
      queryClient.invalidateQueries(['userInfo']);
      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      showToast('success', 'postHidden');
      setFeedbackLoading(false);
      handleClose();
    },
    onError: (err) => {
      setFeedbackLoading(false);
      console.log(err);
    },
  });

  // useEffect(() => {
  //   if (selectedTitle === 'Historical / Past Event') setPickHistoricalDateModal(true);
  // }, [selectedTitle]);

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-latest-cut.svg`}
      title={'Give Feedback / Hide'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={true}
      customStyle={{ width: hidePostModal ? '100%' : 'fit-content', minWidth: 'auto' }}
    >
      {hidePostModal ? (
        <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
          <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 tablet:text-[20px] tablet:leading-[24.2px] dark:text-gray-300">
            Do you also want to hide this post?
          </h1>
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
            <Button
              variant={'submit'}
              disabled={isPending}
              onClick={() => {
                handleCreateFeedback({
                  uuid: persistedUserInfo?.uuid,
                  questForeignKey: questStartData._id,
                  hiddenMessage: selectedTitle,
                  Question: questStartData.Question,
                });
                setTimeout(() => {
                  hidePost({
                    uuid: persistedUserInfo?.uuid,
                    questForeignKey: questStartData._id,
                    hidden: true,
                    hiddenMessage: selectedTitle,
                    Question: questStartData.Question,
                  });
                }, 1000); // 3000 milliseconds = 3 seconds
              }}
            >
              {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
            </Button>
            <Button
              variant={'cancel'}
              onClick={() => {
                handleCreateFeedback({
                  uuid: persistedUserInfo?.uuid,
                  questForeignKey: questStartData._id,
                  hiddenMessage: selectedTitle,
                  Question: questStartData.Question,
                });
                handleClose();
              }}
            >
              No
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-[25px] py-[13px] tablet:px-[50px] tablet:py-[27px]">
          {/* {pickHistoricalDateModal && (
          <PickHistoricalDateTime
            handleClose={handlePickHistoricalDateModalClose}
            modalVisible={pickHistoricalDateModal}
            title={'Select Historical Date'}
            image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
            historicalDate={historicalDate}
            setHistoricalDate={setHistoricalDate}
          />
        )} */}

          <div className="flex flex-col gap-[5px] tablet:gap-3">
            {data
              .filter((filterItem) =>
                questStartData.usersAddTheirAns ||
                questStartData.whichTypeQuestion === 'like/dislike' ||
                questStartData.whichTypeQuestion === 'agree/disagree' ||
                questStartData.whichTypeQuestion === 'yes/no'
                  ? ![4].includes(filterItem.id)
                  : true,
              )
              .map((item, index) => (
                <div
                  key={index + 1}
                  id={item.id}
                  className="flex w-full min-w-[183px] cursor-pointer items-center gap-2 rounded-[5.05px] border-[1.52px] border-white-500 px-[10px] py-[5px] tablet:min-w-[364px] tablet:rounded-[10px] tablet:border-[3px] tablet:py-3 dark:border-gray-100 dark:bg-accent-100"
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
                  <p className="text-nowrap text-[10px] font-normal leading-[12px] text-[#435059] tablet:text-[19px] tablet:leading-[23px] dark:text-gray-300">
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
      )}
    </PopUp>
  );
}
