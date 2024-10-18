import React, { useState } from 'react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { ethers } from 'ethers';
import ABI from '../../../../../../src/contracts/TokenTransfer/TokenTransfer.json';

function Withdrawls() {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [dollar, setDollar] = useState(0);

  const handleFdxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fdxValue = parseFloat(e.target.value);
    setDollar(fdxValue);
  };

  const checkWeb3Badge = () =>
    persistedUserInfo?.badges?.some((badge: any) => badge?.web3?.hasOwnProperty('etherium-wallet') || false) || false;

  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (dollar <= 0 || Number.isNaN(dollar)) {
      toast.warning('Please enter a valid value');
      return;
    }

    if (dollar > persistedUserInfo?.balance) {
      toast.warning('Insufficient balance');
      return;
    }

    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(import.meta.env.VITE_TRANSFERTOKEN_AGREEMENT, ABI, signer);
        const toAddress = persistedUserInfo?.badges?.find((badge: any) =>
          badge?.web3?.hasOwnProperty('etherium-wallet'),
        )?.web3['etherium-wallet'];
        const transaction = await contract.transferTokens(toAddress, {
          value: ethers.utils.parseEther('0.0000000000000001'),
        });

        const receipt = await transaction.wait();
        console.log('Withdrawl Successfull', receipt);
        toast.success('Withdrawl Successfull');
        window.location.reload();
      } else {
        toast.error('Please install metamask first');
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        <form
          className="mt-3 flex flex-col items-center justify-center gap-[6px] tablet:mt-5 tablet:gap-3"
          onSubmit={handleWithdraw}
        >
          <div className="flex w-full items-center justify-center gap-2 tablet:gap-6">
            <h1 className="text-[9px] font-semibold leading-[113%] text-[#85898C] tablet:text-[20px] tablet:leading-normal">
              FDX
            </h1>
            <input
              type="number"
              placeholder="e.g 10"
              value={dollar}
              onChange={handleFdxChange}
              className="w-full rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 py-[4.5px] text-[9.053px] font-semibold leading-normal focus:outline-none tablet:rounded-[9.228px] tablet:border-[3px] tablet:px-4 tablet:py-[9px] tablet:text-[20px]"
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-end">
              {!checkWeb3Badge() ? (
                <p className="text-[9px] font-normal leading-[113%] text-red-500 tablet:text-[16px] tablet:font-medium tablet:leading-normal">
                  Please add Ethereum badge first!
                </p>
              ) : (
                <></>
              )}
            </div>
            {checkWeb3Badge() ? (
              <Button variant="submit" type="submit">
                Withdraw
              </Button>
            ) : (
              <Button variant="hollow-submit" type="submit" disabled={true}>
                Withdraw
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Withdrawls;
