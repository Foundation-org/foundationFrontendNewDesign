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
  const tabsRef = useRef([]);
  const rightArrowRef = useRef(null);
  const leftArrowRef = useRef(null);
  const tabsListRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const removeAllActiveClasses = () => {
    tabsRef.current.forEach((tab) => {
      if (tab) {
        tab.classList.remove('active');
      }
    });
  };

  const manageIcons = () => {
    if (tabsListRef.current.scrollLeft >= 20) {
      leftArrowRef.current.classList.add('active');
    } else {
      leftArrowRef.current.classList.remove('active');
    }

    let maxScrollValue = tabsListRef.current.scrollWidth - tabsListRef.current.clientWidth - 20;
    if (tabsListRef.current.scrollLeft >= maxScrollValue) {
      rightArrowRef.current.classList.remove('active');
    } else {
      rightArrowRef.current.classList.add('active');
    }
  };

  const handleTabClick = (index) => {
    removeAllActiveClasses();
    tabsRef.current[index].classList.add('active');
  };

  const handleRightArrowClick = () => {
    tabsListRef.current.scrollLeft += 200;
    manageIcons();
  };

  const handleLeftArrowClick = () => {
    tabsListRef.current.scrollLeft -= 200;
    manageIcons();
  };

  const drag = (e) => {
    if (!dragging) return;
    tabsListRef.current.classList.add('dragging');
    tabsListRef.current.scrollLeft -= e.movementX;
  };

  useEffect(() => {
    const tabsList = tabsListRef.current;
    const handleMouseUp = () => {
      setDragging(false);
      tabsList.classList.remove('dragging');
    };

    document.addEventListener('mouseup', handleMouseUp);
    tabsList.addEventListener('scroll', manageIcons);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      tabsList.removeEventListener('scroll', manageIcons);
    };
  }, [dragging]);

  return (
    <>
      <div className="scrollable-tabs-container">
        <div ref={leftArrowRef} className="left-arrow" onClick={handleLeftArrowClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </div>

        <ul ref={tabsListRef} onMouseDown={() => setDragging(true)} onMouseMove={drag}>
          {[
            'All',
            'Music',
            'Chess',
            'Live',
            'Gaming',
            'Editing',
            'Mixing consoles',
            'Comedy',
            'Computer Hardware',
            'News',
            'Computer Programming',
            'Video Editing Software',
            'Sports',
          ].map((tab, index) => (
            <li key={index}>
              <a
                href="#"
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleTabClick(index)}
                className={index === 0 ? 'active' : ''}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>

        <div ref={rightArrowRef} className="right-arrow active" onClick={handleRightArrowClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
      {/* <div className="relative flex items-center justify-center px-4 py-2 tablet:px-6 tablet:py-[14.82px]">
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
      </div> */}
    </>
  );
}
