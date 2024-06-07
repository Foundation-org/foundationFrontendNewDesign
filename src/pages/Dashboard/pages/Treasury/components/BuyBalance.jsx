import { useEffect, useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6';
import BuyBalancePopup from '../../../../../components/dialogue-boxes/BuyBalancePopup';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

const BuyBalance = () => {
  const location = useLocation();
  const [dollar, setDollar] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const persistedUserInfo = useSelector((state) => state.auth.user);

  const handleClose = () => setModalVisible(false);
  const handleCreate = () => {
    setModalVisible(true);
  };

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const redirectStatus = queryParams.get('redirect_status');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (dollar > 10) {
      axios
        .post(`${BASE_URL}/finance/getStripePaymentIntent`, { amount: dollar, currency: 'usd' })
        .then((response) => {
          console.log('resp', response);
          localStorage.setItem('scs', response.data.clientSecret);
          setStripeClientSecret(response.data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [dollar]);

  useEffect(() => {
    if (redirectStatus === 'succeeded') {
      setModalVisible(true);
    }
  }, [redirectStatus]);

  return (
    <div className="flex w-full flex-col justify-between rounded-[5.85px] border-[0.72px] border-[#FFB877] bg-white px-4 py-[11px] tablet:rounded-[15px] tablet:border-[1.846px] tablet:px-[25px] tablet:py-[25px]">
      {modalVisible && (
        <BuyBalancePopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Buy Balance'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buyBalancelogo.svg`}
          stripeClientSecret={stripeClientSecret}
          //   id={questStartData._id}
        />
      )}
      <div>
        <div className="mb-[14px] flex items-center justify-between">
          <h1 className="text-[10px] font-semibold leading-normal text-[#707175] tablet:text-[22px]">Buy balance</h1>
          <p className="text-[7px] font-normal leading-normal text-[#85898C] tablet:text-[14.765px]">*2.5$ = 1 FDX</p>
        </div>
        <div className="flex flex-row items-center justify-between tablet:flex-col tablet:items-start">
          <div className="flex items-center gap-5 tablet:gap-6">
            <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">$</h2>
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
      </div>
      <div className="mt-[18px] flex w-full justify-end tablet:mt-0">
        <Button variant={'cancel'} onClick={handleCreate}>
          {/* {createPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Buy'} */}
          Buy
        </Button>
      </div>
    </div>
  );
};

export default BuyBalance;
