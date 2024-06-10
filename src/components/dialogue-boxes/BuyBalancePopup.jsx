import PopUp from '../ui/PopUp';
import Stripe from '../payments/Stripe';
import Paypal from '../payments/paypal';

export default function BuyBalancePopup({
  handleClose,
  modalVisible,
  title,
  image,
  paymentMethod,
  dollar,
  stripeClientSecret,
  clientToken,
}) {
  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose} isBackground={true} autoSize={true}>
      <div className="flex flex-col gap-2 px-[18px] py-[10px] tablet:gap-[15px] tablet:px-[55px] tablet:py-[25px]">
        {paymentMethod === 'stripe' && <Stripe clientSecret={stripeClientSecret} />}
        {paymentMethod === 'paypal' && <Paypal clientToken={clientToken} dollar={dollar} handleClose={handleClose} />}
      </div>
    </PopUp>
  );
}
