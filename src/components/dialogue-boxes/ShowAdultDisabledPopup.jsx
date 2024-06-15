import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';

export default function ShowAdultDisabledPopup({ handleClose, modalVisible, title, image }) {
  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-[#707175] tablet:text-[20px] tablet:leading-[24.2px]">
          Your Adult post filter is disabled.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleClose}>
            Ok
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
