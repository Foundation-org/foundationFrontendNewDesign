import { useState } from 'react';
import { useSelector } from 'react-redux';
import { web3 } from '../../../../../../constants/varification-badges';
import { startRegistration } from '@simplewebauthn/browser';
import api from '../../../../../../services/api/Axios';
import { isBrowser, isMobile } from 'react-device-detect';
import { useSDK } from '@metamask/sdk-react';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider, SignInButton, useProfile, useSignIn } from '@farcaster/auth-kit';
import { useQueryClient } from '@tanstack/react-query';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import showToast from '../../../../../../components/ui/Toast';
import { Button } from '../../../../../../components/ui/Button';
import { CanAdd } from './badgeUtils';
import { toast } from 'sonner';
export default function Web3({
  isVerificationBadge = true,
  handleRemoveBadgePopup,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  getAskPassword,
  checkPseudoBadge,
}) {
  const { sdk } = useSDK();
  const persistedContants = useSelector(getConstantsValues);

  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const checkSecondary = (itemType) =>
    persistedUserInfo?.badges?.some((i) => i.type === itemType && i.secondary === true);

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
    persistedUserInfo?.badges?.some((badge) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

  const handleWeb3 = async (accounts) => {
    try {
      const payload = {
        web3: {
          ['etherium-wallet']: accounts,
        },
        uuid: persistedUserInfo.uuid,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }

      const addBadge = await api.post(`/addBadge/web3/add`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (error) {
      // showBoundary(error);
      console.error(error);
    }
  };

  const checkPassKeyBadge = (accountName, type, value) => {
    return persistedUserInfo?.badges.some((badge) => badge.accountName === accountName && badge.type === type);
  };

  const handlePasskey = async (title, type, value) => {
    try {
      // Device Detect
      if (type === 'desktop' && !isBrowser) {
        return showToast('warning', 'switchDesktop');
      }
      if (type === 'mobile' && !isMobile) {
        return showToast('warning', 'switchMobile');
      }
      // let value;
      if (title.trim() === 'Passkey Desktop' || title.trim() === 'Passkey Mobile') {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/generate-registration-options`);
        const data = await resp.json();
        const attResp = await startRegistration(data);
        console.log('attResp', attResp);
        attResp.challenge = data.challenge;
        const verificationResp = await fetch(`${import.meta.env.VITE_API_URL}/verify-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attResp),
        });
        const verificationJSON = await verificationResp.json();

        if (verificationJSON && verificationJSON.verified) {
          value = attResp;
        } else {
          showToast('error', 'somethingWrong');
        }
      }
      if (value === '') {
        return;
      }
      let addBadge;
      if (title.trim() === 'Passkey Desktop' || title.trim() === 'Passkey Mobile') {
        addBadge = await api.post(`/addBadge/passkey/add`, {
          uuid: persistedUserInfo.uuid,
          accountId: value.id,
          accountName: 'Passkey',
          isVerified: true,
          type: type,
          data: value,
        });
      } else if (title.trim() === 'Farcaster') {
        addBadge = await api.post(`/addBadge/addFarCasterBadge/add`, {
          uuid: persistedUserInfo.uuid,
          accountId: value.fid,
          accountName: title,
          isVerified: true,
          type: type,
          data: value,
        });
        setIsButtonClicked(false);
        // alert("testing...   ")
      }
      if (addBadge?.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
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
      {isVerificationBadge && (
        <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
          Linking your wallet gives you more FDX transaction options.
        </h1>
      )}
      <AuthKitProvider config={config}>
        <div className="hidden">
          <SignInButton
            onClick={() => console.log('testing clicking....')}
            onSuccess={(data) => {
              isButtonClicked && handlePasskey('Farcaster', 'farcaster', data);
            }}
          />
        </div>
        <div className="hidden"></div>
      </AuthKitProvider>
      {/* <div className="hidden flex-col justify-between rounded-2xl border-[3px] border-white-500 py-[17px] tablet:flex tablet:flex-row">
        <div className="flex w-full flex-col items-center gap-[10px] tablet:gap-4 laptop:gap-5">
          {web3.slice(0, Math.ceil(web3.length / 2)).map((item, index) => (
            <div
              className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5  ${item.disabled ? 'opacity-[60%]' : ''}`}
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]"
              />
              <div
                className={`${
                  persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                } flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 text-[2.11vw] font-medium leading-normal text-[#000]  tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
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
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className="w-2 rounded-[16px] border-[3px] border-white-500 bg-[#FDFDFD]" />
        <div className="flex w-full flex-col items-center gap-7 tablet:gap-4 laptop:gap-5">
          {web3.slice(Math.ceil(web3.length / 2)).map((item, index) => (
            <div
              className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5  ${item.disabled ? 'opacity-[60%]' : ''}`}
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]"
              />
              <div
                className={`${
                  persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                } flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 text-[2.11vw] font-medium leading-normal text-[#000]  tablet:h-[3.48vw] tablet:w-[13.9vw] tablet:rounded-[8px] tablet:border-[3px] tablet:text-[1.38vw] laptop:rounded-[15px] dark:text-[#CACACA]`}
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
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                    (+0.96 FDX)
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div className="flex flex-col items-center gap-[7px] tablet:gap-4 laptop:gap-5"> */}
      <div className="flex flex-col items-center gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {web3.map((item, index) => (
          <div
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-[60%]' : ''}`}
            key={index}
          >
            {checkSecondary(item.type) && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/secondary.svg`}
                alt="primary"
                className="size-[15px] tablet:size-[30px]"
              />
            )}
            <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
            <div
              className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-black dark:text-gray-400 tablet:text-[20px]">
                {item.title}
              </h1>
            </div>
            <Button
              variant={
                checkPassKeyBadge(item.accountName, item.type) || checkWeb3Badge(item.type)
                  ? 'verification-badge-remove'
                  : item.ButtonColor
              }
              onClick={async () => {
                if (item.type === 'etherium-wallet') {
                  if (
                    (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                    (checkLegacyBadge() && getAskPassword)
                  ) {
                    const timeRemaining = CanAdd(persistedUserInfo, item.type, 'etherium-wallet');
                    if (timeRemaining === true || checkPseudoBadge()) {
                      await handleOpenPasswordConfirmation();
                    } else {
                      toast.warning(
                        `You need to wait just ${timeRemaining} more days before you can unlock this badge.`
                      );
                    }
                  }
                }
                if (item.accountName === 'Farcaster' && !checkPassKeyBadge(item.accountName, item.type)) {
                  triggerFarcaster();
                } else if (item.type === 'etherium-wallet') {
                  if (checkWeb3Badge(item.type)) {
                    handleRemoveBadgePopup({
                      title: item.title,
                      image: item.image,
                      type: item.type,
                      badgeType: 'web3',
                    });
                  } else {
                    const timeRemaining = CanAdd(persistedUserInfo, item.type, 'etherium-wallet');
                    if (timeRemaining === true || checkPseudoBadge()) {
                      connect();
                    } else {
                      toast.warning(
                        `You need to wait just ${timeRemaining} more days before you can unlock this badge.`
                      );
                    }
                  }
                } else if (checkPassKeyBadge(item.accountName, item.type)) {
                  handleRemoveBadgePopup({
                    title: item.title,
                    image: item.image,
                    type: item.type,
                    badgeType: item.badgeType,
                    accountName: item.accountName,
                  });
                } else {
                  handlePasskey(item?.title, item?.type);
                }
              }}
              disabled={item.disabled}
            >
              {checkPassKeyBadge(item.accountName, item.type) || checkWeb3Badge(item.type) ? 'Remove' : item.ButtonText}
              {!checkPassKeyBadge(item.accountName, item.type) && !checkWeb3Badge(item.type) && (
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                  (+{persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
