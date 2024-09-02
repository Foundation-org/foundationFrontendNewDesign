import { useDispatch, useSelector } from 'react-redux';
import { setGuestSignUpDialogue } from '../features/extras/extrasSlice';
import GuestSignUpDialogue from './dialogue-boxes/GuestSignUpDialogue';

export default function GuestDialogueScreen() {
  const dispatch = useDispatch();
  const guestSignUpDialogue = useSelector((state: any) => state.extras.guestSignUpDialogue);

  const handleClose = () => {
    dispatch(setGuestSignUpDialogue(false));
  };

  return (
    <>
      {guestSignUpDialogue && (
        <GuestSignUpDialogue
          handleClose={handleClose}
          modalVisible={guestSignUpDialogue}
          title={'Create an Account'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/signup-icon.svg`}
        />
      )}
    </>
  );
}
