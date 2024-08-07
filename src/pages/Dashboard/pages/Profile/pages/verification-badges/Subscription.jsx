import React from 'react';
import { subscription } from '../../../../../../constants/varification-badges';
import { useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
const SubscriptionItem = ({ item, persistedTheme }) => (
  <div
    className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
  >
    <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
    <div
      className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px] dark:border-gray-100 dark:bg-accent-100`}
    >
      <h1 className="text-[2.11vw] font-medium leading-normal text-black tablet:text-[20px] dark:text-gray-400">
        {item.title}
      </h1>
    </div>

    <Button variant={'submit-hollow'} disabled={item.disabled}>
      Coming Soon
    </Button>
  </div>
);
const Subscription = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <>
      <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] tablet:text-[16px] tablet:leading-normal dark:text-white-400">
        Add Subscriptions Badge and get rewarded.{' '}
      </h1>
      <div className="flex flex-col items-center justify-between gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {subscription.map((item, index) => (
          <SubscriptionItem key={index} item={item} persistedTheme={persistedTheme} />
        ))}
      </div>
    </>
  );
};

export default Subscription;
