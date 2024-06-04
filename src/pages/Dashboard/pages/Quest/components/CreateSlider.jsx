import { useRef, useState } from 'react';
import { Button } from '../../../../../components/ui/Button';

const createItems = [
  { id: 0, title: 'Yes/No' },
  { id: 1, title: 'Multiple Choice' },
  { id: 5, title: 'Open Choice' },
  { id: 2, title: 'Ranked Choice' },
  { id: 3, title: 'Agree/Disagree' },
  { id: 4, title: 'Like/Dislike' },
];

export default function CreateSlider({ setTab, tab }) {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleTab = (id) => {
    const selectedButton = document.getElementById(`create-btn-${id}`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTab(id);
  };

  const handleLeftArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth / 2;
    setScrollPosition(scrollPosition - scrollAmount);
    container.scrollTo({
      left: scrollPosition - scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleRightArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth / 2;
    setScrollPosition(scrollPosition + scrollAmount);
    container.scrollTo({
      left: scrollPosition + scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const container = containerRef.current;

    if (!container) return;

    const startX = e.pageX;
    const initialScrollLeft = container.scrollLeft;

    const handleMouseMove = (e) => {
      const dx = e.pageX - startX;
      container.scrollLeft = initialScrollLeft - dx;
      if (dx < 0) {
        setScrollPosition(startX - e.pageX);
        localStorage.setItem('sliderScrollPosition', startX - e.pageX);
      } else {
        setScrollPosition(e.pageX - startX);
        localStorage.setItem('sliderScrollPosition', e.pageX - startX);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex items-center justify-center px-4 py-2 tablet:px-6 tablet:py-[14.82px]">
      {/* {scrollPosition > 0 && ( */}
      <button
        onClick={handleLeftArrowClick}
        className="size-[10px] min-w-[10px] max-w-[10px] rotate-180 tablet:size-5 tablet:min-w-5 tablet:max-w-5"
        style={{
          background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      ></button>
      {/* )} */}
      <div
        className="no-scrollbar mx-[5px] flex items-center gap-[6.75px] overflow-x-scroll tablet:mx-4 tablet:gap-[13.82px]"
        id="buttonContainer"
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        {createItems.map((item) => {
          let startX = 0;
          let startY = 0;

          const handleMouseDown = (e) => {
            startX = e.clientX;
            startY = e.clientY;
          };

          const handleMouseUp = (e) => {
            const distance = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
            if (distance < 5) {
              handleTab(item.id);
            }
          };

          return (
            <div className="flex" key={item.id}>
              <Button
                id={`create-btn-${item.id}`}
                variant={'topics'}
                className={`${tab === item.id ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#707175]'}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              >
                {item.title}
              </Button>
              {item.id === 2 && (
                <div className="ml-[6.75px] min-w-[1.4px] bg-[#CECECE] tablet:ml-[13.82px] tablet:min-w-[2.4px]" />
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleRightArrowClick}
        className="size-[10px] min-w-[10px] max-w-[10px] tablet:size-5 tablet:min-w-5 tablet:max-w-5"
        style={{
          background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      ></button>
    </div>
  );
}
