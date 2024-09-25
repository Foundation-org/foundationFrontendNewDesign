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
  submitBtn: string;
};

export default function FilterAnalyzedOptions({
  handleClose,
  modalVisible,
  title,
  image,
  questStartData,
  submitBtn,
}: ClearAllAnalyticsProps) {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [participants, setParticipants] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<any>(() => {
    const initialOptions = questStartData?.QuestAnswers || [];
    return initialOptions.map((option: any) => ({
      ...option,
      selected: false,
    }));
  });

  const handleOptionSelection = (data: any) => {
    setSelectedOptions((prevSelected: any[]) => {
      return prevSelected.map((option: any) =>
        option._id === data._id ? { ...option, selected: !option.selected } : option,
      );
    });
  };

  const handleSelectAllOptions = (isSelect: boolean) => {
    if (isSelect) {
      setSelectedOptions((prevSelected: any[]) => prevSelected.map((option: any) => ({ ...option, selected: true })));
    } else {
      setSelectedOptions((prevSelected: any[]) => prevSelected.map((option: any) => ({ ...option, selected: false })));
    }
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

    if (selectedOptions?.filter((option: any) => option.selected).length !== 0) {
      fetchParticipants(params);
    }
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
      <div className="space-y-3 px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px] laptop:space-y-5">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Select participants to send a message to.
        </h1>
        <hr />
        <div className="flex flex-col items-center justify-center gap-[15px]">
          <ul className="flex h-full max-h-[236px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:max-h-[472px] tablet:gap-[10px]">
            <h1 className="text-[10px] font-medium leading-[12px] text-gray-150 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
              {questStartData.Question}
            </h1>
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
        <div className="mt-[10px] flex items-center justify-between tablet:mt-[25px]">
          <p className="summary-text text-center">
            Total participants selected{' '}
            {selectedOptions?.filter((option: any) => option.selected).length === 0 ? 0 : participants}
          </p>
          <button
            className="summary-text cursor-pointer text-blue-100 underline"
            onClick={() => {
              selectedOptions?.filter((option: any) => option.selected).length > 0
                ? handleSelectAllOptions(false)
                : handleSelectAllOptions(true);
            }}
          >
            {selectedOptions?.filter((option: any) => option.selected).length > 0 ? 'Deselect All' : 'Select All '}
          </button>
        </div>
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
              navigate('/direct-messaging/new-message?advance-analytics=true', {
                state: { questStartData, selectedOptions, key: new Date().getTime() },
              });
              if (submitBtn === 'Update') {
                handleClose();
              }
            }}
          >
            {submitBtn}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
