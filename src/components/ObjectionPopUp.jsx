import { Button } from './ui/Button';
import PopUp from './ui/PopUp';

export default function ObjectionPopUp({ modalVisible, handleClose, handleContendChange, option }) {
  return (
    <PopUp
      logo={'/assets/svgs/dashboard/icon19.svg'}
      title={'Object Option'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[17px] tablet:px-[80px] py-[10px] tablet:py-[25px]">
        <h1 className="text-[10px] tablet:text-[20px] font-medium leading-[12px] tablet:leading-[24.2px] text-[#707175]">
          Are you sure you want to object to this option.
        </h1>
        <p className="mt-2 tablet:mt-[14px] text-[11px] tablet:text-[22px] font-semibold leading-[12.5px] tablet:leading-[25.63px] text-[#707175] text-center">
          "{option}"
        </p>
        <div className="mt-[10px] tablet:mt-[26px] flex justify-end gap-[15px] tablet:gap-[34px]">
          <Button
            variant="submit"
            onClick={() => {
              handleContendChange(true);
              handleClose();
            }}
          >
            Object <span className="text-[6px] tablet:text-[15px] leading-[0px] pl-1 tablet:pl-2 ">(-0.1 FDX)</span>
          </Button>
          <Button
            variant="cancel"
            onClick={() => {
              handleContendChange(false);
              handleClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
