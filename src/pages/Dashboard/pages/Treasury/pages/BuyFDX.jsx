import BuyBalance from '../components/BuyBalance';
import FdxActivity from '../components/FdxActivity';

const BuyFDX = () => {
  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      <BuyBalance />
      <FdxActivity />
    </div>
  );
};

export default BuyFDX;
