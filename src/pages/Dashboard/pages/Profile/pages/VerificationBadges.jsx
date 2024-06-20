import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Loader from '../../../../Signup/components/Loader';
import api from '../../../../../services/api/Axios';
import { LoginSocialFacebook } from './ReactFacebook';
import { LoginSocialLinkedin } from './ReactLinkedIn';
import { LoginSocialYoutube } from './ReactYoutube';
import VerificationPopups from '../components/VerificationPopups';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import { TwitterAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { authentication } from './firebase-config';
import Personal from './verification-badges/Personal';
import Web3 from './verification-badges/Web3';
import { InstagramLogin } from '@amraneze/react-instagram-login';
import Contact from './verification-badges/Contact';
// import { useErrorBoundary } from 'react-error-boundary';
import { useQueryClient } from '@tanstack/react-query';
import Legacy from './verification-badges/Legacy';
import LegacyConfirmationPopup from '../../../../../components/dialogue-boxes/LegacyConfirmationPopup';
import { startRegistration } from '@simplewebauthn/browser';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import showToast from '../../../../../components/ui/Toast';
import { getAskPassword } from '../../../../../features/profile/userSettingSlice';
import { badgesTotalLength } from '../../../../../constants/varification-badges';

const VerificationBadges = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const { showBoundary } = useErrorBoundary();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState();
  const legacyPromiseRef = useRef();
  const persistedContants = useSelector(getConstantsValues);
  const getAskPasswordFromRedux = useSelector(getAskPassword);

  const checkPrimary = (itemType) =>
    persistedUserInfo?.badges?.some((i) => i.accountName === itemType && i.primary === true);

  const checkLegacyBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.legacy ? true : false));

  const loginInWithInsta = async (code) => {
    try {
      // return
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/get-insta-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the correct Content-Type
        },
        body: JSON.stringify({
          clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
          clientSecret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET,
          redirectUri: `${import.meta.env.VITE_CLIENT_URL}/dashboard/profile`,
          code: code,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoading(true);
        handleAddBadge('instagram', data);
      } else {
        const data = await response.json();
        // showBoundary(JSON.stringify(data)); // Stringify the error object
        console.error('Error fetching Instagram profile:', data);
      }
    } catch (error) {
      // showBoundary(JSON.stringify(error)); // Stringify the error object
      console.error('Error fetching Instagram profile:', error.message);
    }
  };

  const loginWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    console.log(authentication);
    signInWithPopup(authentication, provider)
      .then((data) => {
        setIsLoading(true);
        handleAddBadge('twitter', data);
      })
      .catch((err) => {
        // showBoundary(err);
        console.log(err);
      });
  };

  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(authentication, provider)
      .then((data) => {
        setIsLoading(true);
        handleAddBadge('github', data);
      })
      .catch((err) => {
        // showBoundary(err);
        console.log(err);
      });
  };

  const handleBadgesClose = () => setModalVisible(false);

  const checkSocial = (name) => persistedUserInfo?.badges?.some((i) => i.accountName === name);

  const handleRemoveBadge = async (accountName) => {
    const findBadge = persistedUserInfo.badges.filter((item) => {
      if (item.accountName === accountName) {
        return item;
      }
    });
    try {
      const removeBadge = await api.post(`/removeBadge`, {
        badgeAccountId: findBadge[0].accountId,
        uuid: persistedUserInfo.uuid,
      });
      if (removeBadge.status === 200) {
        showToast('success', 'badgeRemoval');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddBadge = async (provider, data) => {
    try {
      let id;
      if (provider === 'linkedin') {
        id = data.sub;
      } else if (provider === 'instagram') {
        id = data.user_id;
      } else if (provider === 'facebook') {
        id = data.id;
      } else if (provider === 'twitter') {
        id = data.user.uid;
      } else if (provider === 'github') {
        id = data.user.email;
      } else if (provider === 'youtube') {
        id = data.items[0].id;
      }
      const payload = {
        data,
        provider,
        badgeAccountId: id,
        uuid: persistedUserInfo.uuid,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
      }
    } catch (error) {
      console.log(provider);
      if (provider !== 'instagram') {
        showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      }
    } finally {
      setIsLoading(false);
    }
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

  const handleRemoveBadgePopup = async (item) => {
    console.log(item);
    if (
      (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
      (checkLegacyBadge() && getAskPasswordFromRedux) ||
      item.type === 'password'
    ) {
      await handleOpenPasswordConfirmation();
    }
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleOpenPasswordConfirmation = () => {
    setIsPasswordConfirmation(true);
    return new Promise((resolve) => {
      legacyPromiseRef.current = resolve;
    });
  };
  const handlePasskeyConfirmation = async () => {
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
    console.log(verificationJSON.verified);
    return verificationJSON.verified;
  };

  return (
    <div className="pb-8">
      {/* DELETE MODAL POPUP */}
      {modalVisible && (
        <BadgeRemovePopup
          handleClose={handleBadgesClose}
          modalVisible={modalVisible}
          title={deleteModalState?.title}
          image={deleteModalState?.image}
          accountName={deleteModalState?.accountName}
          type={deleteModalState?.type}
          badgeType={deleteModalState?.badgeType}
          fetchUser={persistedUserInfo}
        />
      )}
      <LegacyConfirmationPopup
        isPopup={isPasswordConfirmation}
        setIsPopup={setIsPasswordConfirmation}
        title="Confirm Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        legacyPromiseRef={legacyPromiseRef}
      />
      {isLoading && <Loader />}

      {/* Summary Section desktop */}
      <div className="mx-6 mb-[15px] hidden tablet:block">
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            {persistedUserInfo?.uuid && persistedUserInfo.role === 'user' ? (
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                  {persistedUserInfo.badges.length}
                </p>
              </div>
            ) : (
              <div className="relative z-50 h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                  alt={'badge'}
                  className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
                />
                <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                  {persistedUserInfo.badges.length}
                </p>
              </div>
            )}
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Verification badge score
            </h1>
          </div>
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo.badges.length}/{badgesTotalLength}
          </h1>
        </div>
        <div className="rounded-b-[10px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-medium leading-[113%] text-[#85898C] tablet:text-[16px] tablet:leading-normal">
            Have your data be more desirable for brands and research firms to purchase with more verified info and earn
            more FDX while you’re at it!
          </h1>
        </div>
      </div>

      <div className="mx-4 flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px] tablet:hidden">
        <div className="flex items-center gap-2">
          {persistedUserInfo?.uuid && persistedUserInfo.role === 'user' ? (
            <div className="relative h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
          ) : (
            <div className="relative z-50 h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
          )}
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
            Verification badge score
          </h1>{' '}
        </div>
        <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
          {persistedUserInfo.badges.length}/20
        </h1>
      </div>
      <div
        className={`${
          persistedTheme === 'dark' ? 'dark-shadow-inside' : 'verification-badge-boxShadow bg-white'
        } relative mx-4 mb-8 flex flex-col gap-[7px] rounded-b-[13.7px] px-5 pb-[17.57px] pt-2 tablet:mx-6 tablet:gap-4 tablet:rounded-[15px] tablet:px-[30px] tablet:py-5 laptop:gap-5 laptop:px-5 desktop:px-[40px]`}
      >
        <h1 className="mb-[10px] mt-[2px] text-[12px] font-medium leading-[113%] text-[#85898C] tablet:hidden tablet:text-[16px] tablet:leading-normal">
          Have your data be more desirable for brands and research firms to purchase with more verified info and earn
          more FDX while you’re at it!
        </h1>

        <Contact
          fetchUser={persistedUserInfo}
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          checkLegacyBadge={checkLegacyBadge}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          getAskPassword={getAskPasswordFromRedux}
        />

        <h1 className="font-Inter text-[9.74px] font-medium text-black tablet:text-[22px] tablet:leading-[18px] dark:text-white">
          Social
        </h1>

        {/* all */}
        <div className="flex flex-col items-center gap-[5px] rounded-[16.068px] border-[#DEE6F7] bg-[#FDFDFD] tablet:gap-4 tablet:border-[3px] tablet:py-[22px]">
          {/* Facebook */}
          <div className="relative flex items-center gap-[8.5px] laptop:gap-2 desktop:gap-5">
            <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
              {checkPrimary('facebook') && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                  alt="primary"
                  className="size-[15px] tablet:size-[30px]"
                />
              )}
            </div>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`}
              alt="Facebook"
              className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:size-[50px] tablet:min-h-[50px] tablet:min-w-[50px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                Facebook
              </h1>
            </div>
            {checkSocial('facebook') ? (
              <Button
                color={checkSocial('facebook') ? (checkPrimary('facebook') ? 'yellow' : 'red') : 'blue'}
                onClick={async () => {
                  if (persistedUserInfo?.role === 'guest') {
                    handleGuestBadgeAdd();
                  } else {
                    checkSocial('facebook') &&
                      handleRemoveBadgePopup({
                        title: 'facebook',
                        image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
                        accountName: 'facebook',
                      });
                  }
                }}
                disabled={checkPrimary('facebook')}
              >
                {checkSocial('facebook') ? (checkPrimary('facebook') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('facebook') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('facebook') ? (checkPrimary('facebook') ? 'yellow' : 'red') : 'blue'}
                onClick={handleGuestBadgeAdd}
                disabled={checkPrimary('facebook')}
              >
                {checkSocial('facebook') ? (checkPrimary('facebook') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('facebook') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : (
              <LoginSocialFacebook
                client_id={import.meta.env.VITE_FB_APP_ID}
                onResolve={async ({ provider, data }) => {
                  if (
                    (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                    (checkLegacyBadge() && getAskPasswordFromRedux)
                  ) {
                    await handleOpenPasswordConfirmation();
                  }
                  setIsLoading(true);
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                onReject={(err) => {
                  showToast('error', 'errorAddingBadge');
                  setIsLoading(false);
                  console.log(err);
                }}
              >
                <Button color={checkSocial('facebook') ? 'red' : 'blue'}>
                  {checkSocial('facebook') ? '' : 'Add Badge'}
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                    {checkSocial('facebook') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                  </span>
                </Button>
              </LoginSocialFacebook>
            )}
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-[8.5px] opacity-[100%] laptop:gap-2 desktop:gap-5">
            <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
              {checkPrimary('linkedin') && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                  alt="primary"
                  className="size-[15px] tablet:size-[30px]"
                />
              )}
            </div>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`}
              alt="LinkedIn"
              className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:size-[50px] tablet:min-h-[50px] tablet:min-w-[50px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                Linked In
              </h1>
            </div>
            {checkSocial('linkedin') ? (
              <>
                <Button
                  color={checkSocial('linkedin') ? (checkPrimary('linkedin') ? 'yellow' : 'red') : 'blue'}
                  onClick={async () => {
                    if (persistedUserInfo?.role === 'guest') {
                      handleGuestBadgeAdd();
                    } else {
                      checkSocial('linkedin') &&
                        handleRemoveBadgePopup({
                          title: 'LinkedIn',
                          image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
                          accountName: 'linkedin',
                        });
                    }
                  }}
                  disabled={checkPrimary('linkedin')}
                >
                  {checkSocial('linkedin') ? (checkPrimary('linkedin') ? 'Added' : 'Remove') : 'Add Badge'}

                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                    {checkSocial('linkedin') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                  </span>
                </Button>
              </>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('linkedin') ? (checkPrimary('linkedin') ? 'yellow' : 'red') : 'blue'}
                onClick={() => {
                  toast.warning(
                    <p>
                      Please{' '}
                      <span
                        className="cursor-pointer text-[#389CE3] underline"
                        onClick={() => navigate('/guest-signup')}
                      >
                        Create an Account
                      </span>{' '}
                      to unlock this feature
                    </p>,
                  );
                  return;
                }}
                disabled={checkPrimary('linkedin')}
              >
                {checkSocial('linkedin') ? (checkPrimary('linkedin') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('linkedin') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : (
              <LoginSocialLinkedin
                // isOnlyGetToken
                client_id={import.meta.env.VITE_LINKEDIN_KEY}
                client_secret={import.meta.env.VITE_LINKEDIN_SECRET}
                onResolve={async ({ provider, data }) => {
                  if (
                    (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                    (checkLegacyBadge() && getAskPasswordFromRedux)
                  ) {
                    await handleOpenPasswordConfirmation();
                  }
                  console.log(provider, data);
                  setIsLoading(true);
                  handleAddBadge(provider, data);
                }}
                redirect_uri={window.location.href}
                // scope="email,openid,profile,w_member_social"
                onReject={(err) => {
                  showToast('error', 'errorAddingBadge');
                  setIsLoading(false);
                  console.log(err);
                }}
              >
                <Button
                  color={checkSocial('linkedin') ? 'red' : 'blue'}
                  // disabled={true}
                  // color="gray"
                >
                  {checkSocial('linkedin') ? 'Remove' : 'Add Badge'}
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                    {checkSocial('linkedin') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                  </span>
                </Button>
              </LoginSocialLinkedin>
            )}
          </div>

          {/* Twitter */}
          <div className="flex items-center gap-[8.5px] laptop:gap-2 desktop:gap-5">
            <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
              {checkPrimary('twitter') && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                  alt="primary"
                  className="size-[15px] tablet:size-[30px]"
                />
              )}
            </div>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`}
              alt="Twitter"
              className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:size-[50px] tablet:min-h-[50px] tablet:min-w-[50px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                Twitter
              </h1>
            </div>
            {checkSocial('twitter') ? (
              <Button
                color={checkSocial('twitter') ? (checkPrimary('twitter') ? 'yellow' : 'red') : 'blue'}
                onClick={async () => {
                  if (persistedUserInfo?.role === 'guest') {
                    handleGuestBadgeAdd();
                  } else {
                    checkSocial('twitter') &&
                      handleRemoveBadgePopup({
                        title: 'twitter',
                        image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
                        accountName: 'twitter',
                      });
                  }
                }}
                disabled={checkPrimary('twitter')}
              >
                {checkSocial('twitter') ? (checkPrimary('twitter') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('twitter') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('twitter') ? (checkPrimary('twitter') ? 'yellow' : 'red') : 'blue'}
                onClick={handleGuestBadgeAdd}
                disabled={checkPrimary('twitter')}
              >
                {checkSocial('twitter') ? (checkPrimary('twitter') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('twitter') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : (
              <Button
                color={checkSocial('twitter') ? (checkPrimary('twitter') ? 'yellow' : 'red') : 'blue'}
                onClick={async () => {
                  if (
                    (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                    (checkLegacyBadge() && getAskPasswordFromRedux)
                  ) {
                    await handleOpenPasswordConfirmation();
                  }
                  loginWithTwitter();
                }}
                disabled={checkPrimary('twitter')}
              >
                {checkSocial('twitter') ? (checkPrimary('twitter') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('twitter') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            )}
          </div>

          {/* Instagram */}
          {/* <div className="relative flex items-center gap-[8.5px] laptop:gap-2 desktop:gap-5">
            <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
              {checkPrimary('instagram') && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                  alt="primary"
                  className="size-[15px] tablet:size-[30px]"
                />
              )}
            </div>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`}
              alt="Instagram"
              className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:size-[50px] tablet:min-h-[50px] tablet:min-w-[50px]"
            />
            <div
              className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''
                }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                Instagram
              </h1>
            </div>
            {checkSocial('instagram') ? (
              <>
                <Button
                  color={checkSocial('instagram') ? (checkPrimary('instagram') ? 'yellow' : 'red') : 'blue'}
                  onClick={async () => {
                    if (persistedUserInfo?.role === 'guest') {
                      handleGuestBadgeAdd();
                    } else {
                      checkSocial('instagram') &&
                        handleRemoveBadgePopup({
                          title: 'instagram',
                          image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Instagram-2x.png`,
                          accountName: 'instagram',
                        });
                    }
                  }}
                  disabled={checkPrimary('instagram')}
                >
                  {checkSocial('instagram') ? (checkPrimary('instagram') ? 'Added' : 'Remove') : 'Add Badge'}
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                    {checkSocial('instagram') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                  </span>
                </Button>
              </>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('instagram') ? (checkPrimary('instagram') ? 'yellow' : 'red') : 'blue'}
                onClick={handleGuestBadgeAdd}
                disabled={checkPrimary('instagram')}
              >
                {checkSocial('instagram') ? (checkPrimary('instagram') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px] ">
                  {checkSocial('instagram') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : (
              <InstagramLogin
                clientId={import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
                onSuccess={async (code) => {
                  if (
                    (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                    (checkLegacyBadge() && getAskPasswordFromRedux)
                  ) {
                    await handleOpenPasswordConfirmation();
                  }
                  loginInWithInsta(code);
                }}
                onFailure={(err) => console.log('error', err)}
                redirectUri={window.location.href}
                cssClass={'hideBack'}
              >
                <div
                  className={`${checkSocial('instagram') ? 'bg-[#FF4057] text-white dark:bg-[#C13232]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] text-white dark:bg-[#252D37] dark:from-[#252D37] dark:to-[#252D37]'} flex h-[21.5px] w-[120px] items-center justify-center rounded-[1.31vw] text-[2.65vw] font-semibold leading-normal tablet:h-[50px] tablet:w-[207px] tablet:rounded-[8px] tablet:text-[20px] laptop:rounded-[15px]`}
                >
                  {checkSocial('instagram') ? '' : 'Add Badge'}
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                    {checkSocial('instagram') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                  </span>
                </div>
              </InstagramLogin>
            )}
          </div> */}

          {/* Github */}
          <div className="flex items-center gap-[8.5px] laptop:gap-2 desktop:gap-5">
            <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
              {checkPrimary('github') && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                  alt="primary"
                  className="size-[15px] tablet:size-[30px]"
                />
              )}
            </div>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`}
              alt="Github"
              className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:size-[50px] tablet:min-h-[50px] tablet:min-w-[50px]"
            />
            <div
              className={`${
                persistedTheme === 'dark' ? 'dark-shadow-input' : ''
              }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] tablet:text-[20px] dark:text-[#CACACA]">
                Github
              </h1>
            </div>
            {checkSocial('github') ? (
              <Button
                color={checkSocial('github') ? (checkPrimary('github') ? 'yellow' : 'red') : 'blue'}
                onClick={async () => {
                  if (persistedUserInfo?.role === 'guest') {
                    handleGuestBadgeAdd();
                  } else {
                    checkSocial('github') &&
                      handleRemoveBadgePopup({
                        title: 'github',
                        image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
                        accountName: 'github',
                      });
                  }
                }}
                disabled={checkPrimary('github')}
              >
                {checkSocial('github') ? (checkPrimary('github') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('github') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : persistedUserInfo?.role === 'guest' ? (
              <Button
                color={checkSocial('github') ? (checkPrimary('github') ? 'yellow' : 'red') : 'blue'}
                onClick={handleGuestBadgeAdd}
                disabled={checkPrimary('github')}
              >
                {checkSocial('github') ? (checkPrimary('github') ? 'Added' : 'Remove') : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('github') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            ) : (
              <Button
                color={checkSocial('github') ? 'red' : 'blue'}
                onClick={async () => {
                  if (
                    (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                    (checkLegacyBadge() && getAskPasswordFromRedux)
                  ) {
                    await handleOpenPasswordConfirmation();
                  }
                  loginWithGithub();
                }}
              >
                {checkSocial('github') ? 'Remove' : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('github') ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            )}
          </div>

          {/* Youtube  */}
          {/* <div className="flex items-center gap-[10px] laptop:gap-5">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`}
            alt="Twitter"
            className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
          />
          <div
            className={`${
              persistedTheme === 'dark' ? 'dark-shadow-input' : ''
            }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
          >
            <h1>Youtube</h1>
          </div>
          {checkSocial('youtube') ? (
            <Button
              color={checkSocial('youtube') ? 'red' : 'blue'}
              onClick={() => {
                if (persistedUserInfo?.role === 'guest') {
                  handleGuestBadgeAdd();
                } else {
                  checkSocial('youtube') &&
                    handleRemoveBadgePopup({
                      title: 'youtube',
                      image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`,
                      accountName: 'youtube',
                    });
                }
              }}
            >
              {checkSocial('youtube') ? 'Remove' : 'Add Badge'}
              <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                {checkSocial('youtube') ? '' : `(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
              </span>
            </Button>
          ) : persistedUserInfo?.role === 'guest' ? (
            <Button color={checkSocial('youtube') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
              {checkSocial('youtube') ? 'Remove' : 'Add Badge'}
              <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                {checkSocial('youtube') ? '' : `(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
              </span>
            </Button>
          ) : (
            <LoginSocialYoutube
              // isOnlyGetToken
              client_id={import.meta.env.VITE_GG_APP_ID}
              onResolve={({ provider, data }) => {
                console.log('youtube', data);
                setIsLoading(true);
                handleAddBadge('youtube', data);
              }}
              redirect_uri={window.location.href}
              scope="openid profile email https://www.googleapis.com/auth/youtube.readonly"
              onReject={(err) => {
                  showToast('error','errorAddingBadge')
                setIsLoading(false);
                console.log(err);
              }}
            >
              <Button color={'blue'}>
                {'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {`(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            </LoginSocialYoutube>
          )}
        </div> */}

          {/* SoundCloud */}
          {/* <div className="flex items-center gap-[10px] opacity-[60%] laptop:gap-5">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/soundCloud.svg`}
            alt="Sound Cloud"
            className="h-[23px] min-h-[6.389vw] w-[23px] min-w-[6.389vw] tablet:h-[3.48vw] tablet:min-h-[3.48vw] tablet:w-[3.48vw] tablet:min-w-[3.48vw]"
          />
          <div
            className={`${
              persistedTheme === 'dark' ? 'dark-shadow-input' : ''
            }flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-[#DEE6F7] tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
          >
            <h1>Sound Cloud</h1>
          </div>
          {checkSocial('soundcloud') ? (
            <>
              <Button
                color={checkSocial('soundcloud') ? 'red' : 'blue'}
                onClick={() => {
                  if (persistedUserInfo?.role === 'guest') {
                    handleGuestBadgeAdd();
                  } else {
                    checkSocial('soundcloud') &&
                      handleRemoveBadgePopup({
                        title: 'soundcloud',
                        image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/soundCloud.png`,
                        accountName: 'soundcloud',
                      });
                  }
                }}
              >
                {checkSocial('soundcloud') ? 'Remove' : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                  {checkSocial('soundcloud') ? '' : `(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            </>
          ) : persistedUserInfo?.role === 'guest' ? (
            <Button color={checkSocial('soundcloud') ? 'red' : 'blue'} onClick={handleGuestBadgeAdd}>
              {checkSocial('soundcloud') ? 'Remove' : 'Add Badge'}
              <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                {checkSocial('soundcloud') ? '' : `(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
              </span>
            </Button>
          ) : (
            <Button color={'gray'} onClick={handleSoundCloud} disabled={true}>
              {checkSocial('soundcloud') ? '' : 'Add Badge'}
              <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] laptop:text-[13px]">
                {checkSocial('soundcloud') ? '' : `(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
              </span>
            </Button>
          )}
        </div> */}
        </div>

        <Web3
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          getAskPassword={getAskPasswordFromRedux}
        />
        {/* <Legacy
          fetchUser={persistedUserInfo}
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          checkLegacyBadge={checkLegacyBadge}
        /> */}
        <Personal
          fetchUser={persistedUserInfo}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          handlePasskeyConfirmation={handlePasskeyConfirmation}
          getAskPassword={getAskPasswordFromRedux}
        />
      </div>
    </div>
  );
};

export default VerificationBadges;
