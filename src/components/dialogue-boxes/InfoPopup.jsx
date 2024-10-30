import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';

const InfoPopup = ({ isPopup, title, logo, message, message2, message3, buttonText, handleSkip, onboarding }) => {
  const handleClose = () => setIsPopup(false);
  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
            {message}
          </h1>
          <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
            {message2}
          </h1>
          <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
            {message3}
          </h1>
        </div>
        {onboarding && (
          <div className="flex flex-col items-center pb-[15px] tablet:pb-[25px]">
            <Button variant="submit" onClick={handleSkip}>
              {buttonText}
            </Button>
          </div>
        )}
      </PopUp>
    </>
  );
};

export default InfoPopup;
