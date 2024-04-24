import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { Link } from 'react-router-dom';

const createItems = [
  { id: 1, title: 'Verfication Badges', path: '/dashboard/profile', to: '' },
  { id: 0, title: 'Contributions', path: '/dashboard/profile/contributions', to: 'contributions' },
  { id: 2, title: 'Ledger', path: '/dashboard/profile/ledger', to: 'ledger' },
  { id: 3, title: 'Hidden Posts', path: '/dashboard/profile/hidden-posts', to: 'hidden-posts' },
  { id: 4, title: 'Shared Links', path: '/dashboard/profile/shared-links', to: 'shared-links' },
];

export default function ProfileSlider({ setTab, tab }) {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleTab = (id) => {
    const selectedButton = document.getElementById(`profile-btn-${id}`);
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex items-center justify-center px-2 py-[7px] tablet:px-6 tablet:py-[14.82px]">
      {scrollPosition > 0 && (
        <button
          onClick={handleLeftArrowClick}
          className="h-[10px] w-[20px] rotate-180 tablet:h-[21px] tablet:w-14"
          style={{
            background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        ></button>
      )}
      <div
        className="no-scrollbar mx-[5px] flex items-center gap-[6.75px] overflow-x-scroll tablet:mx-4 tablet:gap-[13.82px]"
        id="buttonContainer"
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        {createItems.map((item) => {
          if (windowWidth >= 744 && item.id === 0) {
            return null; // Ignore item with id 0 when window width is less than or equal to 744
          } else {
            return (
              <Link
                id={`profile-btn-${item.path}`}
                key={item.id}
                to={item.to}
                onClick={() => {
                  handleTab(item.path);
                }}
              >
                <Button
                  variant={'topics'}
                  className={`${tab === item.path ? 'bg-[#4A8DBD] text-white' : 'bg-white text-[#ABABAB]'}`}
                >
                  {item.title}
                </Button>
              </Link>
            );
          }
        })}
      </div>
      <button
        onClick={handleRightArrowClick}
        className="h-[10px] w-[20px] tablet:h-[21px] tablet:w-14"
        style={{
          background: `url(${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      ></button>
    </div>
  );
}
