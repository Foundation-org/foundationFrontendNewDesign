import { toast } from 'sonner';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { web3 } from '../../../../../../constants/varification-badges';
import Button from '../../components/Button';
import { useErrorBoundary } from 'react-error-boundary';
import api from '../../../../../../services/api/Axios';

export default function Web3({ handleUserInfo, fetchUser }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const { showBoundary } = useErrorBoundary();

  const checkWeb3Badge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

  const handleWeb3 = async (title, type) => {
    try {
      let value;
      if (title.trim() === 'Ethereum Wallet') {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const _walletAddress = await signer.getAddress();
          value = _walletAddress;
        } else {
          console.log('Wallet not detected');
          toast.warning('Please install an Ethereum wallet');
          return;
        }
      }
      if (value === '') {
        return;
      }
      const addBadge = await api.post(`/addBadge/web3/add`, {
        web3: {
          [type]: value,
        },
        uuid: fetchUser.uuid,
      });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleUserInfo();
      }
    } catch (error) {
      showBoundary(error);
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="font-500 font-Inter mb-[5px] mt-3 text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
        Web 3
      </h1>
      <div className="hidden flex-col justify-between gap-[7px] rounded-2xl border-[3px] border-[#DEE6F7] p-[17px] tablet:flex tablet:flex-row tablet:gap-5 laptop:gap-6">
        <div className="flex flex-col gap-[10px] tablet:gap-4 laptop:gap-5">
          {web3.slice(0, Math.ceil(web3.length / 2)).map((item, index) => (
            <div
              className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5  ${item.disabled ? 'opacity-[60%]' : ''}`}
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
              />
              <div
                className={`${
                  persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000]  tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
              >
                <h1>{item.title}</h1>
              </div>
              <Button
                color={checkWeb3Badge(item.type) ? 'yellow' : item.ButtonColor}
                onClick={() => {
                  !checkWeb3Badge(item.type) && handleWeb3(item?.title, item?.type);
                }}
                disabled={item.disabled}
              >
                {checkWeb3Badge(item.type) ? 'Added' : item.ButtonText}
                {!checkWeb3Badge(item.type) && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className="w-2 rounded-[16px] border-[3px] border-[#DEE6F7] bg-[#FDFDFD]" />
        <div className="flex flex-col gap-7 tablet:gap-4 laptop:gap-5">
          {web3.slice(Math.ceil(web3.length / 2)).map((item, index) => (
            <div
              className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5  ${item.disabled ? 'opacity-[60%]' : ''}`}
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
              />
              <div
                className={`${
                  persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000]  tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
              >
                <h1>{item.title}</h1>
              </div>
              <Button
                color={checkWeb3Badge(item.type) ? 'yellow' : item.ButtonColor}
                onClick={() => {
                  !checkWeb3Badge(item.type) && handleWeb3(item?.title, item?.type);
                }}
                disabled={item.disabled}
              >
                {checkWeb3Badge(item.type) ? 'Added' : item.ButtonText}
                {!checkWeb3Badge(item.type) && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-[7px] tablet:hidden tablet:gap-4 laptop:gap-5">
        {web3.map((item, index) => (
          <div
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5  ${item.disabled ? 'opacity-[60%]' : ''}`}
            key={index}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[6.389vw] w-[6.389vw] tablet:h-[3.48vw] tablet:w-[3.48vw]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              } flex h-[7.3vw] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] text-[2.11vw] font-medium leading-normal text-[#000]  tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
            >
              <h1>{item.title}</h1>
            </div>
            <Button
              color={checkWeb3Badge(item.type) ? 'yellow' : item.ButtonColor}
              onClick={() => {
                !checkWeb3Badge(item.type) && handleWeb3(item?.title, item?.type);
              }}
              disabled={item.disabled}
            >
              {checkWeb3Badge(item.type) ? 'Added' : item.ButtonText}
              {!checkWeb3Badge(item.type) && (
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                  (+0.96 FDX)
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
