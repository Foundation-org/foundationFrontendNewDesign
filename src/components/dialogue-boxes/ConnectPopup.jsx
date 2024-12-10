import { useEffect, useState } from 'react';
import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import ProgressBar from '../ProgressBar';

const ConnectPopup = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  accountName,
  // handleSkip,
  // onboarding,
  // progress,
  summaryText,
  handleConnect
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => setIsPopup(false);
  const [loading, setLoading] = useState({ state: false, badge: '' });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible
        if (loading.state) {
          // If loading state was true, clear it
          setLoading({ state: false, badge: '' });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading.state]);

  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text">{summaryText}</h1>
          <div className="flex justify-end">
            <Button variant="submit" className="w-fit" onClick={handleConnect}>
              {loading.state === true && loading.badge === accountName ? (
                <FaSpinner className="animate-spin text-[#EAEAEA]" />
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        </div>
        {/* {onboarding && <ProgressBar handleSkip={handleSkip} />} */}
      </PopUp>
    </>
  );
};

export default ConnectPopup;
