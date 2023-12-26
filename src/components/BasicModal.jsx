import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const BasicModal = ({ open, handleClose, children, customStyle }) => {
  const defaultStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
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
      <Box sx={mergedStyle} className="rounded-[9.251px] laptop:rounded-[26px]">
        {children}
      </Box>
    </Modal>
  );
};

export default BasicModal;
