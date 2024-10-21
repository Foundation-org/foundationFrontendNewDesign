import { MetaMaskProvider } from '@metamask/sdk-react';
import WithdrawBalance from './WithdrawBalance';

export default function Withdraws() {
  return (
    <div className="h-[calc(100dvh-174px)] overflow-y-auto px-4 no-scrollbar tablet:h-[calc(100dvh-173.63px)] tablet:px-6 laptop:h-[calc(100dvh-96px)]">
      <div className="relative h-fit w-full max-w-[730px] space-y-[9px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:mb-8 tablet:space-y-[15px] tablet:px-5 tablet:py-6">
        <div>
          <h1 className="text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Withdraw FDX
          </h1>
          <p className="text-[9px] font-normal leading-[113%] text-[#85898C] tablet:text-[16px] tablet:font-medium tablet:leading-normal">
            Note: Transaction fee to be paid by user
          </p>
        </div>
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            checkInstallationImmediately: false,
            dappMetadata: {
              name: 'Foundation',
              url: window.location.href,
            },
          }}
        >
          <WithdrawBalance />
        </MetaMaskProvider>
      </div>
    </div>
  );
}
