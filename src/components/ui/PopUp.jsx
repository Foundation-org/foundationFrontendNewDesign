import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const PopUp = ({ open, handleClose, children, customStyle, customClasses, logo, title, closeIcon, isBackground }) => {
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
      <Box
        sx={mergedStyle}
        className={`${customClasses} border-none outline-none z-[1000] max-w-[676px] laptop:max-w-[845px] min-w-[334px] w-fit tablet:w-full `}
      >
        <div className="bg-blue-gradiant flex justify-between items-center py-1 tablet:py-2 px-[15px] tablet:px-[30px] rounded-t-[9.76px] tablet:rounded-t-[26px]">
          <div className="flex items-center gap-[10px] tablet:gap-[17px]">
            <div className={` ${isBackground ? 'bg-white rounded-full' : ''} `}>
              <img src={logo} alt="popup logo" className="w-6 h-6 tablet:w-[50px] tablet:h-[50px]" />
            </div>
            <p className="text-[12px] font-bold tablet:text-[25px] tablet:font-medium text-white">{title}</p>
          </div>
          {!closeIcon && (
            <img
              src="/assets/preferences/close.png"
              alt="close"
              className="cursor-pointer w-[10px] h-[10px] tablet:w-[22px] tablet:h-[22.7px]"
              onClick={handleClose}
            />
          )}
        </div>
        <div className="bg-white rounded-b-[9.76px] tablet:rounded-b-[26px]">{children}</div>
      </Box>
    </Modal>
  );
};

export default PopUp;
