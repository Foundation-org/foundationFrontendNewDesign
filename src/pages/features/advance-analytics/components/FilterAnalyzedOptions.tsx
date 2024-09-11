import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import PopUp from '../../../../components/ui/PopUp';
import SelectionOption from '../../../../components/SelectionOption';

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
  const [selectedOptions, setSelectedOptions] = useState<any>(questStartData?.QuestAnswers || []);

  const handleOptionSelection = (data: any) => {
    setSelectedOptions((prevSelected: any[]) => {
      return prevSelected.map((option: any) =>
        option.id === data.id ? { ...option, selected: !option.selected } : option,
      );
    });
  };

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
          Are you sure you want to delete all analytics for this post?
        </h1>
        <div className="flex flex-col items-center justify-center gap-[15px]">
          <ul className="flex h-full max-h-[82.77px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:mt-[25px] tablet:max-h-[167px] tablet:gap-[10px]">
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
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              navigate('/direct-messaging', { state: { questStartData, selectedOptions } });
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
