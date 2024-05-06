import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Carousel } from 'react-responsive-carousel';
import { useEffect, useState } from 'react';

const ImagePopUp = ({ open, handleClose, data, selectedImg }) => {
  const [shouldEmulateTouch, setShouldEmulateTouch] = useState(false);
  const defaultStyle = {
    boxShadow: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  useEffect(() => {
    const handleResize = () => {
      setShouldEmulateTouch(window.innerWidth <= 744 ? false : true);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mergedStyle = { ...defaultStyle };

  const renderThumbs = (children) => {
    return children.map((child, index) => (
      <div key={index} className="thumbItem">
        {child}
        {/* <span className="thumbIndex">{index + 1}</span> */} 
      </div>
    ));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ background: 'black' }}
    >
      <Box sx={mergedStyle} className={`z-[1000] w-full max-w-max border-none outline-none`}>
        <div id="fullscreen_carousel_main" className="relative rounded-b-[9.76px] bg-black tablet:rounded-b-[26px]">
          <div className="absolute left-6 top-6 z-[100000] cursor-pointer" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="51"
              height="50"
              viewBox="0 0 51 50"
              fill="none"
              className="size-[30px] tablet:size-[50px]"
            >
              <path
                d="M44.5116 24.0042C44.5116 35.1654 35.4637 44.2132 24.3025 44.2132C13.1414 44.2132 4.09353 35.1654 4.09353 24.0042C4.09353 12.8431 13.1414 3.79522 24.3025 3.79522C35.4637 3.79522 44.5116 12.8431 44.5116 24.0042Z"
                fill="black"
              />
              <path
                d="M43.223 42.1936C52.7187 32.1703 52.2911 16.347 42.2678 6.85123C32.2445 -2.64452 16.4212 -2.21687 6.92545 7.80642C-2.5703 17.8297 -2.14265 33.653 7.88063 43.1488C17.9039 52.6445 33.7272 52.2169 43.223 42.1936ZM17.3644 20.1558C16.6485 19.4775 16.6179 18.3473 17.2962 17.6313C17.9744 16.9154 19.1047 16.8848 19.8206 17.5631L25.006 22.4755L29.9184 17.2902C30.5967 16.5742 31.7269 16.5437 32.4429 17.222C33.1588 17.9002 33.1894 19.0305 32.5111 19.7464L27.5987 24.9318L32.784 29.8442C33.5 30.5225 33.5305 31.6527 32.8523 32.3687C32.174 33.0846 31.0438 33.1152 30.3278 32.4369L25.1424 27.5245L20.23 32.7098C19.5517 33.4258 18.4215 33.4563 17.7055 32.778C16.9896 32.0998 16.959 30.9695 17.6373 30.2536L22.5498 25.0682L17.3644 20.1558Z"
                fill="white"
              />
            </svg>
          </div>
          <div id="fullscreen_carousel_container" className="flex h-dvh items-center justify-center">
            <Carousel
              // autoPlay
              swipeable={shouldEmulateTouch}
              infiniteLoop={true}
              stopOnHover={true}
              showArrows={true}
              showIndicators={false}
              emulateTouch={true}
              useKeyboardArrows={true}
              selectedItem={selectedImg - 1}
              renderThumbs={(children) => renderThumbs(children)}
              statusFormatter={(currentItem, total) => ''}
            >
              {data &&
                data.length >= 1 &&
                data?.map((item, index) => (
                  <div id="fullscreen_carousel" className="relative" key={index}>
                    <img alt={index} src={item} />
                    <p className="absolute -left-3 -top-3 size-6 rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
                      {index + 1}
                    </p>
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ImagePopUp;
