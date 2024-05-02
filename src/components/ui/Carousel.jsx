import React, { useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import arrow icons from react-icons library

import { Carousel } from 'react-responsive-carousel';
import FullScreenPicturePopup from '../dialogue-boxes/FullScreenPicturePopup';

// Custom arrow component for the left arrow
const CustomLeftArrow = ({ onClick }) => (
  <div
    className="absolute bottom-0 left-0 top-0 flex w-12 cursor-pointer items-center justify-center"
    onClick={onClick}
  >
    <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
      <FiChevronLeft className="size-4 text-white tablet:size-6" />
    </div>
  </div>
);

// Custom arrow component for the right arrow
const CustomRightArrow = ({ onClick }) => (
  <div
    className="absolute bottom-0 right-0 top-0 flex w-12 cursor-pointer items-center justify-center"
    onClick={onClick}
  >
    <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
      <FiChevronRight className="size-4 text-white tablet:size-6" />
    </div>
  </div>
);

// Inside your component, define a function to render the thumbnail images along with slide numbers
const renderThumbnails = (children) => {
  return (
    <div className="flex items-center justify-center">
      {children.map((item, index) => (
        <div key={index} className="relative mx-1">
          {item}
          <span className="absolute bottom-1 right-1 text-xs text-white">{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

const renderThumbs = (children) => {
  return children.map((child, index) => (
    <div key={index} className="thumbItem">
      {child}
      {/* <span className="thumbIndex">{index + 1}</span> */} 
    </div>
  ));
};

const data = [
  { id: 1, picture: 'https://source.unsplash.com/featured/?nature' },
  { id: 2, picture: 'https://source.unsplash.com/featured/?water' },
  { id: 3, picture: 'https://source.unsplash.com/featured/?mountain' },
  { id: 4, picture: 'https://source.unsplash.com/featured/?forest' },
  { id: 5, picture: 'https://source.unsplash.com/featured/?sunset' },
  { id: 6, picture: 'https://source.unsplash.com/featured/?beach' },
  { id: 7, picture: 'https://source.unsplash.com/featured/?landscape' },
  { id: 8, picture: 'https://source.unsplash.com/featured/?sky' },
  { id: 9, picture: 'https://source.unsplash.com/featured/?flower' },
  { id: 10, picture: 'https://source.unsplash.com/featured/?city' },
];

export default () => {
  const [imageDialogue, setImageDialogue] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const openDialogue = (img) => {
    setSelectedImg(img);
    setImageDialogue(true);
  };
  const closeDialogue = () => setImageDialogue(false);

  return (
    <div className="carouselContainer">
      <FullScreenPicturePopup
        handleClose={closeDialogue}
        modalVisible={imageDialogue}
        content={selectedImg}
        imgArr={data}
      />
      <Carousel
        autoPlay
        infiniteLoop={true}
        stopOnHover={true}
        showArrows={true}
        showIndicators={false}
        emulateTouch={true}
        renderArrowPrev={(onClickHandler, hasPrev, label) => hasPrev && <CustomLeftArrow onClick={onClickHandler} />}
        renderArrowNext={(onClickHandler, hasNext, label) => hasNext && <CustomRightArrow onClick={onClickHandler} />}
        statusFormatter={(currentItem, total) => ''}
        renderThumbs={(children) => renderThumbs(children)}

        // onChange={onChange}
        // onClickItem={onClickItem}
        // onClickThumb={onClickThumb}
      >
        {data.map((item) => (
          <div
            className="relative"
            key={item.id}
            onClick={() => {
              openDialogue(item.id);
            }}
          >
            <img alt={item.id} src={item.picture} />
            <p className="absolute -left-3 -top-3 size-6 rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
              {item.id}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
