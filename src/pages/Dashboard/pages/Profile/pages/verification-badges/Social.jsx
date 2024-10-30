import { useEffect, useState } from 'react';
import { socials } from '../../../../../../constants/varification-badges';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { getAskPassword } from '../../../../../../features/profile/userSettingSlice';
import { FaSpinner } from 'react-icons/fa';
import { AuthKitProvider, SignInButton } from '@farcaster/auth-kit';
import api from '../../../../../../services/api/Axios';
import showToast from '../../../../../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CanAdd } from './badgeUtils';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';

const Social = ({
  handleRemoveBadgePopup,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  checkSocial,
  checkPrimary,
  checkPseudoBadge,
}) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [loading, setLoading] = useState({ state: false, badge: '' });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const queryClient = useQueryClient();
  const filteredSocials = socials.filter((item) => {
    // Check if the user is limited and if the item is Facebook
    if ('test@foundation-io.com' !== persistedUserInfo.email && item.accountName === 'facebook') {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible
        if (loading.state) {
          // If loading state was true, clear it
          setLoading({ state: false, badge: '' });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading.state]);

  const handleFarcaster = async (title, type, value) => {
    try {
      const payload = {
        uuid: persistedUserInfo.uuid,
        accountId: value.fid,
        accountName: title,
        isVerified: true,
        type: type,
        data: value,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.eyk = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge/addFarCasterBadge/add`, payload);
      setIsButtonClicked(false);
      if (addBadge?.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'error', {}, error.response?.data.message.split(':')[1]);
    }
  };

  const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'on.foundation',
    siweUri: 'https://example.com/login',
  };

  const triggerFarcaster = () => {
    setIsButtonClicked(true);
    const a = document.querySelector('._1n3pr301');
    a.click();
  };

  const checkPassKeyBadge = (accountName, type) => {
    return persistedUserInfo?.badges.some((badge) => badge.accountName === accountName && badge.type === type);
  };

  const handleGuestBadgeAdd = () => {
    dispatch(setGuestSignUpDialogue(true));
    return;
  };

  return (
    <>
      <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
        Adding social media accounts helps verify that you're a real human contributing to the Foundation platform.
      </h1>
      <AuthKitProvider config={config}>
        <div className="hidden">
          <SignInButton
            onClick={() => console.log('testing clicking....')}
            onSuccess={(data) => {
              isButtonClicked && handleFarcaster('Farcaster', 'farcaster', data);
            }}
          />
        </div>
        <div className="hidden"></div>
      </AuthKitProvider>
      <div className="flex flex-col items-center justify-between rounded-[16.068px] pt-[10px] tablet:pt-[18.73px]">
        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {socials.map((item, index) => (
            <div
              className="relative flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5"
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
              <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                <h1 className="text-[2.11vw] font-medium leading-normal text-black dark:text-gray-400 tablet:text-[20px]">
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
                  if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
                    handleGuestBadgeAdd();
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
                    const timeRemaining = CanAdd(persistedUserInfo, item.type, 'social');
                    if (timeRemaining === true || checkPseudoBadge()) {
                      if (
                        (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                        (checkLegacyBadge() && getAskPasswordFromRedux)
                      ) {
                        await handleOpenPasswordConfirmation();
                      }
                      if (item.accountName === 'Farcaster' && !checkPassKeyBadge(item.accountName, item.type)) {
                        triggerFarcaster();
                        return;
                      }
                      setLoading({ state: true, badge: item.accountName });
                      localStorage.setItem('target-url', `${window.location.href}`);
                      window.location.href = `${import.meta.env.VITE_API_URL}${item.link}`;
                      <SocialConnectPopup />;
                    } else {
                      toast.warning(
                        `You need to wait just ${timeRemaining} more days before you can unlock this badge.`
                      );
                    }
                  }
                }}
              >
                {loading.state === true && loading.badge === item.accountName ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : (
                  <>
                    {checkSocial(item.accountName) ? (checkPrimary(item.accountName) ? 'Added' : 'Remove') : 'Add'}
                    <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
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
