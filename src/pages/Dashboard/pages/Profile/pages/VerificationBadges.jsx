import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../../../Signup/components/Loader';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import Personal from './verification-badges/Personal';
import Web3 from './verification-badges/Web3';
import Contact from './verification-badges/Contact';
import { useQueryClient } from '@tanstack/react-query';
import LegacyConfirmationPopup from '../../../../../components/dialogue-boxes/LegacyConfirmationPopup';
import { startRegistration } from '@simplewebauthn/browser';
import { getAskPassword } from '../../../../../features/profile/userSettingSlice';
import { badgesTotalLength } from '../../../../../constants/varification-badges';
import Privacy from './verification-badges/Privacy';
import Social from './verification-badges/Social';
import ContentCard from '../../../../../components/ContentCard';
import { MetaMaskProvider } from '@metamask/sdk-react';
import Subscription from './verification-badges/Subscription';
import HomepageBadge from './verification-badges/HomepageBadge';

const VerificationBadges = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState(false);
  const legacyPromiseRef = useRef();
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [socialRemoveLoading, setSocialRemoveLoading] = useState(false);

  const checkPrimary = (itemType) =>
    persistedUserInfo?.badges?.some((i) => i.accountName === itemType && i.primary === true);

  const checkLegacyBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.legacy ? true : false));
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));

  const handleBadgesClose = () => setModalVisible(false);
  const checkSocial = (name) => persistedUserInfo?.badges?.some((i) => i.accountName === name);

  const handleRemoveBadgePopup = async (item) => {
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
          setIsLoading={setSocialRemoveLoading}
          loading={socialRemoveLoading}
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

      {/* Summary Section */}
      <ContentCard
        icon={
          persistedUserInfo.role === 'user' ? 'assets/svgs/dashboard/MeBadge.svg' : 'assets/svgs/dashboard/badge.svg'
        }
        title="Verification Badge Score"
        badgeVal={persistedUserInfo?.badges?.length}
        from={persistedUserInfo?.badges.length}
        outof={badgesTotalLength}
      >
        <h1 className="text-[12px] font-medium leading-[13.56px] text-[#85898C] dark:text-white-400 tablet:text-[16px] tablet:leading-normal">
          Boost your earnings now and in the future by adding more verified badges to your profile.
        </h1>
      </ContentCard>
      <ContentCard icon="assets/verification-badges/contact.svg" title="Contact">
        <Contact
          fetchUser={persistedUserInfo}
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          checkLegacyBadge={checkLegacyBadge}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          getAskPassword={getAskPasswordFromRedux}
          checkPseudoBadge={checkPseudoBadge}
        />
      </ContentCard>
      <ContentCard icon="assets/verification-badges/privacy.svg" title="Privacy">
        <Privacy
          checkLegacyBadge={checkLegacyBadge}
          checkPseudoBadge={checkPseudoBadge}
          handleRemoveBadgePopup={handleRemoveBadgePopup}
        />
      </ContentCard>
      <ContentCard icon="assets/verification-badges/social.svg" title="Social">
        <Social
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          checkSocial={checkSocial}
          checkPseudoBadge={checkPseudoBadge}
          checkPrimary={checkPrimary}
        />
      </ContentCard>
      <ContentCard icon="assets/verification-badges/web3.svg" title="Web3">
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            checkInstallationImmediately: false,
            dappMetadata: {
              name: 'Foundation',
              url: window.location.href,
            },
          }}
        >
          <Web3
            handleRemoveBadgePopup={handleRemoveBadgePopup}
            handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
            checkLegacyBadge={checkLegacyBadge}
            checkPseudoBadge={checkPseudoBadge}
            getAskPassword={getAskPasswordFromRedux}
          />
        </MetaMaskProvider>
      </ContentCard>
      <ContentCard icon="assets/verification-badges/personal_icon.svg" title="Personal">
        <Personal
          fetchUser={persistedUserInfo}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          handlePasskeyConfirmation={handlePasskeyConfirmation}
          getAskPassword={getAskPasswordFromRedux}
          checkPseudoBadge={checkPseudoBadge}
        />
      </ContentCard>
      <ContentCard icon="assets/profile/homepagebadges.svg" title="Homepage">
        <HomepageBadge checkPseudoBadge={checkPseudoBadge} />
      </ContentCard>
      <ContentCard icon="assets/profile/subsl_icon.svg" title="Subscribe">
        <Subscription />
      </ContentCard>
    </div>
  );
};

export default VerificationBadges;
