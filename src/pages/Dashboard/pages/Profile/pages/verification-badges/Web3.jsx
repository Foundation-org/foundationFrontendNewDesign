import { toast } from 'sonner';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { web3 } from '../../../../../../constants/varification-badges';
import { startRegistration } from '@simplewebauthn/browser';
import Button from '../../components/Button';
import { useErrorBoundary } from 'react-error-boundary';
import api from '../../../../../../services/api/Axios';
import { isBrowser, isMobile } from 'react-device-detect';

export default function Web3({ handleUserInfo, fetchUser, handleRemoveBadgePopup }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const { showBoundary } = useErrorBoundary();

  const handleComingSoon = () => {
    toast.info('This badge will soon be available for mobile.');
  };

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
      // showBoundary(error);
      console.error(error);
    }
  };

  const checkPassKeyBadge = (accountName, type) => {
    return fetchUser?.badges.some((badge) => badge.accountName === accountName && badge.type === type)
  }
  const handlePasskey = async (title, type) => {
    try {
      // Device Detect
      if(type === 'desktop' && !isBrowser){
        return toast.warning("Please switch to desktop!")
      }
      if(type === 'mobile' && !isMobile){
        return toast.warning("Please switch to mobile!")
      }
      let value;
      if (title.trim() === 'Passkey Desktop' || title.trim() === 'Passkey Mobile') {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/generate-registration-options`);
        const data = await resp.json();
        // const attResp = await window.SimpleWebAuthnBrowser.startRegistration(data);
        const attResp = await startRegistration(data);
        attResp.challenge = data.challenge
        const verificationResp = await fetch(`${import.meta.env.VITE_API_URL}/verify-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attResp),
        });
        const verificationJSON = await verificationResp.json();
        console.log("🚀 ~ handleRegistration ~ verificationResp:", verificationResp)

        if (verificationJSON && verificationJSON.verified) {
          value = attResp;
        } else {
          toast.error(`Oh no, something went wrong!`);
        }
      }
      if (value === '') {
        return;
      }
      const addBadge = await api.post(`/addBadge/passkey/add`, {
        uuid: fetchUser.uuid,
        accountId: value.id,
        accountName: "Passkey",
        isVerified: true,
        type: type,
        data: value
      });
      if (addBadge.status === 200) {
        toast.success('Badge Added Successfully!');
        handleUserInfo();
      }
    } catch (error) {
      // showBoundary(error);
      console.error(error);
      toast.error(error.response.data.message.split(":")[1])
    }
  };

  return (
    <>
      <h1 className="font-500 font-Inter mb-[5px] mt-3 text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
        Web 3
      </h1>
      <div className="hidden flex-col justify-between rounded-2xl border-[3px] border-[#DEE6F7] py-[17px] tablet:flex tablet:flex-row">
        <div className="flex w-full flex-col items-center gap-[10px] tablet:gap-4 laptop:gap-5">
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
                color={checkPassKeyBadge("Passkey", item.type) ? 'red' : item.ButtonColor}
                onClick={() => {
                  // alert("hello1...")
                  checkPassKeyBadge("Passkey", item.type) ? handleRemoveBadgePopup({
                    title: item.title,
                    image: item.image,
                    type: item.type,
                    badgeType:'passkey',
                    accountName: "Passkey",
                  })
                :handlePasskey(item?.title, item?.type);
                }}
                disabled={item.disabled}
              >
                {checkPassKeyBadge("Passkey", item.type) ? 'Remove' : item.ButtonText}
                {!checkPassKeyBadge("Passkey", item.type) && (
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[3px] laptop:pl-[10px] laptop:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className="w-2 rounded-[16px] border-[3px] border-[#DEE6F7] bg-[#FDFDFD]" />
        <div className="flex w-full flex-col items-center gap-7 tablet:gap-4 laptop:gap-5">
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
                color={checkPassKeyBadge("Passkey", item.type) ? 'red' : item.ButtonColor}
                onClick={() => {
                  // alert("hello2...")
                  checkPassKeyBadge("Passkey", item.type) ? handleRemoveBadgePopup({
                    title: item.title,
                    image: item.image,
                    type: item.type,
                    badgeType:'passkey',
                    accountName: "Passkey",
                  })
                :handlePasskey(item?.title, item?.type);
                }}
                disabled={item.disabled}
              >
                {checkPassKeyBadge("Passkey", item.type) ? 'Remove' : item.ButtonText}
                {!checkPassKeyBadge("Passkey", item.type) && (
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
            color={checkPassKeyBadge("Passkey", item.type) ? 'red' : item.ButtonColor}
            onClick={() => {
              // alert("hello3...")
              checkPassKeyBadge("Passkey", item.type) ? handleRemoveBadgePopup({
                title: item.title,
                image: item.image,
                type: item.type,
                badgeType:'passkey',
                accountName: "Passkey",
              })
            :handlePasskey(item?.title, item?.type);
            }}
            disabled={item.disabled}
          >
            {checkPassKeyBadge("Passkey", item.type) ? 'Remove' : item.ButtonText}
            {!checkPassKeyBadge("Passkey", item.type) && (
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
