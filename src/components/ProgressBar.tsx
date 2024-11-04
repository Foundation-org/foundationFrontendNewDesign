import { Button } from './ui/Button';

interface ProgressBarProps {
  progress: number;
  handleSkip: () => void;
  buttonText: any;
}

export default function ProgressBar({ progress, handleSkip, buttonText }: ProgressBarProps) {
  return (
    <div className="px-5 tablet:px-[60px] laptop:px-[80px]">
      <div className="w-full rounded-md bg-white-400">
        <div
          className="h-[6px] rounded-md bg-[#4caf50] tablet:h-[10px]"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
      <p className="summary-text">{`Progress: ${progress}%`}</p>
      {handleSkip && (
        <div className="flex flex-col items-center pb-[15px] tablet:pb-[25px]">
          <Button variant="submit" onClick={handleSkip}>
            {buttonText ? buttonText : 'Skip'}
          </Button>
        </div>
      )}
    </div>
  );
}
