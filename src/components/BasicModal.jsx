import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const BasicModal = ({ open, handleClose, children, customStyle, customClasses }) => {
  const defaultStyle = {
    position: 'absolute',
    width: 'fit-content',
    boxShadow: 5,
  };

  const mergedStyle = { ...defaultStyle, ...customStyle };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={mergedStyle} className={customClasses}>
        {children}
      </Box>
    </Modal>
  );
};

export default BasicModal;
