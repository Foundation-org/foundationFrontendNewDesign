import { useState } from 'react';
import { Button } from '../../../../../../components/ui/Button';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import ABI from '../../../../../../contracts/TokenTransfer/TokenTransfer.json';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';

export default function WithdrawBalance() {
  const [dollar, setDollar] = useState(0);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

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
      const accounts = (await sdk?.connect()) as string[] | null;

      if (!accounts || accounts.length === 0) {
        toast.error('No accounts found. Please connect your wallet.');
        return;
      }

      console.log(accounts);

      if (connected && provider) {
        console.log(connected, provider);

        const web3 = new Web3(provider);

        const contract = new web3.eth.Contract(ABI, import.meta.env.VITE_TRANSFERTOKEN_AGREEMENT);

        const toAddress = persistedUserInfo?.badges?.find((badge: any) =>
          badge?.web3?.hasOwnProperty('etherium-wallet'),
        )?.web3['etherium-wallet'];

        console.log({ toAddress });

        // Convert dollar value to Wei
        const amountInWei = web3.utils.toWei(dollar.toString(), 'ether');

        // Calling the transferTokens method on the contract
        const transaction = await contract.methods.transferTokens(toAddress, amountInWei).send({
          from: accounts[0],
        });

        console.log({ transaction });
        toast.success('withdraw successful');

        // const provider = new ethers.BrowserProvider(window.ethereum);
        // const signer = await provider.getSigner();
        // const contract = new ethers.Contract(import.meta.env.VITE_TRANSFERTOKEN_AGREEMENT, ABI, signer);
        // const toAddress = persistedUserInfo?.badges?.find((badge: any) =>
        //   badge?.web3?.hasOwnProperty('etherium-wallet'),
        // )?.web3['etherium-wallet'];
        // const transaction = await contract.transferTokens(toAddress, {
        //   value: ethers.utils.parseEther('0.0000000000000001'),
        // });
        // const receipt = await transaction.wait();
        // console.log('Withdrawl Successfull', receipt);
        // toast.success('Withdrawl Successfull');
        // window.location.reload();
      } else {
        toast.error('Please install metamask first');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
  );
}
