import React from 'react';
import { Button } from './ui/Button';

type Props = {
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SeeMoreOptions({ setShowOptions }: Props) {
  const handleSeeMore = () => {
    setShowOptions(true);
  };

  return (
    <div className="absolute bottom-0 flex h-[108px] min-h-[108px] w-full items-center justify-center bg-gradient-to-b from-white/60 via-white/80 to-white">
      <Button
        variant="show-more-options"
        className="flex flex-col items-center gap-1"
        rounded=""
        onClick={handleSeeMore}
      >
        <span>Show more options</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path
            d="M2 2L8 8.0649L14 2"
            stroke="#4A8DBD"
            strokeWidth="2.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}
