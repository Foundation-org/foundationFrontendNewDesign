import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import PopUp from '../../../../components/ui/PopUp';
import SelectionOption from '../../../../components/SelectionOption';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOptionParticipants } from '../../../../services/api/directMessagingApi';

type ClearAllAnalyticsProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  questStartData: any;
};

export default function FilterAnalyzedOptions({
  handleClose,
  modalVisible,
  title,
  image,
  questStartData,
}: ClearAllAnalyticsProps) {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [participants, setParticipants] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<any>(questStartData?.QuestAnswers || []);

  const handleOptionSelection = (data: any) => {
    setSelectedOptions((prevSelected: any[]) => {
      return prevSelected.map((option: any) =>
        option.id === data.id ? { ...option, selected: !option.selected } : option,
      );
    });
  };

  const { mutateAsync: fetchParticipants } = useMutation({
    mutationFn: fetchOptionParticipants,
    onSuccess: (resp) => {
      setParticipants(resp?.data.dynamicParticipantsCount);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    const selectedQuestions = selectedOptions
      ?.filter((option: any) => option.selected)
      .map((option: any) => option.question);

    const params = {
      questForeignKey: questStartData?._id,
      uuid: persistedUserInfo.uuid,
      options: selectedQuestions,
    };

    fetchParticipants(params);
  }, [selectedOptions]);

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      autoSize={false}
      closeIcon={null}
      customClasses={''}
      customStyle={''}
      remove={false}
      isBackground={false}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Select one or more options to message their participants.
        </h1>
        <div className="flex flex-col items-center justify-center gap-[15px]">
          <ul className="mt-[10px] flex h-full max-h-[236px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:mt-[25px] tablet:max-h-[472px] tablet:gap-[10px]">
            {selectedOptions?.map((post: any) => (
              <SelectionOption
                key={post.id}
                data={post}
                handleSelection={handleOptionSelection}
                page="filterAnalyzedOptions"
                questStartData={questStartData}
              />
            ))}
          </ul>
        </div>
        <p className="summary-text mt-[10px] text-center tablet:mt-[25px]">
          Total participants selected{' '}
          {selectedOptions?.filter((option: any) => option.selected).length === 0 ? 0 : participants}
        </p>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={
              selectedOptions?.filter((option: any) => option.selected).length > 0 && participants > 0
                ? 'submit'
                : 'hollow-submit'
            }
            disabled={
              selectedOptions?.filter((option: any) => option.selected).length > 0 && participants > 0 ? false : true
            }
            onClick={() => {
              navigate('/direct-messaging/new-message', { state: { questStartData, selectedOptions } });
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
