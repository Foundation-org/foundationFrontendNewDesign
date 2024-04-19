import ImagePopUp from '../ui/ImagePopUp';

export default function FullScreenPicturePopup({ handleClose, modalVisible, content }) {
  return (
    <ImagePopUp open={modalVisible} handleClose={handleClose}>
      <img src={content} className="w-full" />
    </ImagePopUp>
  );
}
