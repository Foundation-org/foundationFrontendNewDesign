import { useState } from 'react';
import { socials } from '../../../../../../constants/varification-badges';
import { useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { getAskPassword } from '../../../../../../features/profile/userSettingSlice';
import { FaSpinner } from 'react-icons/fa';
import { AuthKitProvider, SignInButton } from '@farcaster/auth-kit';

const Social = ({
  handleRemoveBadgePopup,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  checkSocial,
  checkPrimary,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [loading, setLoading] = useState({ state: false, badge: '' });

  const handleFarcaster = async (title, type, value) => {
    try {
      addBadge = await api.post(`/addBadge/addFarCasterBadge/add`, {
        uuid: persistedUserInfo.uuid,
        accountId: value.fid,
        accountName: title,
        isVerified: true,
        type: type,
        data: value,
      });
      setIsButtonClicked(false);
      if (addBadge?.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (err) {
      console.error(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'on.foundation',
    siweUri: 'https://example.com/login',
  };

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const triggerFarcaster = () => {
    setIsButtonClicked(true);
    const a = document.querySelector('._1n3pr301');
    a.click();
  };

  const checkPassKeyBadge = (accountName, type) => {
    return persistedUserInfo?.badges.some((badge) => badge.accountName === accountName && badge.type === type);
  };

  const handleGuestBadgeAdd = () => {
    toast.warning(
      <p>
        Please{' '}
        <span className="cursor-pointer text-[#389CE3] underline" onClick={() => navigate('/guest-signup')}>
          Create an Account
        </span>{' '}
        to unlock this feature
      </p>,
    );
    return;
  };

  return (
    <>
      <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
        Adding social media accounts helps verify that you're a real human contributing to the Foundation platform.
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
                isButtonClicked && handleFarcaster('Farcaster', 'farcaster', data);
              }
              // console.log(`Hello, ${username}! Your fid is ${fid} ${data}.`)
              // console.log(data)
            }
          />
        </div>
        <div className="hidden"></div>
      </AuthKitProvider>
      <div className="flex flex-col items-center justify-between rounded-[16.068px] pt-[10px] tablet:pt-[18.73px]">
        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {socials.map((item, index) => (
            <div
              className="relative flex items-center justify-between gap-[8.5px] laptop:gap-2 desktop:gap-5"
              key={index}
            >
              <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
                {checkPrimary(item.accountName) && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                    alt="primary"
                    className="size-[15px] tablet:size-[30px]"
                  />
                )}
              </div>
              <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
              <div
                className={` flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
              >
                <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                  {item.title}
                </h1>
              </div>
              <Button
                disabled={(loading.state === true && item.accountName) || checkPrimary(item.accountName)}
                variant={
                  checkSocial(item.accountName)
                    ? checkPrimary(item.accountName)
                      ? 'verification-badge-edit'
                      : 'verification-badge-remove'
                    : 'submit'
                }
                onClick={async () => {
                  if (persistedUserInfo?.role === 'guest') {
                    handleGuestBadgeAdd();
                    return;
                  }
                  if (item.accountName === 'Farcaster' && !checkPassKeyBadge(item.accountName, item.type)) {
                    triggerFarcaster();
                    return;
                  }
                  if (checkSocial(item.accountName)) {
                    handleRemoveBadgePopup({
                      title: item.title,
                      image: item.image,
                      type: item.type,
                      badgeType: item.badgeType,
                      accountName: item.accountName,
                    });
                  } else {
                    if (
                      (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                      (checkLegacyBadge() && getAskPasswordFromRedux)
                    ) {
                      await handleOpenPasswordConfirmation();
                    }
                    setLoading({ state: true, badge: item.accountName });
                    localStorage.setItem('target-url', `${window.location.href}`);
                    window.location.href = `${import.meta.env.VITE_API_URL}${item.link}`;
                  }
                }}
              >
                {loading.state === true && loading.badge === item.accountName ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : (
                  <>
                    {checkSocial(item.accountName) ? (checkPrimary(item.accountName) ? 'Added' : 'Remove') : 'Add'}
                    <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                      {checkSocial(item.accountName) ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                    </span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Social;
