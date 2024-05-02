import ImagePopUp from '../ui/ImagePopUp';

export default function FullScreenPicturePopup({ handleClose, modalVisible, content, imgArr }) {
  return (
    <ImagePopUp open={modalVisible} handleClose={handleClose} data={imgArr} selectedImg={content}>
      {/* {imgArr?.map((item, index) => (
        <img src={item.picture} className="w-full" key={index + 1} />
      ))} */}
    </ImagePopUp>
  );
}
