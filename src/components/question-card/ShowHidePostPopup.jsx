import { useState } from 'react';
import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';

const customStyle = {
  width: 'fit-content',
  minWidth: 'auto',
};

const data = [
  {
    id: 1,
    title: 'Does not apply to me',
  },
  {
    id: 2,
    title: 'Not interested',
  },
  {
    id: 3,
    title: 'Offensive',
  },
  {
    id: 4,
    title: 'Spam',
  },
];

export default function ShowHidePostPopup({ handleClose, modalVisible }) {
  const [checkboxStates, setCheckboxStates] = useState(data.map(() => true));

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index];
    setCheckboxStates(newCheckboxStates);
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
              id={item.id}
              className="border-[1.52px] tablet:border-[3px] border-[#DEE6F7] rounded-[5.05px] tablet:rounded-[10px] w-full py-[5px] px-[10px] tablet:py-3 min-w-[183px] tablet:min-w-[364px] flex items-center gap-2"
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
          <Button variant={'danger'} className={'rounded-[7.58px] laptop:w-[139px]'} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={'submit'} className={'rounded-[7.58px] laptop:w-[139px]'}>
            Submit
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
