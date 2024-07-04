import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ImagePopUp from '../ui/ImagePopUp';
import '../test.css';

export default function SwiperMainCarousel({ images }) {
  const [imageDialogue, setImageDialogue] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const closeDialogue = () => setImageDialogue(false);

  return (
    <div className="">
      {imageDialogue && (
        <ImagePopUp
          images={images}
          selectedImg={selectedImg}
          imageDialogue={imageDialogue}
          closeDialogue={closeDialogue}
        />
      )}
      <main className="slider-main-container">
        <swiper-container
          class="mySwiper"
          thumbs-swiper=".mySwiper2"
          navigation="true"
          navigation-next-el=".custom-next-button"
          navigation-prev-el=".custom-prev-button"
        >
          {images.map((image, index) => (
            <swiper-slide key={index}>
              <div className="flex h-full items-center">
                <div
                  className="relative mx-auto h-fit w-fit p-4"
                  onClick={() => {
                    setImageDialogue(true);
                    setSelectedImg(image);
                  }}
                >
                  <img src={image} />
                  <p className="absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
                    {index + 1}
                  </p>
                </div>
              </div>
            </swiper-slide>
          ))}
        </swiper-container>

        <div className="nav-btn custom-prev-button">
          <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
            <FiChevronLeft className="size-4 text-white tablet:size-6" />
          </div>
        </div>

        <div className="nav-btn custom-next-button">
          <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
            <FiChevronRight className="size-4 text-white tablet:size-6" />
          </div>
        </div>
      </main>

      <swiper-container
        class="mySwiper2"
        // space-between="10"
        slides-per-view="auto"
        free-mode="true"
        watch-slides-progress="true"
      >
        {images.map((image, index) => (
          <swiper-slide key={index}>
            <div className="flex h-full w-full items-center justify-center">
              <div className="relative px-2 tablet:px-3 tablet:py-0">
                <img src={image} className="max-h-[80px] tablet:max-h-[90px]" />{' '}
                <p className="absolute -left-1 -top-1 flex size-6 items-center justify-center rounded-full bg-[#647785] p-1 text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)] tablet:-top-1 tablet:left-1">
                  {index + 1}
                </p>
              </div>
            </div>
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
}
