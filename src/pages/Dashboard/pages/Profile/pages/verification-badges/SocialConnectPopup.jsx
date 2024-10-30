import PopUp from '../ui/PopUp';

const SocialConnectPopup = ({ isPopup, setIsPopup, title, logo, handleSkip, onboarding }) => {
  const handleClose = () => setIsPopup(false);

  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        {onboarding && (
          <div className="flex flex-col items-center pb-[15px] tablet:pb-[25px]">
            <Button variant="submit" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        )}
      </PopUp>
    </>
  );
};

export default SocialConnectPopup;
