import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const createItems = [
  { id: 8, title: 'Summary', path: '/dashboard/profile', to: '' },
  { id: 1, title: 'Verfication Badges', path: '/dashboard/profile/verification-badges', to: '' },
  { id: 0, title: 'Post activity', path: '/dashboard/profile/post-activity', to: 'post-activity' },
  // { id: 9, title: 'Contributions', path: '/dashboard/profile/contributions' },
  { id: 3, title: 'Hidden Posts', path: '/dashboard/profile/hidden-posts', to: 'hidden-posts' },
  { id: 7, title: 'My Lists', path: '/dashboard/profile/lists', to: 'lists' },
  { id: 4, title: 'Shared Posts', path: '/dashboard/profile/shared-links', to: 'shared-links' },
  { id: 6, title: 'Posts Feedback', path: '/dashboard/profile/feedback', to: 'feedback' },
  { id: 5, title: 'User Settings', path: '/dashboard/profile/user-settings', to: 'user-settings' },
  { id: 2, title: 'My Activity', path: '/dashboard/profile/ledger', to: 'ledger' },
];

export default function ProfileSlider({ setTab, tab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
          // if (windowWidth >= 744 && item.id === 0) {
          //   return null;
          // } else {
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
          // }
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
