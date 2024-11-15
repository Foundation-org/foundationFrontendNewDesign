import { useState } from 'react';
import { Button } from '../../../../../../components/ui/Button';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import ABI from '../../../../../../contracts/TokenTransfer/TokenTransfer.json';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import SummaryCard from '../../../../../../components/SummaryCard';
import ConfirmWithdrawDialogue from './ConfirmWithdrawDialogue';

export default function WithdrawBalance() {
  const [dollar, setDollar] = useState(0);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const toAddress = persistedUserInfo?.badges?.find((badge: any) => badge?.web3?.hasOwnProperty('etherium-wallet'))
    ?.web3['etherium-wallet'];

  const handleFdxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fdxValue = parseFloat(e.target.value);
    setDollar(fdxValue);
  };

  const checkWeb3Badge = () =>
    persistedUserInfo?.badges?.some((badge: any) => badge?.web3?.hasOwnProperty('etherium-wallet') || false) || false;

  const handleWithdraw = async () => {
    if (!checkWeb3Badge()) {
      toast.warning('Please add Ethereum badge first!');
      return;
    }

    if (dollar <= 0 || Number.isNaN(dollar)) {
      toast.warning('Please enter a valid value');
      return;
    }

    if (dollar > persistedUserInfo?.balance) {
      toast.warning('Insufficient balance');
      return;
    }

    try {
      const accounts = (await sdk?.connect()) as string[] | null;

      if (!accounts || accounts.length === 0) {
        toast.error('No accounts found. Please connect your wallet.');
        return;
      }

      if (connected && provider) {
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(ABI, import.meta.env.VITE_TRANSFERTOKEN_AGREEMENT);

        // Convert dollar value to Wei
        const amountInWei = web3.utils.toWei(dollar.toString(), 'ether');

        // Calling the transferTokens method on the contract
        const transaction = await contract.methods.transferTokens(toAddress, amountInWei).send({
          from: accounts[0],
        });

        console.log({ transaction });
        toast.success('withdraw successful');
      } else {
        toast.error('Please install metamask first');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeConfirmWithdraw = () => {
    setConfirmWithdraw(false);
  };

  return (
    <SummaryCard headerIcon="/assets/svgs/crypto-withdraw.svg" headerTitle="Crypto Withdraw">
      <div className="flex flex-col gap-[10px] text-[#707175] tablet:gap-[25px]">
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Token Name
          </p>
          <input
            type="text"
            value="FDX"
            disabled
            className="h-[24px] w-full rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 text-[9.053px] font-semibold leading-normal focus:outline-none tablet:h-[44px] tablet:rounded-[9.228px] tablet:border-[3px] tablet:px-4 tablet:text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Withdraw to
          </p>
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Address
          </p>
          <input
            type="text"
            value={toAddress}
            disabled
            className="h-[24px] w-full rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 text-[9.053px] font-semibold leading-normal focus:outline-none tablet:h-[44px] tablet:rounded-[9.228px] tablet:border-[3px] tablet:px-4 tablet:text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Withdrawal Network
          </p>
          <input
            type="text"
            value="ERC20"
            disabled
            className="h-[24px] w-full rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 text-[9.053px] font-semibold leading-normal focus:outline-none tablet:h-[44px] tablet:rounded-[9.228px] tablet:border-[3px] tablet:px-4 tablet:text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] text-[#85898C] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Amount Withdraw
          </p>
          <div className="flex items-center gap-5">
            <div className="relative w-full max-w-[380px]">
              <input
                type="number"
                value={dollar}
                onChange={handleFdxChange}
                className="h-[24px] w-full rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 text-[9.053px] font-semibold leading-normal focus:outline-none tablet:h-[44px] tablet:rounded-[9.228px] tablet:border-[3px] tablet:px-4 tablet:text-[18px]"
              />
              <div className="absolute flex w-full justify-between gap-2 tablet:gap-[15px]">
                <p className="text-[10px] font-normal leading-[113%] tablet:text-[18px] tablet:leading-normal">
                  Remaining Amount
                </p>
                <p className="text-[10px] font-normal leading-[113%] tablet:text-[18px] tablet:leading-normal">
                  {Number(persistedUserInfo?.balance || 0) - Number(dollar || 0)} FDX
                </p>
              </div>
            </div>
            <p className="text-nowrap text-end text-[9px] font-semibold leading-[113%] text-green-200 tablet:text-[15px] tablet:leading-[15px]">
              Available Amount = {persistedUserInfo.balance.toFixed(2)} FDX
            </p>
          </div>
        </div>
        <Button
          variant={checkWeb3Badge() ? 'submit' : 'hollow-submit'}
          type="submit"
          disabled={checkWeb3Badge() ? false : true}
          onClick={() => {
            setConfirmWithdraw(true);
          }}
          className="max-w-1/2 tablet:max-w-1/2 mx-auto mt-[10px] w-1/2 tablet:mt-[25px] tablet:min-w-[50%]"
        >
          Withdraw
        </Button>
      </div>
      {confirmWithdraw && (
        <ConfirmWithdrawDialogue
          handleClose={closeConfirmWithdraw}
          modalVisible={confirmWithdraw}
          title={'Confirm Withdrawal'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/confirm-withdraw.svg`}
          handleWithdraw={handleWithdraw}
          address={toAddress}
          amount={dollar}
        />
      )}
    </SummaryCard>
  );
}
