import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

type Props = {
  questId: string;
};

export default function SeeMoreOptions({ questId }: Props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/post/isfullscreen', {
      state: { questId },
    });
  };

  return (
    <div className="absolute bottom-0 flex h-[108px] min-h-[108px] w-full items-end justify-center bg-gradient-to-b from-white/60 via-white/80 to-white">
      <Button
        variant="show-more-options"
        className="flex flex-col items-center gap-1"
        rounded=""
        onClick={handleNavigate}
      >
        <span>Show more options</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path
            d="M2 2L8 8.0649L14 2"
            stroke="#4A8DBD"
            stroke-width="2.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}
