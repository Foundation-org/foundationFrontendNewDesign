import { useEffect, useRef, useState } from 'react';
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
  const [isEnd, setIsEnd] = useState(false);

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
    const newScrollPosition = scrollPosition - scrollAmount;
    setScrollPosition(newScrollPosition);
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    });
  };

  const handleRightArrowClick = () => {
    const container = document.getElementById('buttonContainer');
    const scrollAmount = container.clientWidth / 2;
    const newScrollPosition = scrollPosition + scrollAmount;
    setScrollPosition(newScrollPosition);
    container.scrollTo({
      left: newScrollPosition,
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
      setScrollPosition(container.scrollLeft);
      checkIfEnd(container);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const container = containerRef.current;

    if (!container) return;

    const startX = e.touches[0].pageX;
    const initialScrollLeft = container.scrollLeft;

    const handleTouchMove = (e) => {
      const dx = e.touches[0].pageX - startX;
      container.scrollLeft = initialScrollLeft - dx;
      setScrollPosition(container.scrollLeft);
      checkIfEnd(container);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const checkIfEnd = (container) => {
    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;
    setIsEnd(atEnd);
  };

  useEffect(() => {
    const container = containerRef.current;
    checkIfEnd(container);
  }, [scrollPosition]);

  return (
    <div className="relative flex items-center justify-center px-4 py-2 tablet:px-6 tablet:py-[14.82px]">
      {scrollPosition > 0 && (
        <div className="absolute left-4 top-1/2 flex h-full w-3 -translate-y-1/2 items-center bg-[#F3F4F5] tablet:left-5 tablet:w-6">
          <button
            onClick={handleLeftArrowClick}
            className="size-[10px] min-w-[10px] max-w-[10px] rotate-180 tablet:size-5 tablet:min-w-5 tablet:max-w-5"
            style={{
              background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
            }}
          ></button>
        </div>
      )}
      <div
        className="no-scrollbar flex items-center gap-[6.75px] overflow-x-scroll tablet:gap-[13.82px]"
        id="buttonContainer"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
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
      {!isEnd && (
        <div className="absolute right-4 top-1/2 flex h-full w-3 -translate-y-1/2 items-center bg-[#F3F4F5] pl-1 tablet:right-5 tablet:w-6">
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
      )}
    </div>
  );
}
