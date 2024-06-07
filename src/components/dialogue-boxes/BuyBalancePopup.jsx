import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuest } from '../../services/api/questsApi';
import { toast } from 'sonner';
import Stripe from '../payments/Stripe';

export const items = ['Pakistan', 'Afghanistan', 'Albania'];

export default function BuyBalancePopup({ handleClose, modalVisible, title, image, stripeClientSecret }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const { mutateAsync: handleDeletePost } = useMutation({
    mutationFn: deleteQuest,
    onSuccess: () => {
      console.log('Post deleted Successfully');
      setIsLoading(false);

      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== id)),
        };
      });

      queryClient.invalidateQueries('treasury');
    },
    onError: (error) => {
      console.log(error.response.data.message);
      if (error.response.data.message === "Quest is involved in Discussion, Quest can't be deleted.") {
        toast.warning(error.response.data.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    },
  });

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose} isBackground={true} autoSize={true}>
      <div className="flex flex-col gap-2 px-[18px] py-[10px] tablet:gap-[15px] tablet:px-[55px] tablet:py-[25px]">
        <div className="flex items-center gap-[10px] tablet:gap-5">
          <button className="flex w-full flex-col gap-1 rounded-[8px] border-[2.64px] border-[#4A8DBD] px-4 py-3 tablet:py-7">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/Stripe.svg`}
              alt="Stripe"
              className="h-5 w-12 tablet:h-6 tablet:w-[60px]"
            />
            <h1 className="text-[10px] font-semibold leading-[12px] text-[#727F96] tablet:text-[18px] tablet:leading-[18px]">
              Stripe
            </h1>
          </button>
          <button className="flex w-full flex-col gap-1 rounded-[8px] border-[2.64px] border-[#E0E0E0] px-4 py-3 tablet:py-7">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/PayPal2.svg`}
              alt="Stripe"
              className="h-[15px] w-[70px] tablet:h-[24px] tablet:w-[112px]"
            />{' '}
            <h1 className="text-[10px] font-semibold leading-[12px] text-[#727F96] tablet:text-[18px] tablet:leading-[18px]">
              Paypal
            </h1>
          </button>
        </div>
        {/* <div className="flex flex-col gap-2">
          <label
            htmlFor="cardNumber"
            className="text-[10px] font-semibold leading-[12px] text-[#707175] tablet:text-[18px] tablet:leading-[18px]"
          >
            Card Number
          </label>
          <input
            type="text"
            className="w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="cardNumber"
              className="text-[10px] font-semibold leading-[12px] text-[#707175] tablet:text-[18px] tablet:leading-[18px]"
            >
              Expiry
            </label>
            <input
              type="text"
              className="w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
              placeholder="MM/YY"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="cardNumber"
              className="text-[10px] font-semibold leading-[12px] text-[#707175] tablet:text-[18px] tablet:leading-[18px]"
            >
              CVC
            </label>
            <input
              type="text"
              className="w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
              placeholder="CVC"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col gap-2">
              <p className="text-[10px] font-semibold leading-[12px] text-[#707175] tablet:text-[18px] tablet:leading-[18px]">
                Country
              </p>
              <div className="dropdown w-full">
                <label
                  tabIndex={0}
                  className="flex w-full items-center justify-between rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
                  onClick={toggleDropdown}
                >
                  Select Contry
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/down-arrow.svg`}
                    alt="down-arrow"
                    className={`h-[2px] w-[4.71px] tablet:h-[6px] tablet:w-[14px] ${
                      isOpen ? 'rotate-180 transform transition-all duration-300' : 'transition-all duration-300'
                    }`}
                  />
                </label>
                {isOpen && (
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[100] w-full rounded-[10px] bg-[#F4F6F6] p-0 py-1 text-[0.5rem] leading-[2] text-white shadow  tablet:rounded-box tablet:text-sm"
                  >
                    {items.map((item, index) => (
                      <li
                        key={index + 1}
                        onClick={() => {
                          //   handleSelect(item);
                          setIsOpen(!open);
                        }}
                        className="rounded-[10px] text-[#9D9D9D] hover:bg-[#ecf0f0] dark:text-white dark:hover:bg-[black]  "
                      >
                        <a className="px-2 py-0.5 tablet:px-4 tablet:py-2">{item}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="cardNumber"
              className="text-[10px] font-semibold leading-[12px] text-[#707175] tablet:text-[18px] tablet:leading-[18px]"
            >
              Postal Code
            </label>
            <input
              type="text"
              className="w-full rounded-[8px] border-[2.64px] border-[#E0E0E0] bg-white px-2 py-[2px] text-[12px] font-medium leading-[20px] text-[#A5ACB8] focus:outline-none tablet:p-4 tablet:text-[18px]"
              placeholder="90123"
            />
          </div>
        </div> */}

        <Stripe clientSecret={stripeClientSecret} />
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[5px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              setIsLoading(true);
              handleDeletePost(id);
            }}
          >
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
