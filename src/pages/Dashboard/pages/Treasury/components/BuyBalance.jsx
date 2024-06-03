import { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa6';
import BuyBalancePopup from '../../../../../components/dialogue-boxes/BuyBalancePopup';

const BuyBalance = () => {
  const [fdx, setFdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => setModalVisible(false);

  const handleCreate = () => {
    setModalVisible(true);
    // const persistedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

    // if (persistedUserInfo?.role === 'guest') {
    //   toast.warning(
    //     <p>
    //       Please{' '}
    //       <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
    //         Create an Account
    //       </span>{' '}
    //       to unlock this feature
    //     </p>,
    //   );
    //   return;
    // } else {
    //   if (fdx === 0) return toast.error('Please select the amount');
    //   if (description === '') return toast.error('You cannot leave the description field blank');
    //   let newExpiryDate;
    //   if (expiry === '30 days') {
    //     const currentDate = new Date();
    //     currentDate.setDate(currentDate.getDate() + 30);
    //     newExpiryDate = currentDate.toISOString().split('T')[0];
    //   } else if (expiry === '7 days') {
    //     const currentDate = new Date();
    //     currentDate.setDate(currentDate.getDate() + 7);
    //     newExpiryDate = currentDate.toISOString();
    //   } else {
    //     newExpiryDate = null;
    //   }
    //   const params = {
    //     creator: persistedUserInfo._id,
    //     owner: persistedUserInfo._id,
    //     uuid: persistedUserInfo.uuid,
    //     amount: fdx,
    //     description: description,
    //     to: 'any',
    //     expiry: newExpiryDate,
    //   };
    //   createRedemptionCode(params);
    // }
  };

  return (
    <div className="flex w-full flex-col justify-between rounded-[5.85px] border-[0.72px] border-[#FFB877] bg-white px-4 py-[11px] tablet:rounded-[15px] tablet:border-[1.846px] tablet:px-[25px] tablet:py-[25px]">
      {modalVisible && (
        <BuyBalancePopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Buy Balance'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buyBalancelogo.svg`}
          //   id={questStartData._id}
        />
      )}
      <div>
        <div className="mb-[14px] flex items-center justify-between">
          <h1 className="text-[10px] font-semibold leading-normal text-[#707175] tablet:text-[22px]">Buy balance</h1>
          <p className="text-[7px] font-normal leading-normal text-[#85898C] tablet:text-[14.765px]">*2.5$ = 1 FDX</p>
        </div>
        <div className="flex items-center gap-5 tablet:gap-6">
          <h2 className="text-[10px] font-semibold leading-normal text-[#7C7C7C] tablet:text-[20px]">$</h2>
          <div className="flex w-full max-w-[70px] items-center justify-between rounded-[2.76px] border-[1.17px] border-[#FCD3AD] bg-[#F9F9F9] px-[6px] py-[3px] text-[#7C7C7C] tablet:max-w-[124px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-[18px] tablet:py-2">
            <FaMinus
              className="w-[7px] cursor-pointer tablet:w-[23px]"
              onClick={() => {
                if (fdx * 1 - 1 > 0) setFdx(fdx - 1);
                else setFdx(0);
              }}
            />
            <input
              type="number"
              className="hide-input-arrows w-full bg-transparent text-center text-[10px] font-semibold leading-normal text-[#7C7C7C] focus:outline-none tablet:text-[20px]"
              value={fdx === 0 ? '' : fdx}
              placeholder="0"
              onChange={(e) => {
                let x = parseFloat(e.target.value);
                if (!isNaN(x)) {
                  x = Math.round(x * 100) / 100;
                  if (Number.isInteger(x)) {
                    setFdx(x.toString());
                  } else {
                    setFdx(x);
                  }
                } else {
                  setFdx(0);
                }
              }}
            />

            <FaPlus
              className="w-[7px] cursor-pointer tablet:w-[23px]"
              onClick={() => {
                if (persistedUserInfo.balance - 1 > fdx) {
                  setFdx(fdx * 1 + 1);
                } else {
                  setFdx(fdx * 1 + (Math.floor(persistedUserInfo.balance) - fdx));
                }
              }}
            />
          </div>
        </div>
        <div className="mt-[14px] flex items-center tablet:gap-6">
          <button className="rounded-[10px] border-2 border-[#D9D9D9] p-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/Stripe.svg`}
              alt="Stripe"
              className="tablet:h-4 tablet:w-9"
            />
          </button>
          <button className="rounded-[10px] border-2 border-[#D9D9D9] px-2 py-1">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/PayPal.svg`}
              alt="Stripe"
              className="tablet:h-[25px] tablet:w-[30px]"
            />
          </button>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button variant={'cancel'} onClick={handleCreate}>
          {/* {createPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Buy'} */}
          Buy
        </Button>
      </div>
    </div>
  );
};

export default BuyBalance;
