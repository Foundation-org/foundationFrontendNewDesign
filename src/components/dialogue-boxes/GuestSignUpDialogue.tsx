import Signup from '../../pages/Signup';
import PopUp from '../ui/PopUp';

type GuestSignUpDialogueProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
};

export default function GuestSignUpDialogue({ handleClose, modalVisible, title, image }: GuestSignUpDialogueProps) {
  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      customStyle=""
      customClasses=""
      closeIcon=""
      isBackground=""
      remove=""
      autoSize=""
    >
      <Signup allowSignUp={true} />
    </PopUp>
  );
}
