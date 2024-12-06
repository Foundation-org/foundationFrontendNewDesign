import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';

type ClearAllAnalyticsProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
};

export default function BadgeEncryptedPopup(props: ClearAllAnalyticsProps) {
  const { handleClose, modalVisible, title, image } = props;

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
        <h1 className="summary-text">This badge is encrypted</h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'cancel'} onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
