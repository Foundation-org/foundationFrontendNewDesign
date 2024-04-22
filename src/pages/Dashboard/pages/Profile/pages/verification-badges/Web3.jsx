import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { web3 } from '../../../../../../constants/varification-badges';
import { startRegistration } from '@simplewebauthn/browser';
import Button from '../../components/Button';
import api from '../../../../../../services/api/Axios';
import { isBrowser, isMobile } from 'react-device-detect';
import { useSDK } from '@metamask/sdk-react';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider, SignInButton, useProfile, useSignIn } from '@farcaster/auth-kit';

export default function Web3({ handleUserInfo, fetchUser, handleRemoveBadgePopup }) {
  const { sdk } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      handleWeb3(accounts[0]);
    } catch (err) {
      console.warn('failed to connect..', err);
    }
  };

  const persistedTheme = useSelector((state) => state.utils.theme);

  const checkWeb3Badge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

  const handleWeb3 = async (accounts) => {
    try {
      const addBadge = await api.post(`/addBadge/web3/add`, {
        web3: {
          ['etherium-wallet']: accounts,
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

  const checkPassKeyBadge = (accountName, type, value) => {
    return fetchUser?.badges.some((badge) => badge.accountName === accountName && badge.type === type);
  };
  const handlePasskey = async (title, type, value) => {
    console.log('🚀 ~ handlePasskey ~ value:', value);
    console.log('🚀 ~ handlePasskey ~ title, type:', title, type);
    try {
      // Device Detect
      if (type === 'desktop' && !isBrowser) {
        return toast.warning('Please switch to desktop!');
      }
      if (type === 'mobile' && !isMobile) {
        return toast.warning('Please switch to mobile!');
      }
      // let value;
      if (title.trim() === 'Passkey Desktop' || title.trim() === 'Passkey Mobile') {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/generate-registration-options`);
        const data = await resp.json();
        const attResp = await startRegistration(data);
        attResp.challenge = data.challenge;
        const verificationResp = await fetch(`${import.meta.env.VITE_API_URL}/verify-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attResp),
        });
        const verificationJSON = await verificationResp.json();
        console.log('🚀 ~ handleRegistration ~ verificationResp:', verificationResp);

        if (verificationJSON && verificationJSON.verified) {
          value = attResp;
        } else {
          toast.error(`Oh no, something went wrong!`);
        }
      }
      if (value === '') {
        return;
      }
      let addBadge;
      if (title.trim() === 'Passkey Desktop' || title.trim() === 'Passkey Mobile') {
        addBadge = await api.post(`/addBadge/passkey/add`, {
          uuid: fetchUser.uuid,
          accountId: value.id,
          accountName: 'Passkey',
          isVerified: true,
          type: type,
          data: value,
        });
      } else if (title.trim() === 'Farcaster') {
        addBadge = await api.post(`/addBadge/addFarCasterBadge/add`, {
          uuid: fetchUser.uuid,
          accountId: value.fid,
          accountName: title,
          isVerified: true,
          type: type,
          data: value,
        });
        setIsButtonClicked(false);
        // alert("testing...   ")
        console.log('🚀 ~ handlePasskey ~ value:', value);
      }
      if (addBadge?.status === 200) {
        toast.success('Badge Added Successfully!');
        handleUserInfo();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message.split(':')[1]);
    }
  };
  const config = {
    // relay: "https://relay.farcaster.xyz",
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'on.foundation',
    siweUri: 'https://example.com/login',
  };

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const triggerFarcaster = () => {
    setIsButtonClicked(true);
    const a = document.querySelector('._1n3pr301');
    a.click();
    // setTimeout(() => {
    // }, 1000);
  };
  return (
    <>
      <h1 className="font-500 font-Inter mb-[5px] mt-3 text-[9.74px] font-medium text-black tablet:text-[1.7vw] dark:text-white">
        Web 3
      </h1>
      <AuthKitProvider config={config}>
        <div className="hidden">
          <SignInButton
            onClick={() => console.log('testing clicking....')}
            // onStatusResponse={(res) => console.log("status callback:", res)}
            onSuccess={
              (data) => {
                // alert("testing...")
                // console.log("testing...");
                isButtonClicked && handlePasskey('Farcaster', 'farcaster', data);
              }
              // console.log(`Hello, ${username}! Your fid is ${fid} ${data}.`)
              // console.log(data)
            }
          />
        </div>
      </AuthKitProvider>
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
                color={checkPassKeyBadge('Passkey', item.type) || checkWeb3Badge(item.type) ? 'red' : item.ButtonColor}
                onClick={() => {
                  item.type === 'etherium-wallet'
                    ? checkWeb3Badge(item.type)
                      ? handleRemoveBadgePopup({
                          title: item.title,
                          image: item.image,
                          type: item.type,
                          badgeType: 'etherium-wallet',
                        })
                      : connect()
                    : checkPassKeyBadge('Passkey', item.type)
                      ? handleRemoveBadgePopup({
                          title: item.title,
                          image: item.image,
                          type: item.type,
                          badgeType: 'passkey',
                          accountName: 'Passkey',
                        })
                      : handlePasskey(item?.title, item?.type);
                }}
                disabled={item.disabled}
              >
                {checkPassKeyBadge('Passkey', item.type) || checkWeb3Badge(item.type) ? 'Remove' : item.ButtonText}
                {!checkPassKeyBadge('Passkey', item.type) && !checkWeb3Badge(item.type) && (
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
                color={checkPassKeyBadge(item.accountName, item.type) ? 'red' : item.ButtonColor}
                onClick={() => {
                  // alert("hello2...")
                  item.accountName === 'Farcaster' && !checkPassKeyBadge(item.accountName, item.type)
                    ? triggerFarcaster()
                    : checkPassKeyBadge(item.accountName, item.type)
                      ? handleRemoveBadgePopup({
                          title: item.title,
                          image: item.image,
                          type: item.type,
                          badgeType: item.badgeType,
                          accountName: item.accountName,
                        })
                      : handlePasskey(item?.title, item?.type);
                }}
                disabled={item.disabled}
              >
                {checkPassKeyBadge(item.accountName, item.type) ? 'Remove' : item.ButtonText}
                {!checkPassKeyBadge(item.accountName, item.type) && (
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
              color={
                checkPassKeyBadge(item.accountName, item.type) || checkWeb3Badge(item.type) ? 'red' : item.ButtonColor
              }
              onClick={() => {
                item.accountName === 'Farcaster' && !checkPassKeyBadge(item.accountName, item.type)
                  ? triggerFarcaster()
                  : item.type === 'etherium-wallet'
                    ? checkWeb3Badge(item.type)
                      ? handleRemoveBadgePopup({
                          title: item.title,
                          image: item.image,
                          type: item.type,
                          badgeType: 'etherium-wallet',
                        })
                      : connect()
                    : checkPassKeyBadge(item.accountName, item.type)
                      ? handleRemoveBadgePopup({
                          title: item.title,
                          image: item.image,
                          type: item.type,
                          badgeType: item.badgeType,
                          accountName: item.accountName,
                        })
                      : handlePasskey(item?.title, item?.type);
              }}
              disabled={item.disabled}
            >
              {checkPassKeyBadge(item.accountName, item.type) || checkWeb3Badge(item.type) ? 'Remove' : item.ButtonText}
              {!checkPassKeyBadge(item.accountName, item.type) && !checkWeb3Badge(item.type) && (
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
