import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './test.css';

const images = [
  'https://swiperjs.com/demos/images/nature-1.jpg',
  'https://swiperjs.com/demos/images/nature-2.jpg',
  'https://swiperjs.com/demos/images/nature-3.jpg',
  'https://swiperjs.com/demos/images/nature-4.jpg',
  'https://swiperjs.com/demos/images/nature-5.jpg',
  'https://swiperjs.com/demos/images/nature-6.jpg',
  'https://swiperjs.com/demos/images/nature-7.jpg',
  'https://swiperjs.com/demos/images/nature-8.jpg',
  'https://swiperjs.com/demos/images/nature-9.jpg',
  'https://swiperjs.com/demos/images/nature-10.jpg',
];

const Test = () => {
  return (
    <div className="p-4">
      <main className="slider-main-container">
        <swiper-container
          class="mySwiper"
          thumbs-swiper=".mySwiper2"
          space-between="10"
          navigation="true"
          navigation-next-el=".custom-next-button"
          navigation-prev-el=".custom-prev-button"
        >
          {images.map((image, index) => (
            <swiper-slide key={index}>
              <div className="relative mx-auto w-fit p-4">
                <img src={image} />
                <p className="absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
                  {index + 1}
                </p>
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
        space-between="10"
        slides-per-view="4"
        free-mode="true"
        watch-slides-progress="true"
      >
        {images.map((image, index) => (
          <swiper-slide key={index}>
            <div className="p-2">
              <img src={image} />
            </div>
            <p className="absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#647785] p-1 text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
              {index + 1}
            </p>
          </swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
};

export default Test;
