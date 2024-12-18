import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import PopUp from '../ui/PopUp';

const SendMessageFromDomain = ({ isPopup, setIsPopup, title, logo }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const stripeBadge = persistedUserInfo?.badges?.find((badge) => badge.type === 'stripe');

  if (!stripeBadge) {
    return <div>No Stripe Badge Found</div>;
  }

  const handleClose = () => setIsPopup(false);

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo} customClasses={'overflow-y-auto'}>
      <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text">Need summary text here</h1>
        <div className="flex w-full items-center justify-center">
          {stripeBadge.data?.qrCode ? (
            <img src={stripeBadge.data.qrCode} alt="Stripe QR Code" className="size-[150px] tablet:size-[200px]" />
          ) : (
            <p>QR Code not available</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="cancel" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </PopUp>
  );
};

export default SendMessageFromDomain;
