import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const ImagePopUp = ({ open, handleClose, children, customStyle, customClasses }) => {
  const defaultStyle = {
    boxShadow: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const mergedStyle = { ...defaultStyle, ...customStyle };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={mergedStyle} className={`${customClasses} z-[1000] w-[90%] max-w-max border-none outline-none`}>
        <div className="relative rounded-b-[9.76px] bg-transparent tablet:rounded-b-[26px]" onClick={handleClose}>
          {/* <div className="absolute right-0">
            {!closeIcon && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/preferences/close.png`}
                alt="close"
                className="h-[10px] w-[10px] cursor-pointer tablet:h-[22.7px] tablet:w-[22px]"
                onClick={handleClose}
              />
            )}
          </div> */}
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export default ImagePopUp;
