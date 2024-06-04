import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const createItems = [
  { id: 8, title: 'Summary', path: '/dashboard/profile', to: '' },
  { id: 1, title: 'Verfication Badges', path: '/dashboard/profile/verification-badges', to: '' },
  { id: 0, title: 'Post activity', path: '/dashboard/profile/post-activity', to: 'post-activity' },
  { id: 3, title: 'Hidden Posts', path: '/dashboard/profile/hidden-posts', to: 'hidden-posts' },
  { id: 6, title: 'Posts Feedback', path: '/dashboard/profile/feedback', to: 'feedback' },
  { id: 4, title: 'Shared Posts', path: '/dashboard/profile/shared-links', to: 'shared-links' },
  { id: 7, title: 'My Lists', path: '/dashboard/profile/lists', to: 'lists' },
  { id: 5, title: 'User Settings', path: '/dashboard/profile/user-settings', to: 'user-settings' },
  { id: 2, title: 'My Activity', path: '/dashboard/profile/ledger', to: 'ledger' },
];

export default function ProfileSlider({ setTab, tab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isEnd, setIsEnd] = useState(false);

  const handleTab = (id) => {
    const selectedButton = document.getElementById(`profile-btn-${id}`);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTab(id);
    navigate(id);
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
    handleTab(location.pathname);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
              handleTab(item.path);
            }
          };

          return (
            <Button
              key={item.id}
              id={`profile-btn-${item.path}`}
              variant={'topics'}
              className={`${tab === item.path ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white' : 'border-[#ACACAC] bg-white text-[#707175]'}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              {item.title}
            </Button>
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
