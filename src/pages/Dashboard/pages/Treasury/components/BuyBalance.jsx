import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button';
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6';
import { paypalTokenGenerate } from '../../../../../services/api/payments';
import BuyBalancePopup from '../../../../../components/dialogue-boxes/BuyBalancePopup';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_URL;

const BuyBalance = () => {
  const location = useLocation();
  const [dollar, setDollar] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [clientToken, setClientToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const persistedUserInfo = useSelector((state) => state.auth.user);

  const handleClose = () => setModalVisible(false);
  const handleCreate = () => {
    if (dollar < 2.5) return toast.warning('Minimum amount is 2.5$');
    if (!paymentMethod) return toast.warning('Select a payment method');
    setModalVisible(true);
    localStorage.setItem('paymentMethod', paymentMethod);
  };

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const redirectStatus = queryParams.get('redirect_status');

  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        if (paymentMethod === 'stripe' && dollar > 2.5) {
          const response = await axios.post(`${BASE_URL}/finance/getStripePaymentIntent`, {
            amount: dollar,
            currency: 'usd',
          });
          localStorage.setItem('scs', response.data.clientSecret);
          setStripeClientSecret(response.data.clientSecret);
        }
        if (paymentMethod === 'paypal' && dollar > 2.5) {
          const token = await paypalTokenGenerate();
          setClientToken(token);
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [paymentMethod, dollar]);

  useEffect(() => {
    if (redirectStatus === 'succeeded') {
      setModalVisible(true);
    }
  }, [redirectStatus]);

  return (
    <>
      {modalVisible && (
        <BuyBalancePopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Buy Balance'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buyBalancelogo.svg`}
          dollar={dollar}
          stripeClientSecret={stripeClientSecret}
          clientToken={clientToken}
        />
      )}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/your-fdx.svg`}
              alt={'your-fdx'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Buy FDX</h1>{' '}
          </div>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex w-full max-w-[70px] items-center justify-between rounded-[2.76px] border-[1.17px] border-[#FCD3AD] bg-[#F9F9F9] px-[6px] py-[3px] text-[#7C7C7C] tablet:max-w-[124px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-[18px] tablet:py-2">
                <FaMinus
                  className="w-[7px] cursor-pointer tablet:w-[23px]"
                  onClick={() => {
                    if (dollar * 1 - 1 > 0) setDollar(dollar - 1);
                    else setDollar(0);
                  }}
                />
                <input
                  type="number"
                  className="hide-input-arrows w-full bg-transparent text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] focus:outline-none tablet:text-[20px]"
                  value={dollar === 0 ? '' : dollar}
                  placeholder="0"
                  onChange={(e) => {
                    let x = parseFloat(e.target.value);
                    if (!isNaN(x)) {
                      x = Math.round(x * 100) / 100;
                      if (Number.isInteger(x)) {
                        setDollar(x.toString());
                      } else {
                        setDollar(x);
                      }
                    } else {
                      setDollar(0);
                    }
                  }}
                />

                <FaPlus
                  className="w-[7px] cursor-pointer tablet:w-[23px]"
                  onClick={() => {
                    if (persistedUserInfo.balance - 1 > dollar) {
                      setDollar(dollar * 1 + 1);
                    } else {
                      setDollar(dollar * 1 + (Math.floor(persistedUserInfo.balance) - dollar));
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-[10px] tablet:mt-[14px] tablet:gap-6">
                <button
                  className={`${paymentMethod === 'stripe' ? 'border-[#FCD3AD]' : 'border-[#D9D9D9]'} rounded-[4px] border p-1 tablet:rounded-[10px] tablet:border-2 tablet:p-2`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/Stripe.svg`}
                    alt="Stripe"
                    className="h-2 w-4 tablet:h-4 tablet:w-9"
                  />
                </button>
                <button
                  className={`${paymentMethod === 'paypal' ? 'border-[#FCD3AD]' : 'border-[#D9D9D9]'} rounded-[4px] border px-1 py-[2px] tablet:rounded-[10px] tablet:border-2 tablet:px-2 tablet:py-1`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/PayPal.svg`}
                    alt="Stripe"
                    className="h-3 w-[13.3px] tablet:h-[25px] tablet:w-[30px]"
                  />
                </button>
              </div>
            </div>
            <p className="text-[7px] font-normal leading-normal text-[#85898C] tablet:text-[14.765px]">*2.5$ = 1 FDX</p>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mb-2 tablet:mt-6 ">
            <Button variant={'submit'} onClick={handleCreate} disabled={isLoading}>
              {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Buy More FDX'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyBalance;
