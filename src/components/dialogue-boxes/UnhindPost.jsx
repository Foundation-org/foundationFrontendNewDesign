import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';

export default function UnhindPost({ handleClose, modalVisible }) {
  return (
    <PopUp logo={'/assets/dialoguebox/unhide.svg'} title={'Unhide Post'} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:py-[25px] tablet:px-[55px]">
        <h1 className="text-[10px] tablet:text-[20px] font-medium leading-[12px] tablet:leading-[24.2px] text-[#707175]">
          Are you sure you want to unhide this post? It will appear on your home feed.
        </h1>
        <div className="flex gap-[15px] tablet:gap-[34px] justify-end mt-[10px] tablet:mt-[25px]">
          <Button variant={'submit'}>Yes</Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
